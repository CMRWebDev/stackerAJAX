
$(document).ready( function() {
	$('.unanswered-getter').submit( function(){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(){	
		$('.results').html('');
		var answerers = $(this).find("input[name='answerers']").val();
		getAnswered(answerers);
	});


// this function takes the question object returned by StackOverflow 
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
						 'href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
							question.owner.display_name +
						'</a>' +
				'</p>' +
				'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};



// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
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
	var request = { tagged: tags,
					site: 'stackoverflow',
					order: 'desc',
					sort: 'creation'};
	
	$.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
		.done(function(result){
			var searchResults = showSearchResults(request.tagged, result.items.length);

			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				var question = showQuestion(item);
				$('.results').append(question);
			});
		})
		.fail(function(jqXHR, error){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
};


// this function takes the question object returned by StackOverflow 
// and returns new result to be appended to DOM
var showAnswer = function(answerers) {
	
	// clone our result template code
	var result = $('.templates .answer').clone();
	
	// Set the  answer properties in result
	var answerElem = result.find('.user-name a');
	answerElem.attr('href', answerers.user.link);
	answerElem.text(answerers.user.link);

	// Set the display name properties in result
	var name = result.find('.name');
	name.text(answerers.user.display_name);

	// set the reputaion property in result
	var reputation= result.find('.user_rep').text(answerers.user.reputation);
	var rep = result.find('.user_rep');
	rep.text(answerers.user.reputation);

	// set the score property in result
	var viewed = result.find('.score');
	viewed.text(answerers.score);

	return result;
};


// takes the srting passed through the the search top answers funtion
var getAnswered = function(tag) {

// parameters that are passed to Stackoverflow API
	var request = { tag: tag,
					site: 'stackoverflow',
					period: 'all_time'};

	$.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + request.tag + "/top-answerers/"+ request.period,
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
		.done(function(result){
			var searchResults = showSearchResults(request.tag, result.items.length);
			
			$('.search-results').html(searchResults);

			$.each(result.items, function(i, item) {
				var answer = showAnswer(item);
				$('.search-results').append(answer);
			});
		})
		.fail(function(jqXHR, error){
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
};



















































});