$(document).ready(function() {

    var images = ['img/login1.JPG', 'img/login2.JPG', 'img/login3.JPG'];
    var randomNumber = Math.floor(Math.random() * images.length);
    var bgImg = 'url(' + images[randomNumber] + ')';
    $('body').css({'background-image':bgImg})

    $('#sign-up-form').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                        stringLength: {
                        min: 2,
                    },
                        notEmpty: {
                        message: 'Please enter a valid username'
                    }
                }
            },
        	 email: {
                validators: {
                    notEmpty: {
                        message: 'Please supply your email address'
                    },
                    emailAddress: {
                        message: 'Please supply a valid email address'
                    }
                }
            },

        	password: {
                    validators: {
                        identical: {
                            field: 'confirmPassword',
                            message: 'Confirm your password below - type same password please'
                        }
                    }
                },
          confirmPassword: {
              validators: {
                  identical: {
                      field: 'password',
                      message: 'The password and its confirm are not the same'
                  }
              }
           },
          }
    });

    $('#sign-up').click(function() {
        console.log('trying to sign up');

        var username = $('.username').val();
        var email  = $('.email').val();
        var password = $('.password').val();

        if (username.length === 0 || email.length === 0 || password.length === 0) {
            return;
        }

        $.ajax({
            url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/user-php.php", 
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "username" : username,
                "email" : email,
                "password" : password
            }),
            success: function() {
                alert("register successful. Please enter your info in login page.");
                location.assign("login.html");
            },
            error : function(xhr, status){
                console.log(xhr.status);
                console.log(xhr.responseText);

                if (xhr.status == 400) {
                  $('.error').text("Username already taken. Please try again.");
                } else {
                  $('.error').text("Unexpected error. Please try again.");
                }
                $('.error').css("color", "red");
            }
        });

    });
});
