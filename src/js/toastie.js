// Toasting
var toasted = null
var fadeDelay = 8

function pop(msg){

  console.log(msg);
  msg = msg.substring(0, 40)

  // Already toasted ? Reset
  if(toasted){
    var prev = $('.popup').html();
    $('.popup').html(prev + '<br />' + msg)
    window.clearTimeout(toasted);
  }
  else // fresh toast !
    $('.popup').html(msg)

  // Display if not hovered
  if( ! $(".popup").is(':hover') )
    $(".popup").css('opacity', '1')

  // Callback to fadeout
  toasted = setTimeout(function(){
    $('.popup').css('opacity', '0')
    toasted = null
  }, fadeDelay*1000);
}


function updateAvailable(){
  msg = '<div style="opacity: 1;" class="popup smoothTransition">Update available. Download ?<div><div class="ripple button"><div class="center">Yep</div></div> &nbsp; &nbsp; <div class="ripple button"><div class="center">Nope</div></div></div></div>'
  toastButtons(msg)
}

function updateDld(){
  msg = '<div style="opacity: 1;" class="popup smoothTransition">Update downloaded. Display ?<div><div class="ripple button"><div class="center">Yep</div></div> &nbsp; &nbsp; <div class="ripple button"><div class="center">Nope</div></div></div></div>'
  toastButtons(msg)
}

function toastButtons(msg){
  // Already toasted ? Reset
  if(toasted){
    //var prev = $('.popup').html();
    //$('.popup').html(prev + '<br />')
    window.clearTimeout(toasted);
    $(".popup").html(msg)
  }
  //else // fresh toast !
    //$('.popup').html(msg)

  $(".popup").css('opacity', '1').html(msg)
}

var toastie = {
  pop: pop,
  updateAvailable: updateAvailable,
  updateDld: updateDld
}

module.exports = toastie
