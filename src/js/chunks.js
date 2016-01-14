var receivedFromDht, timerToken, torrent
var connected = 0
var DELAYUPDATE = 1 // mn
var DELAYTIMEOUT = 2 //mn

// Init DHT
var dht = new DHT({ bootstrap: true, verify: ed.verify })
var client = new WebTorrent()
toast.pop("Connecting to the DHT...")

dht.on('ready', function () {
  toast.pop("DHT reached.");
  connected = 1
})

// Inform user if impossible to reach DHT
setTimeout(function () {
  if (!connected) toast.pop("Can't seems to be able to get to the DHT...")
}, DELAYTIMEOUT * 60 * 1000);

function fireWebsite(keyname){

  // Check if we're already doing some torrent stuff
  if (torrent != undefined)
    clearWebsite()

  // Read key
  var pub = keys.readKey(keyname)

  // Location of the data on DHT -- USING VAR LOCATION = BLABLA IS FREEZING ELECTRON F@$#%$#@&^%@S !
  var key = sha1.sync(pub)

  // Some vars
  var magPath = whereAmI + '/src/received/' + keyname + "/magnet"

  // Make dir and touch file new files for non any non existing stuff
  if ( ! fs.existsSync(magPath) ){
    console.log('New address, creating dir');
    mkdirp(whereAmI + '/src/received/' + keyname)
  }

  // Display something if we can
  refreshIframe()

  // Leave if not connected
  if(!connected) {
    toast.pop("Waiting for a DHT connection...")
    return;
  }

  toast.pop('Public key : ' + pub.toString('hex'))
  toast.pop("Getting " + key.toString('hex'))

  // Get stuff from DHT
  getFromDht()

  function getFromDht(){
    // Network reached. Now get interesting stuff
    dht.get(key, function (err, res) {

      // Delayed loop to automatically download updates
      timerToken = setTimeout(getFromDht, DELAYUPDATE*1000*60);

      // Return on error
      if (err){
        toast.pop('Didn\'t get any reply from the DHT')
        console.log(err);
        return
      }

      // TODO : Sanitize > is it a magnet link ?
      receivedFromDht = res.v.toString('Utf8')
      console.log('Received from DHT : \n   ' + receivedFromDht)

      // Check what we received
      // > No new content
      if( jf.readFileSync(magPath) === receivedFromDht ){

        // >> Are we seeding yet ?
        if (torrent === undefined){
          toast.pop('No new content, let\'s turn on the torrent engine')
          popTorrent(receivedFromDht, dht)
        }
        else{
          toast.pop('No new content, and we\'re already seeding')
          return
        }
      }
      // > New content !
      else{
        toast.pop('New content')

        // Store what's received from dht
        jf.writeFileSync(magPath, receivedFromDht)

        // Remove previous torrent
        if (torrent != undefined)
          client.remove(torrent)

        // Pop new torrent
        popTorrent(receivedFromDht, dht)
      }
    })
  }

  function popTorrent(magnet, htable){

    toast.pop('Passing over to the torrent engine');

    // Is that really needed ?
    var window = 'Random Stuff so we can fool webtorrent we\'re not in a browser !'

    var torrentPath = whereAmI + "/src/received/" + keyname + '/'
    client.add(magnet, {dht : htable, path : torrentPath}, function (t){
      torrent = t
      toast.pop('Client downloading ' + torrent.infoHash)
      console.log('  ... there : ' + torrent.path + '\n\n');
      elapsed(torrent)
    })

    function elapsed(t){
      setTimeout(function(){

        // Print some info
        console.log('  =====' + '\nProgress : ' + t.progress*100 + '\nDownloaded: ' + t.downloaded + '\nSpeed: ' + t.downloadSpeed());

        // Delayed loop if tx not finished.
        if (t.progress == 1){
          toast.pop('Download over - now seed !');
          refreshIframe()
        }
        else
          elapsed(t)

      }, 5000) // Every 5 secs
    }
  }



  function refreshIframe(){

    // Do we have some content ?
    if (!fs.existsSync(magPath)){
      jf.writeFileSync(magPath, "someData") // Ugly
      return
    }


    // Force page refresh for debug
    /*
    // Only refresh iframe if path not being currently displayed
    if($('#website').attr('src').indexOf(keyname) !== -1)
      return
    */

    // Stuff should be in received/localWebsiteName/someFolder/someName.html

    // (glob's solving wildcard in pathname)
    var path = glob.sync(whereAmI + "/src/received/" + keyname + "/*/*.html")[0]
    console.log("Displaying " + path);

    // Leave if no path found
    if(!path) return

    // Display website
    toast.pop('Displaying website')
    $('#website').attr('src', path)
  }
}// End fire Website



function clearWebsite(){
  // Stop torrent - is it needed ?
  client.remove(torrent)
  torrent = undefined

  // Clear timeout
  window.clearTimeout(timerToken);

  // Clear iframe
  $('#website').attr('src', '')
}

function quit(msg){
  console.log(msg)
  process.exit(1)
}

var chunks = {
  fireWebsite: fireWebsite,
  clearWebsite: clearWebsite
}

module.exports = chunks
