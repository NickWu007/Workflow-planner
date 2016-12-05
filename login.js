$(document).ready(function() {

  $("#sign-up").on("click", function(){
    $(".form-signin-heading").html("Sign up today");
    $("#sign-up").addClass("active");
    $("#log-in").removeClass("active");
  });

  $("#log-in").on("click", function(){
    $(".form-signin-heading").html("Welcome Back!");
    $("#log-in").addClass("active");
    $("#sign-up").removeClass("active");

    $('.error').text("");
    var username = $('#username').val();
    var password = $('#password').val();
    $.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/login.php", 
      {type: "POST",
       dataType: "json",
       data: JSON.stringify({
        "username" : username,
        "password" : password}),
       success: function(data, status, xhr) {
        alert("login successful.");
        location.assign("homepage.html");
       },
       error : function(xhr, status){
        $('#username').css("border", "red thin solid");
        $('#password').css("border", "red thin solid");

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
