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

// Timer stuff
function play_audio(audio_id) {
	document.getElementById(audio_id).play();
}

function setup_ui() {
	$('.pomodoro').text(pomodoro_count);
	$('#startstop').click(function() {
		if (working_task < 0) {
			alert("Please select a task to work on");
			return;
		}

		play_audio('ding');
		var state = $(this).text();
		console.log('state = ' + state);

		if (state == "Start") {
			$(this).removeClass('btn-success');
			$(this).addClass('btn-danger');
			start_work();
		} else {
			$(this).text('Start');
			$(this).removeClass('btn-danger');
			$(this).addClass('btn-success');
			working = false;
			timer_running = false;
			$('.status').text('Not started working yet.');
			update_time();
		}
	});

	$('.list-group-item').click(timeable);

	$('.target-des').click(function() {
		if (working_task < 0) return;

		$('.target').addClass('bg-warning');
		$('.target-des').text('No task selected');
		$('.target-footer').text('Click on a task on the board to select it.');
		working_task = -1;
	});
}

function start_work() {
	start_time = new Date();
	duration = 25;
	working = true;
	timer_running = true;

	$('#minutes').text("01");
	$('#seconds').text("00");
	$('.status').text("Working");
	$('#startstop').text("Reset");
	update_time();
}

function start_break() {
	start_time = new Date();

	if (pomodoro_count % 4 === 0) {
		duration = 15;
		$('#minutes').text("15");
		$('.status').text("Long break");
	} else {
		duration = 5;
		$('#minutes').text("05");
		$('.status').text("Short break");
	}
	working  = false;
	timer_running = true;

	$('#seconds').text("00");
	$('#startstop').text("Start");
	update_time();
}

function get_time_difference(earlierDate,laterDate) {
   var nTotalDiff = laterDate.getTime() - earlierDate.getTime();
   var oDiff = new Object();

   oDiff.totSeconds = Math.floor(nTotalDiff/1000);

   oDiff.days = Math.floor(nTotalDiff/1000/60/60/24);
   nTotalDiff -= oDiff.days*1000*60*60*24;

   oDiff.hours = Math.floor(nTotalDiff/1000/60/60);
   nTotalDiff -= oDiff.hours*1000*60*60;

   oDiff.minutes = Math.floor(nTotalDiff/1000/60);
   nTotalDiff -= oDiff.minutes*1000*60;

   oDiff.seconds = Math.floor(nTotalDiff/1000);

   return oDiff;

}

function timeable() {

	$('.target').removeClass('bg-warning');
	// Remove last character (x) which is used to delete tasks
	var str = $(this).text();
	$('.target-des').text(str.substring(0,str.length - 1));
	$('.target-footer').text('Click on the item above to un-select it.');

	working_task = 1;
}

function update_time() {
	if (!timer_running) {
		console.log('timeout cleared');
		$('#minutes').text("25");
		$('#seconds').text("00");
	} else {
		setTimeout(update_time, 1000);
		var current_time = new Date();
		var diff = get_time_difference(start_time, current_time);

		console.log('diff.seconds: ' + diff.seconds);
		if (diff.seconds >= duration * 60 - 1) {
			console.log('completed');
			play_audio('dingling');
			if (working) {
				pomodoro_count += 1;
				$('.pomodoro').text(pomodoro_count);
				start_break();
			} else {
				start_work();
			}
		} else {
			var minutes = duration - 1 - diff.minutes;
			var seconds = 59 - diff.seconds;
			width = (Math.floor(diff.totSeconds/(duration *60)*95)+5) + "%";
			if (minutes < 10){ minutes = "0" + minutes; }
			if (seconds < 10){ seconds = "0" + seconds; }

			$('#minutes').text(minutes);
			$('#seconds').text(seconds);
		}
	}
}

// Homepage
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
        $('.list-group-item').click(timeable);
      },
      error : function(xhr, status){
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    });
  });
}

$(document).ready(function() {

	start_time = new Date();
	duration = 25;
	pomodoro_count = 0;
	working = false;
	timer_running = false;
	working_task = -1;

	setup_ui();
	update_time();

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
  board_ID = $('.boards option:selected').val();
  // Send AJAX call, update db
  console.log(description);
  console.log(user_ID);
  console.log(board_ID);
  console.log(pomodoros);
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
    success: function (data, status, xhr) {
      markup = "<div class='list-group-item draggable item' id=" + data.item_ID + ">"  +
        description  +
        " (0/" + pomodoros + ")"  +
        "<a href='#' class='close' aria-hidden='true'>&times;</a></div>";
        $("#to-do-list").append(markup);
        $(".draggable").draggable();
        $('.list-group-item').click(timeable);
    },
    error: function (xhr, status) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  });
};
