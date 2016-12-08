$(document).ready(function() {

  setBg();

  $("#sign-up").on("click", function(){
    $(".form-signin-heading").html("Sign up today");
    $("#sign-up").addClass("active");
    $("#log-in").removeClass("active");
  });

  $('.user-input').focus(function(event) {
    $('.error').text("");
    $('#username').css("border", "none");
    $('#password').css("border", "none");
  });

  $("#log-in").click(function(){
    // $(".form-signin-heading").html("Welcome Back!");
    // $("#log-in").addClass("active");
    // $("#sign-up").removeClass("active");

    console.log('tring to login');
    $('.error').text("");
    var username = $('#username').val();
    var password = $('#password').val();
    if (username.length === 0 || password.length === 0) {
      $('.error').text("Please enter both username and password.");
      $('.error').css("color", "red");
      return;
    }
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/login.php", 
      type: "POST",
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      data: JSON.stringify({
        "username" : username,
        "password" : password
      }),
      success: function(data, status, xhr) {
        // alert("login successful.");
        location.assign("homepage.html?user=" + data + "&name=" + username);
      },
      error : function(xhr, status){
        $('#username').css("border", "red thin solid");
        $('#password').css("border", "red thin solid");

        console.log(xhr.status);
        console.log(xhr.responseText);

        if (xhr.status == 401) {
          $('.error').text("Username or password incorrect. Please try again.");
          $('#password').val("");
        } else if (xhr.status == 404) {
          $('.error').text("User not found.");
          $('#password').val("");
        } else {
          $('.error').text("Unexpected error. Please try again.");
        }
        $('.error').css("color", "red");
      }
    });
  });

});

function setBg() {
  var images = ['img/login1.JPG', 'img/login2.JPG', 'img/login3.JPG'];
  var randomNumber = Math.floor(Math.random() * images.length);
  var bgImg = 'url(' + images[randomNumber] + ')';
  $('body').css({'background-image':bgImg})
}
