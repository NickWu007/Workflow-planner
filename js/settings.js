$(document).ready(function() {
  user_ID = getQueryVariable("user");
  console.log(user_ID);
  var username = getQueryVariable("name");
  console.log(username);
  $('#username').text(username);


  $('#delete-user').click(deleteUser);
  $('#update-user').click(updateUser);
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

}
