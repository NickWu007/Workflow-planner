$(document).ready(function() {

  // Fill columns with items
  // populateLists();

  // Get user ID

  // Get board ID


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
