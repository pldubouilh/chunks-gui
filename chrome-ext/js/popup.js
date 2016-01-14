$('.item').click(function (e){
  console.log('test embedded page')
  chrome.tabs.executeScript({
    file: './js/alert.js'
  });
})
