goog.provide('cursoconducir.Question');

goog.require('goog.array');
goog.require('goog.json');


/** @typedef {{id:?string, title:string, image:string,description:string, possibleAnswers:Array.<string>}}*/
cursoconducir.Question;
cursoconducir.Question = {};

/** @typedef {function(Array.<cursoconducir.Question>, string=,Object=)}*/
cursoconducir.Question.onSuccess;

/** @typedef {function(boolean, string=,Object=)}*/
cursoconducir.Question.onDelSuccess;

/** @typedef {function(jQuery.event,jQuery.jqXHR,Object.<string, *>,*)} */
cursoconducir.Question.onError;

/** @typedef {function(jQuery.event,XMLHttpRequest,Object.<string, *>)} */
cursoconducir.Question.onComplate;

/**
 * @public
 * @param {?string} id
 * @param {string} title
 * @param {string} image
 * @param {string} description
 * @param {Array.<string>} possibleAnswers
 * return {cursoconducir.Question}
 */
cursoconducir.Question.create = function(id, title, image, description, possibleAnswers) {
	return {
		id : id,
		title : title,	
		image : image,
		description : description,
		possibleAnswers : possibleAnswers
	};
};

/**
 * Gets all the question object from the server
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.Question.onError=} error
 * @param {cursoconducir.Question.onComplate=} complete
 */
cursoconducir.Question.getAll = function(success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/question-storage?*',
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Gets a page of questions from the server
 * @param {number} offset
 * @param {number} length
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.Question.onError=} error
 * @param {cursoconducir.Question.onComplate=} complete
 */
cursoconducir.Question.getPaged = function(offset, length, success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/question-storage?offset='+offset+'&length=' + length,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Gets question object from the server with the corresponding IDs
 * @param {Array.<String>} ids
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.Question.onError=} error
 * @param {cursoconducir.Question.onComplate=} complete
 */
cursoconducir.Question.get = function(ids, success, error, complete) {
	var idsString = '';
	$(ids).each(function(){
		idsString += this + ",";
	});
	$.ajax({
		type : "GET",
		url : '/question-storage?key='+idsString,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Stores question objects on the server
 * @param {Array.<cursoconducir.Question>} questions
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.Question.onError=} error
 * @param {cursoconducir.Question.onComplate=} complete
 */
cursoconducir.Question.store = function(questions, success, error, complete) {
	var jsonData = {
        json : goog.json.serialize(questions)
    };
	$.ajax({
        type : "POST",
        url : '/question-storage',
        data : jsonData,
        dataType : 'json',
        success : success,
        error : error,
        complate: complete
    });    
};

/**
 * Deletes question object from the server with the corresponding IDs
 * @param {Array.<string>} questionIds
 * @param {cursoconducir.Question.onDelSuccess} success
 * @param {cursoconducir.Question.onError=} error
 * @param {cursoconducir.Question.onComplate=} complete
 */
cursoconducir.Question.del = function(questionIds, success, error, complete) {
	var idsString = "";
	$(questionIds).each(function(){
		idsString += this + ",";
	});
	$.ajax({
        type : "DELETE",
        url : '/question-storage?key=' + idsString,
        contentType : "application/json; charset=utf-8",
        data : {},
        dataType : 'json',
        success : success,
        error : error,
        complete : complete
    });
};
