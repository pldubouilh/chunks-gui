// Store new pubKey
function storeNewPubKey(key, name){

  // Input should already be sanitized
  // Add pub key in a new file in ./keyfolder/
  console.log("User entered public key : " + key);
  toast.pop('Adding new key ' + name)
  var fn = whereAmI + '/src/keyfolder/' + name + ".pub"
  jf.writeFileSync(fn, key)

  // Refresh gui
  setKeysOnGui()
}


// Read a key from keyfile, and provides a useable buffer
// In (str): Keyname >> Out : Ready to use buffer
function readKey(name){
  function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16));
      str = str.substring(2, str.length);
    }
    return result;
  }

  var fn = whereAmI + '/src/keyfolder/' + name + ".pub"
  var pub = jf.readFileSync(fn)
  console.log('Reading keys from ' + fn);
  return Buffer(parseHexString(pub))
}


// Put keys on the menu, according to what's in keyfolder
function setKeysOnGui(newKey){

  console.log('Adding keys to the interface')

  // Reset
  $('.menu').html('')


  // Read keys in keyfolder, and add them to the dom (if we can)
  try {
    var files = fs.readdirSync(whereAmI + '/src/keyfolder/')
  }
  catch (e) {
    toast.pop("Initialization...")
    mkdirp(whereAmI + '/src/received/')
    mkdirp(whereAmI + '/src/keyfolder/')

    $('.menu').append('<div class="item ripple newPubKey-trigger"><div class="label">Import Pub. Key</div></div>')
    return
  }


  // Remove '.gitignore'
  var index = files.indexOf('.gitignore')
  if (index > -1)
    files.splice(index, 1);


  for(var i in files)
    $('.menu').append('<div class="item ripple"><div class="label">' + files[i].slice(0, -4) + '<i class="fa fa-copy copy"></i><i class="fa fa-remove remove"></i></div></div>')

  // Add last entry - Import pub key overlay trigger
  $('.menu').append('<div class="item ripple newPubKey-trigger"><div class="label">Import Pub. Key</div></div>')
}


// Remove a key !
function rmKey(keyName){

  // Delete key
  var fn = whereAmI + '/src/keyfolder/' + keyName + ".pub"
  fs.unlinkSync(fn)
  toast.pop(keyName + ' removed')

  // Refresh keys on gui
  setKeysOnGui()
}


var keysMgmt = {
  setKeysOnGui: setKeysOnGui,
  readKey: readKey,
  storeNewPubKey: storeNewPubKey,
  rmKey: rmKey
}

module.exports = keysMgmt
