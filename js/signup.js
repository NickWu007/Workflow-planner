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
      })
});
