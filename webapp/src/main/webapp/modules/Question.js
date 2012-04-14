goog.provide('cursoconducir.Question');

goog.require('jquery');
goog.require('goog.array');
goog.require('goog.json');

/**
 * A Question.
 * 
 * @constructor
 * @param {string} id
 * @param {string} title
 * @param {string} imageKey
 * @param {string} description
 * @param {Array.<string>} possibleAnswers
 * @param {string} explanation
 */
cursoconducir.Question = function(id, title, imageKey, description,
        possibleAnswers, explanation) {
	/**@type {string}*/
    this.id = id;
    this.title = title;
    this.image = imageKey;
    this.description = description;
    this.possibleAnswers = possibleAnswers;
    this.explanation = explanation;
};

/**
 * Creates a new Question object from a js object
 * @param {Object.<string, string, string, string, Array.<Object.<string, number,string, boolean>>, string>} q
 */
cursoconducir.Question.create = function(q) {
    return new cursoconducir.Question(q.id, q.title, q.image, q.description, q.possibleAnswers, q.explanation);
};

/**
 * Gets all the question object from the server
 * @param {function(Array.<cursoconducir.Question>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
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
 * Gets question object from the server with the corresponding IDs
 * @param {Array.<String>} ids
 * @param {function(Array.<cursoconducir.Question>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Question.get = function(ids, success, error, complete) {
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
 * Stores question objects on the server
 * @param {Array.<cursoconducir.Question>} questions
 * @param {function(Array.<cursoconducir.Question>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
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
 * @param {function(Array.<cursoconducir.Question>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
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
