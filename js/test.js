// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .top-answerer').clone();

	// // set the score fpr property in result
	var score = result.find('.user-score');
	score.text(question.score);

	// set the ..post-count for question property in result
	var postCount = result.find('.post-count');
	postCount.text(question.post_count);

	// set some properties related to user
	var user = result.find('.user-profile');
	user.html('<p>Name: <a target="_blank" '+
		'href=http://stackoverflow.com/users/' + question.user.user_id + ' >' +
		question.user.display_name + question.user.profile_image +
		'</a></p>' +
		'<p>Reputation: ' + question.user.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	 console.log(results)
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 
		tagged: tags,
		order: 'desc',
		period: 'month',
		sort: 'creation'
	};
	
	$.ajax({
		url: 'http://api.stackexchange.com/2.2/tags/{tag}/top-answerers/all_time?site=stackoverflow',
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


$(document).ready( function() {
	$('.inspiration-getter').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getUnanswered(tags);
	});
});
 