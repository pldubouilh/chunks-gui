window.$ = window.jQuery = require('./js/jquery.js');

const remote = require('remote')
const electron = remote.require('electron')
const app = electron.app;  // Module to control application life.


// Set to process.env.PWD when testing locally using `electron .`
//var whereAmI = process.env.PWD

// Set to app.getPath('userData')
var whereAmI = app.getPath('userData')



console.log('Working there :' + whereAmI)

var DHT = require('bittorrent-dht')
var WebTorrent = require('webtorrent')
var ed = require('ed25519-supercop')

var sha1 = require('simple-sha1')
var fs = require('fs')
var jf = require('jsonfile')

var toast = require('./js/toastie.js')
var keys = require('./js/keysMgmt.js')
var chunks = require('./js/chunks.js');

var glob = require('glob');
var mkdirp = require('mkdirp');

// Does nothing appart from linking all deps together
