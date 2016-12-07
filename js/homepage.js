var user_ID;
var board_IDs = [];
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
        alert("board_ID retireve successful.");
        board_IDs = [];
        for (var i = 0; i < data.length; i++) {
          board_IDs.push(parseInt(data[i]));
        }
        populateBoards(board_IDs);
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
        console.log(data);
        $('.boards').append($("<option>").attr('value',board_ID).text(data.description));
      },
      error : function(xhr, status){
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  });

  $('.boards').val(board_IDs[0]);
  console.log($('.boards option:selected').val());
  $('.boards').change(retrieveItems);
  retrieveItems();
}

function retrieveItems() {
  var board_ID = $('.boards option:selected').val();
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
        alert("item_ID retireve successful.");
        item_IDs = [];
        for (var i = 0; i < data.length; i++) {
          console.log('item_id: ' + parseInt(data[i]));
          item_IDs.push(parseInt(data[i]));
        }
        populateItems(item_IDs);
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
        console.log(data);
        
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
  user_ID = getQueryVariable("user");

  // Get board ID
  retrieveBoardId();

  // Function for adding items
  $(document).on('click', '.add-item', addItem);

  // Function for deleting items
  $(document).on('click','.close', deleteItem);

});

// deleteItem - Deletes item from list
// TO DO: Delete from database
var deleteItem = function() {

    // Send AJAX call
    //$.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/item-php.php", {
    //  type: "GET",
    //  dataType: JSON.stringify({
    //    "new_description" : item}),
    //  success: function (mlist, textStatus, jqXHR) {
        $(this).closest(".list-group-item").remove();
    //  },
  //  });
};

// addItem - Adds item to the list
// TO DO: Add to DB
var addItem = function() {

  var id, status, description, markup, user_ID, board_ID, pomodoros, completed;

  if ($(this).hasClass("to-do-list")) {
    id = "to-do-list";
    status = 0;
  } else if ($(this).hasClass("do-today-list")) {
    id = "do-today-list";
  } else if ($(this).hasClass("in-progress-list")) {
    id = "in-progress-list"
    status = 1;
  } else if ($(this).hasClass("done-list")) {
    id = "done-list";
    status = 2;
  } else {
    alert('error');
    return;
  }

  description = prompt("Add an item", "Take out trash");

  if (description != false) {
    // Send AJAX call
    // $.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/item-php.php", {
    //   type: "POST",
    //   dataType: "json",
    //   data: JSON.stringify({
    //     "description" : description,
    //     "status" : status,
    //     "user_ID" : 1,
    //     "board_ID" : 1,
    //     "pomodoros" : 0,
    //     "completed" : 0}),
    //   success: function (data, status, xhr) {

        if (description != false) {
          markup = "<li class='list-group-item draggable'>" + description + "<a href='#' class='close' aria-hidden='true'>&times;</a></li>";
          $("#" + id).append(markup);
          $(".draggable").draggable();
        }
    //   },
    //   error: function (xhr, status) {
    //     alert('Error adding item');
    //   }
    // });
  }
};


/** populateLists - Populates initial lists when logged on
var populateLists = function() {

  // Send AJAX call
  $.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/item-php.php", {
    type: ,
    dataType: ,
    success: function (data, status, xhr) {


    },
    error: function (xhr, status) {
      alert('Error populating list');
    }
  });

};


// updateItem - updates item if moved or completed
var updateItem = function {

}
*/
