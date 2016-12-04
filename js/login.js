$(document).ready(function() {

  var images = ['img/login1.JPG', 'img/login2.JPG', 'img/login3.JPG'];
  var randomNumber = Math.floor(Math.random() * images.length);
  var bgImg = 'url(' + images[randomNumber] + ')';
  $('body').css({'background-image':bgImg})

})
