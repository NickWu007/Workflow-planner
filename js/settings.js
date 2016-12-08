var user_ID;
var board_IDs = [];
var board_ID;
var item_IDs = [];
var start_time;
var duration;
var pomodoro_count;
var working;
var timer_running;
var working_task;

// Helper function get user id from the url.
// Creditted to: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

function retrieveBoardId() {
  url  = "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php?user_id=" + user_ID;
  $.ajax({
      url: url,
      type: "GET",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data, status, xhr) {
        // alert("board_ID retireve successful.");
        board_IDs = [];
        for (var i = 0; i < data.length; i++) {
          board_IDs.push(parseInt(data[i]));
        }
        populateBoards();
      },
      error : function(xhr, status){
        if (xhr.status == 401) {
          alert("Username unauthorized. Please go back to login page");
        } else if (xhr.status == 404) {
          alert("User not found.");
        } else {
          alert("Unexpected error. Please try again.");
        }
        window.location.assign('login.html');
      }
    });
}

function populateBoards() {
  $('.boards').empty();
  board_IDs.forEach(function(board_ID, index) {
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php/" + board_ID,
      type: "GET",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data, status, xhr) {
        var markup = '<div class="well board" id="' + board_ID + '">' +
          '<h3>Board #' + (index + 1) + '</h3>' +
          '<p>Description: ' + data.description + '</p>' +
          '<div class="btn btn-info change-board">Change Description</div>  '+
          '<div class="btn btn-danger delete-board">Delete Board</div>' +
          '</div>';
        $('.boards').append(markup);
        $('.change-board').click(changeBoard);
        $('.delete-board').click(deleteBoard);
      },
      error : function(xhr, status){
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  });
}

function addNewBoard() {
  var ans = prompt("Enter board description");

  if (ans != null && ans.length > 0) {
    $.ajax("https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php", {
      type: "POST",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: JSON.stringify({
        "user_ID" : user_ID,
        "description" : ans
      }),
      success: function (data, status, xhr) {
        console.log('board created');
        retrieveBoardId();
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  }
}

function changeBoard() {
  var board_ID = $(this).parent().attr("id");
  var des = $('.board#' + board_ID +" p").text();
  des = des.substr(des.indexOf(":") + 2);

  var ans = prompt("Change board description", des);

  if (ans != null && ans.length > 0) {
    $.ajax("https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php/" + board_ID, {
      type: "POST",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: JSON.stringify({
        "description" : ans
      }),
      success: function (data, status, xhr) {
        console.log('board updated');
        populateBoards();
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  }
}

function deleteBoard() {
  var board_ID = $(this).parent().attr("id");
  if (confirm("Do you want to delete this board?")) {
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php/" + board_ID + "?action=delete",
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function () {
        console.log("board deleted successful");
        retrieveBoardId();
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
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
        alert('logout successful');
        window.location.assign('login.html');
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
}

function changePw() {
  var ans = prompt("Please type in the new password");

  if (ans != null && ans.length > 0 && confirm("Are you sure you want to change password?")) {
    $.ajax("https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/user-php.php/" + user_ID, {
      type: "POST",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      data: JSON.stringify({
        "password" : ans
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
  }
}

function deleteUser() {
  if (confirm("Are you sure you want to delete this account?")) {
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/user-php.php/" + user_ID + "?action=delete",
      type: "GET",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function () {
        console.log("user deleted successful");
        logout();
      },
      error: function (xhr, status) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  }
}

$(document).ready(function() {

  // Get user ID
  user_ID = getQueryVariable("user");
  var username = getQueryVariable("name");
  $('#username').text(username);

  // Get board ID
  retrieveBoardId();
  $('.add-board').click(addNewBoard);
  $('.change-pw').click(changePw);
  $('.delete-user').click(deleteUser);
  $('#logout').click(logout);

});