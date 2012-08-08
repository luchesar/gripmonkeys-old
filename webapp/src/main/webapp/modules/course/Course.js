goog.provide('cursoconducir.Course');

goog.require('goog.array');
goog.require('goog.json');

/** @typedef {{x: number, y: number}} */
cursoconducir.Course;


/**
 * Gets all the question object from the server
 * @param {function(Array.<cursoconducir.Course>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Course.getAll = function(success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/course-storage?*',
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
 * @param {function(Array.<cursoconducir.Course>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Course.getPaged = function(offset, length, success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/course-storage?offset='+offset+'&length=' + length,
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
 * @param {function(Array.<cursoconducir.Course>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Course.get = function(ids, success, error, complete) {
	var idsString = '';
	$(ids).each(function(){
		idsString += this + ",";
	});
	$.ajax({
		type : "GET",
		url : '/course-storage?key='+idsString,
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
 * @param {Array.<cursoconducir.Course>} questions
 * @param {function(Array.<cursoconducir.Course>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Course.store = function(questions, success, error, complete) {
	var jsonData = {
        json : goog.json.serialize(questions)
    };
	$.ajax({
        type : "POST",
        url : '/course-storage',
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
 * @param {function(Array.<cursoconducir.Course>, string=,Object=)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
 */
cursoconducir.Course.del = function(questionIds, success, error, complete) {
	var idsString = "";
	$(questionIds).each(function(){
		idsString += this + ",";
	});
	$.ajax({
        type : "DELETE",
        url : '/course-storage?key=' + idsString,
        contentType : "application/json; charset=utf-8",
        data : {},
        dataType : 'json',
        success : success,
        error : error,
        complete : complete
    });
};
