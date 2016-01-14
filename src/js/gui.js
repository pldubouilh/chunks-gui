jQuery.fn.popIn = function() {
    return this.css('opacity', '1')
};

jQuery.fn.popOut = function() {
    return this.css('opacity', '0')
};

jQuery.fn.togglePop = function() {
  return this.css('opacity', function(i, visibility) {
      return (visibility == '1') ? '0' : '1';
  });
};

jQuery.fn.bringIn = function() {
    return this.css('z-index', '99')
};

jQuery.fn.bringOut = function() {
    return this.css('z-index', '-99')
};


// Set keys on gui
keys.setKeysOnGui()


// Bring menu when menu-trigger's clicked
$('.menu-trigger').click(function(){
  $('.menu-view').popIn().bringIn()
})


// Kick out any overlay when it's being clicked
$('.overlay').click(function(event){

  // Don't remove overlay if a fa's clicked
  if ( $(event.target).hasClass('fa') )
    return

  // Don't remove overylay if a key's being added
  if($('.keyTitle').text() === 'Any nickname for this key ?')
    return

  // Remove
  setTimeout(function(el){
    $(el).popOut().bringOut()
  }, 50, this);
})
$('.pubKeyInput, .keyTitle, .pubKeyButton').click(function(event){
  // Appart from when it's the title, or button, or user entered text
  event.stopPropagation()
});


// Add key on enter/click on pubKeyButton
$('.pubKeyInput').keydown(function(e){
  if(e.keyCode == 13){
    e.stopPropagation()
    storeKeyHandler()
    return false // seems to prevent the newline
  }
  else if(e.keyCode == 27)  // Hide if esc pressed
    $('.new-key-view').popOut().bringOut()
});
$('.pubKeyButton').click(function(){
  storeKeyHandler()
})

// Key handler - Ask for name and stuff
var providedKey
var timeoutToken
function storeKeyHandler(){
  var titleName = 'Any nickname for this key ?'
  var titleKey = 'Paste your public key here'
  var titleIncorrect = 'Incorrect key'

  // We need content !
  var title = $('.keyTitle').html()
  if($('.pubKeyInput').val() === '')
    return

  // Key input'd
  if( title === titleKey || title === titleIncorrect){
    // keep key and ask for a name
    providedKey = $('.pubKeyInput').val()

    // Sanitize - should be an hex string
    if(!providedKey.match(/[0-9A-Fa-f]{64}/g)){
      $('.keyTitle').html('Incorrect key')

      // Callback to fadeout
      timeoutToken = setTimeout(function(){
        $('.keyTitle').html('Paste your public key here')
        timeoutToken = null
      }, 5000);
      return
    }

    $('.keyTitle').html(titleName)
    $('.pubKeyInput').val('')
  }
  else if (title === titleName){

    // reset any existing token
    if(timeoutToken){
      clearTimeout(timeoutToken)
      timeoutToken = null
    }
    timeoutToken = setTimeout(function(){
      $('.keyTitle').html('Paste your public key here')
      timeoutToken = null
    }, 5000);

    var providedName = $('.pubKeyInput').val()
    keys.storeNewPubKey(providedKey, providedName)

    $('.new-key-view').popOut().bringOut()
    $('.pubKeyInput').val('')
    $('.keyTitle').html(titleKey)
  }
}

// Fire website when label clicked
$(document).on("click", ".label",function(){
  if ($(this).parent().hasClass('newPubKey-trigger')){
    // Hide menu, and fire new key view
    $('.menu-view').popOut().bringOut()
    $('.new-key-view').popIn().bringIn()
    $('.pubKeyInput').focus()
  }
  else
    chunks.fireWebsite( $(this).html().replace(/(<([^>]+)>)/ig,"") ) // Value - icons html tags
})


// Copy key when copy clicked
$(document).on("click", ".copy",function(e){
  // Get key
  var keyName = $(this).parent().text()
  var key = keys.readKey( keyName ).toString('hex')
  toast.pop(keyName + '\'s key copied')
  copyTextToClipboard(key)
  e.stopPropagation()
})

function copyTextToClipboard(text) {
  // http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select()
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

// Click/double click on remove
var clicked = 0
$(document).on("click", ".remove",function(e){
  e.stopPropagation()
  if (clicked) {
    clicked = 0
    var keyName = $(this).parent().text()
    keys.rmKey(keyName)
  }
  else { // Double click
    clicked++
    setTimeout(function() {
      if (clicked){
        clicked = 0
        toast.pop('Need to double click to remove a key')
      }
    }, 400);
  }
});


// Bump popup when dblclick'd
$(".popup").dblclick(function(){
  $(this).html('').popOut();
})
