var start_time;
var duration;
var pomodoro_count;
var working;
var timer_running;
var working_task;

$(document).ready(function() {
	start_time = new Date();
	duration = 25;
	pomodoro_count = 0;
	working = false;
	timer_running = false;
	working_task = -1;

	setup_ui();
	update_time();
});

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
	$('.target-des').text($(this).text());
	$('.target-footer').text('Click on the item above to un-select it.');

	// TODO: integrate with the rest of homepage
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
