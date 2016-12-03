$(document).ready(function() {

  $(".add-item").on("click", function(event) {

    var id = event.target.id;

    var item = prompt("Add an item", "Take out trash");

    if (item != false) {
      var markup = "<li class='list-group-item'>" + item + "<a href='#' class='close' aria-hidden='true'>&times;</a></li>";
      $("." + id).append(markup);
    }
  });

  $(document).on('click','.close', deleteItem);

});

function deleteItem() {
    $(this).closest(".list-group-item").remove();
}
