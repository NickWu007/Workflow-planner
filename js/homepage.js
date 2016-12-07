var user_ID;
var board_IDs = [];
var board_ID;
var item_IDs = [];

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
        populateBoards(board_IDs);
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

function populateBoards(board_IDs) {
  board_IDs.forEach(function(board_ID) {
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/board-php.php/" + board_ID,
      type: "GET",
      dataType: 'json',
      async: false,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data, status, xhr) {
        $('.boards').append($("<option>").attr('value',board_ID).text(data.description));
      },
      error : function(xhr, status){
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  });

  $('.boards').val(board_IDs[0]);
  $('.boards').change(retrieveItems);
  retrieveItems();
}

function retrieveItems() {
  board_ID = $('.boards option:selected').val();
  url  = "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/item-php.php?user_id=" + user_ID + "&board_id="  + board_ID;
  $.ajax({
      url: url,
      type: "GET",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data, status, xhr) {
        // alert("item_ID retireve successful.");
        item_IDs = [];
        if (data != null && data != undefined) {
          for (var i = 0; i < data.length; i++) {
            item_IDs.push(parseInt(data[i]));
          }
          populateItems(item_IDs);
        } else {
          clearBoard();
        }

      },
      error : function(xhr, status){
        if (xhr.status == 401) {
          alert("Username unauthorized. Please go back tot login page");
        } else if (xhr.status == 404) {
          alert("User not found.");
        } else {
          alert("Unexpected error. Please try again.");
        }
        window.location.assign('login.html');
      }
    });
}

function clearBoard() {
  $('.list-group').empty();
}

function populateItems(item_IDs) {
  item_IDs.forEach(function(item_ID) {
    $.ajax({
      url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/item-php.php/" + item_ID,
      type: "GET",
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function(data, status, xhr) {
        markup = "<div class='list-group-item item draggable' id='" + item_ID + "'>" +
          data.description  +
          " ("  +
          data.completed + "/" + data.pomodoros + ")"  +
          "<a href='#' class='close' aria-hidden='true'>&times;</a></div>";
        $("#to-do-list").append(markup);
        $(".draggable").draggable();
      },
      error : function(xhr, status){
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  });
}

$(document).ready(function() {

  // Fill columns with items
  // populateLists();

  // Get user ID
  //user_ID = getQueryVariable("user");

  // Get board ID
  //retrieveBoardId();

  // Function for adding items
  $(document).on('click', '.add-item', addItem);

  // Function for deleting items
  $(document).on('click','.close', deleteItem);

});

// deleteItem - Deletes item from list
// TO DO: Delete from database
var deleteItem = function() {

  var item_ID = $(this).parent().attr("id");
  console.log(item_ID);
  $.ajax({
    url: "https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/item-php.php/" + item_ID + "?action=delete",
    type: "GET",
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    success: function () {
      console.log("item deleted successful");
      $(".list-group-item#" + item_ID).remove();
    },
    error: function (xhr, status) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  });
};

// addItem - Adds item to the list
// TO DO: Add to DB
var addItem = function() {

  var id, status, description, markup, user, board_ID, pomodoros, completed;

  description = document.getElementById("description").value;
  if (description.length === 0) return;
  pomodoros = document.getElementById("pomodoros").value;
  //board_ID = $('.boards option:selected').val();
  /** Send AJAX call, update db
  $.ajax("https://wwwp.cs.unc.edu/Courses/comp426-f16/users/gregmcd/item-php.php/", {
    type: "POST",
    dataType: 'json',
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    data: JSON.stringify({
      "description" : description,
      "status" : 0,
      "user_ID" : user_ID,
      "board_ID" : board_ID,
      "pomodoros" : pomodoros,
      "completed" : 0}),
    success: function (data, status, xhr) { */
      markup = "<div class='list-group-item draggable item'>"  +
        description  +
        " (0/" + pomodoros + ")"  +
        "<a href='#' class='close' aria-hidden='true'>&times;</a></div>";
        $("#to-do-list").append(markup);
        $(".draggable").draggable();
        $('.list-group-item').click(timeable);
/**    },
    error: function (xhr, status) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  }); */
};
