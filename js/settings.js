$(document).ready(function() {
  user_ID = getQueryVariable("user");
  console.log(user_ID);
  var username = getQueryVariable("name");
  console.log(username);
  $('#username').text(username);


  $('#delete-user').click(deleteUser);
  $('#update-user').click(updateUser);
  $('#log-out').click(logout);

  $('#change-password-form').bootstrapValidator({
      // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
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
});

// Creditted to: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  var query = location.search.substring(1);
  console.log(query);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function deleteUser() {

  // TO DO: Before deleting user, delete all boards and all items?

  $.ajax({
    url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/user-php.php/" + user_ID + "?action=delete",
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: function () {
      console.log("user deleted successful");
      location.assign("login.html");
    },
    error: function (xhr, status) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  });
}

function updateUser() {

  // Check new and confirm matches
  var password = $('#new-password').val();
  var confirm = $('#confirm-password').val();

  if (password == confirm) {
    $.ajax("https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/user-php.php/" + user_ID, {
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: JSON.stringify({
            "password" : password
          }),
          success: function (data, status, xhr) {
            console.log('user password updated');
            alert("Your password is changed, please re-login");
            logout();
          },
          error: function (xhr, status) {
            console.log(xhr.status);
            console.log(xhr.responseText);
          }
      });
  } else {
    alert('Passwords did not match');
  }
}

function logout() {
  $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/logout.php",
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function () {
        window.location.assign('login.html');
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
}
