$(document).ready(function() {

  $(".add-item").on("click", function(event) {
    var id, item, markup;

    if ($(this).hasClass("to-do-list")) {
      id = "to-do-list";
    } else if ($(this).hasClass("do-today-list")) {
      id = "do-today-list";
    } else if ($(this).hasClass("in-progress-list")) {
      id = "in-progress-list";
    } else if ($(this).hasClass("done-list")) {
      id = "done-list";
    } else {
      alert('error');
      return;
    }

    item = prompt("Add an item", "Take out trash");

    if (item != false) {
      markup = "<li class='list-group-item draggable'>" + item + "<a href='#' class='close' aria-hidden='true'>&times;</a></li>";
      $("#" + id).append(markup);
      $(".draggable").draggable();
    }
  });

  $(document).on('click','.close', deleteItem);

});

function deleteItem() {
    $(this).closest(".list-group-item").remove();
}
