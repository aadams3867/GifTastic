$(document).ready(function() {
	//
	// Array of strings
	//
	var topics = [
		{text: "Women's Rugby", search: "rugby+womens"},
		{text: "Epic Catches", search: "rugby+catch"},
		{text: "Rugby Strong!", search: "rugby+stroonggg"},
		{text: "Rugby Skillz Highlights", search: "rugby+skill+highlight"},
		{text: "Rugby Passing Magic", search: "rugby+pass+highlight"}
	]

	//
	// Generic function for displaying rugby buttons
	//
	function renderButtons() {

		// Deletes the buttons before adding new buttons (prevents duplication)
		$('#rugbyButtons').empty();

		// Loops through the array of topics
		for (var i = 0; i < topics.length; i++) {
			var a = $('<button>');
			a.text(topics[i].text); 					// Provides the initial button text
			a.addClass('rugby'); 						// Added a class
			a.attr('data-search', topics[i].search); 	// Added a data-attribute for searching
			$('#rugbyButtons').append(a); 				// Added the button to the HTML
		}

		$("#newButton").focus();						// Puts the cursor in textbox, ready for new input
	}

	renderButtons();

	//
	// The On Click Listeners (static and dynamic)
	//

	// Listens for a click to Add a new button
	$('#submitButton').on('click', function() {
		var userButton = $('#newButton').val().trim();
		
		// Prevents an empty button from being made
		if (userButton != ""){
			var replaced = userButton.split(" ").join("+");		// Replaces whitespaces with "+" for searching
			topics[topics.length] = {"text" : userButton, "search" : replaced};	
			console.log(topics);
			renderButtons();
		}

		$("#newButton").val("") 			// Clears the textbox of last input
			.focus();						// Puts the cursor in textbox, ready for new input

		// We have this line so that users can hit "enter" instead of clicking on the button and it won't move to the next page
		return false;
	});

	// Listens for a click on a rugby button (dynamic)
	// $('button').on('click', function() { --> won't work here
	$(document).on('click', 'button',  function() {
	        var b = $(this).data('search');		// 'this' refers to the button that was clicked
	        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + b + "&api_key=dc6zaTOxFJmzC&limit=10";
	        console.log(queryURL);

	        $.ajax({
	                url: queryURL,
	                method: 'GET'
	            })
	            .done(function(response) {

	                console.log(response);
	                var results = response.data;

	                for (var i = 0; i < results.length; i++) {
	                    var gifDiv = $('<div class="item">');

	                    var rating = results[i].rating;

	                    var r = $('<p>').text("Rating: " + rating);

	                    var gifImage = $('<img>');
	                    	gifImage.attr('src', results[i].images.fixed_height_still.url)
		                    	.attr('data-still', results[i].images.fixed_height_still.url)
		                    	.attr('data-animate', results[i].images.fixed_height.url)
		                    	.attr('data-state', "still")
		                    	.addClass("rugbyImage");

	                    gifDiv.append(r)
	                    	.append(gifImage);

	                    $('#gifsAppearHere').prepend(gifDiv);
	                }

	            });
	    });
	
	// Listens for a click on any image (dynamic)
	// $('.rugbyImage').on('click', function(){ --> won't work here
	$(document).on('click', '.rugbyImage',  function() {

	    var state = $(this).data('state');

	    if (state == "still") {
	        console.log("It was still");
	        $(this).attr('src', $(this).data('animate'))
	               .data('state', 'animate');
	    } else {
	        console.log("It was animated");
	        $(this).attr('src', $(this).data('still'))
	               .data('state', 'still');               
	    }

	});

});