var timerToken, torrent, key, pub, localData, keyname
var connected = 0
var DELAYUPDATE = 1 // mn
var DELAYTIMEOUT = 2 //mn

// Init DHT
var dht = new DHT({ bootstrap: true, verify: ed.verify })
var client = new WebTorrent()
toast.pop("Connecting to the DHT...")

dht.on('ready', function () {
  toast.pop("DHT reached.")
  connected = 1
})

// Inform user if impossible to reach DHT
setTimeout(function () {
  if (!connected) toast.pop("Can't seems to be able to get to the DHT...")
}, DELAYTIMEOUT * 60 * 1000)


function fireWebsite(k){

  // Read key
  keyname = k
  pub = keys.readKey(keyname)
  key = sha1.sync(pub)

  // Check if we're already doing some torrent stuff
  if (torrent !== undefined)
    clearWebsite()

  // Some vars
  localData = whereAmI + '/src/received/' + keyname + "/magnet"

  // Make dir and touch file new files for non any non existing stuff
  if ( ! fs.existsSync(localData) ){
    console.log('New address, creating dir')
    mkdirp(whereAmI + '/src/received/' + keyname)
  }

  // Display something if we can
  refreshIframe()

  // Leave if not connected
  if(!connected) {
    toast.pop("Waiting for a DHT connection...")
    return
  }

  toast.pop('Public key : ' + pub.toString('hex'))
  toast.pop("Getting " + key.toString('hex'))

  // Get stuff from DHT
  goGet()
}

function goGet(){
  dht.get(key,getCb)
}

function getCb(err, res){

  // Delayed loop to automatically download updates
  timerToken = setTimeout(goGet, DELAYUPDATE*1000*60)

  // Return on error
  if (err){
    toast.pop('Didn\'t get any reply from the DHT')
    console.log(err)
    return
  }


  // TODO : Sanitize > is it a magnet link ?
  console.log('Received from DHT : \n   ' + res.v.toString('Utf8'))

  var read = jf.readFileSync(localData)
  jf.writeFileSync(localData, res)

  // First d/l
  if(read.v === undefined){
    popTorrent(res.v.toString('Utf8'), dht)
  }

  // > No new content
  else if(Buffer(read.v).toString('Utf8') ===  res.v.toString('Utf8')){
    // >> Are we seeding yet ?
    if (torrent === undefined){
      toast.pop('No new content')
      popTorrent(res.v.toString('Utf8'), dht)
    }
    else{
      console.log('No new content, and we\'re already seeding')
      help()
    }
  }

  // > New content !
  else{
    toast.pop('New content')

    if (torrent != undefined)
      client.remove(torrent)

    popTorrent(res.v.toString('Utf8'), dht)
  }
}

function popTorrent(magnet, htable){

  toast.pop('Passing over to the torrent engine')


  // Is that really needed ?
  var window = 'Random Stuff so we can fool webtorrent we\'re not in a browser !'

  var torrentPath = whereAmI + "/src/received/" + keyname + '/'
  client.add(magnet, {dht : htable, path : torrentPath}, function (t){
    torrent = t
    toast.pop('Client downloading ' + torrent.infoHash)
    console.log('  ... there : ' + torrent.path + '\n\n')
    elapsed(torrent)
  })

  function elapsed(t){
    setTimeout(function(){
      console.log('  =====' + '\nProgress : ' + t.progress*100 + '\nDownloaded: ' + t.downloaded + '\nSpeed: ' + t.downloadSpeed)

      if (t.progress == 1){
        toast.pop('Download over - now seed !')
        refreshIframe()
      }
      else
        elapsed(t)
    }, 5000) // Every 5 secs
  }
}



function refreshIframe(){

  // Do we have some content ?
  if (!fs.existsSync(localData)){
    jf.writeFileSync(localData, "someData") // Ugly
    return
  }

  // Force page refresh for debug
  /*
  // Only refresh iframe if path not being currently displayed
  if($('#website').attr('src').indexOf(keyname) !== -1)
    return
  */

  // Stuff should be in received/localWebsiteName/someFolder/someName.html
  var path = glob.sync(whereAmI + "/src/received/" + keyname + "/*/*.html")[0]
  if(!path) return

  // Display website
  toast.pop('Displaying website')
  console.log("Displaying " + path)

  $('#website').attr('src', path)
}




function clearWebsite(){
  // Stop torrent - is it needed ?
  client.remove(torrent)
  torrent = undefined

  // Clear timeout/iframe
  window.clearTimeout(timerToken)
  $('#website').attr('src', '')
}


function help(){
  // Disabled as not working until BT-DHT PR #108's accepted
  /*
  var read = jf.readFileSync(localData)

  var options = {
    k: Buffer(read.k),
    seq: read.seq,
    v: Buffer(read.v),
    sign: Buffer(read.sig)
  }

  dht.put(options, function (err, hash) {
    if (err)
      console.log(err)
    else
      console.log('We just gracefully updated the DHT ! How nice...')
  })
  */
}

function quit(msg){
  console.log(msg)
  process.exit(1)
}

var chunks = {
  fireWebsite: fireWebsite,
}

module.exports = chunks
