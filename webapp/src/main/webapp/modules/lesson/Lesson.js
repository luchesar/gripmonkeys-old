goog.provide('cursoconducir.Lesson');

goog.require('goog.array');
goog.require('goog.json');

/**
 * A Question.
 * 
 * @constructor
 * @public
 * @param {string} id
 * @param {string} title
 * @param {string} description
 * @param {Array.<number>} questionIds
 */
cursoconducir.Lesson = function(id, title, description, questionIds) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questionIds = questionIds;
};

/** @typedef {function(Array.<cursoconducir.Lesson>, string=,jQuery.jqXHR=)}*/
cursoconducir.Lesson.onSuccess;

/** @typedef {function(boolean, string=,Object=)}*/
cursoconducir.Lesson.onDelSuccess;

/** @typedef {function(XMLHttpRequest,jQuery.jqXHR,Object.<string, *>,*)} */
cursoconducir.Lesson.onError;

/** @typedef {function(jQuery.event,XMLHttpRequest,Object.<string, *>)} */
cursoconducir.Lesson.onComplate;

/**
 * Gets all the lessons object from the server
 * @public
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.Lesson.onError=} error
 * @param {cursoconducir.Lesson.onComplate=} complete
 */
cursoconducir.Lesson.getAll = function(success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/lesson-storage?*',
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Gets a page of lessons from the server
 * @param {number} offset
 * @param {number} length
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.Lesson.onError=} error
 * @param {cursoconducir.Lesson.onComplate=} complete
 */
cursoconducir.Lesson.getPaged = function(offset, length, success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/lesson-storage?offset='+offset+'&length=' + length,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Gets lesson object from the server with the corresponding IDs
 * @public
 * @param {Array.<String>} ids
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.Lesson.onError=} error
 * @param {cursoconducir.Lesson.onComplate=} complete
 */
cursoconducir.Lesson.get = function(ids, success, error, complete) {
	var idsString = '';
	$(ids).each(function(){
		idsString += this + ",";
	});
	$.ajax({
		type : "GET",
		url : '/lesson-storage?key='+idsString,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * Stores lesson objects on the server
 * @public
 * @param {Array.<cursoconducir.Lesson>} lessons
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.Lesson.onError=} error
 * @param {cursoconducir.Lesson.onComplate=} complete
 */
cursoconducir.Lesson.store = function(lessons, success, error, complete) {
	var jsonData = {
        json : goog.json.serialize(lessons)
    };
	$.ajax({
        type : "POST",
        url : '/lesson-storage',
        data : jsonData,
        dataType : 'json',
        success : success,
        error : error,
        complate: complete
    });    
};

/**
 * Deletes lesson object from the server with the corresponding IDs
 * @public
 * @param {Array.<string>} ids
 * @param {cursoconducir.Lesson.onDelSuccess} success
 * @param {cursoconducir.Lesson.onError=} error
 * @param {cursoconducir.Lesson.onComplate=} complete
 */
cursoconducir.Lesson.del = function(ids, success, error, complete) {
	var idsString = "";
	$(ids).each(function(){
		idsString += this + ",";
	});
	$.ajax({
        type : "DELETE",
        url : '/lesson-storage?key=' + idsString,
        contentType : "application/json; charset=utf-8",
        data : {},
        dataType : 'json',
        success : success,
        error : error,
        complete : complete
    });
};

