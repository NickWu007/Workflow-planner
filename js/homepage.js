$(document).ready(function() {

  // Fill columns with items
  populateLists();

  $(".add-item").on("click", addItem());

  $(document).on('click','.close', deleteItem);

});

// deleteItem - Deletes item from list
// TO DO: Delete from database
var deleteItem = function() {

    // Send AJAX call
    $.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/item-php.php", {
      type: "GET",
      dataType: JSON.stringify({
        "new_description" : item}),
      success: function (mlist, textStatus, jqXHR) {
        $(this).closest(".list-group-item").remove();
      },
    });
};

// addItem - Adds item to the list
// TO DO: Add to DB
var addItem = function() {
  var id = event.target.id;

  var item = prompt("Add an item", "Take out trash");

  if (item != false) {
    // Send AJAX call
    $.ajax("http://wwwp.cs.unc.edu/Courses/comp426-f16/users/junaowu/src/api/item-php.php", {
      type: "POST",
      dataType: JSON.stringify({
        "description" : item,
        "status" : status,
        "user_ID" : user_ID,
        "board_ID" : board_ID,
        "pomodoros" : pomodoros,
        "completed" : completed}),
      success: function (mlist, textStatus, jqXHR) {
        var markup = "<li class='list-group-item draggable'>" + item + "<a href='#' class='close' aria-hidden='true'>&times;</a></li>";
        $("." + id).append(markup);
        $(".draggable").draggable();
      },
    });
  }
};


// populateLists - Populates initial lists when logged on
var populateLists = function() {

};
