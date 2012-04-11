goog.provide('cursoconducir.Lesson');

goog.require('jquery');
goog.require('goog.array');
goog.require('goog.json');

/**
 * A Question.
 * 
 * @constructor
 * @param {string} id
 * @param {string} title
 * @param {string} description
 * @param {Array.<int>} questionIds
 */
cursoconducir.Lesson = function(id, title, description, questionIds) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.questionIds = questionIds;
};

/**
 * Creates a new Lesson object from a js object
 * @param {Object.<string, string, string, Array.<int>} lesson
 */
cursoconducir.Lesson.create = function(lesson) {
    return new cursoconducir.Lesson(lesson.id, lesson.title, lesson.description, lesson.questionIds);
};

/**
 * Gets all the lessons object from the server
 * @param {function(Array.<Lesson>, string=,Object|undefined)} success
 * @param {function(XMLHttpRequest, Object, Object)} error
 * @param {function()} complete
 */
cursoconducir.Lesson.getAll = function(success, error, complate) {
	$.ajax({
		type : "GET",
		url : '/lesson-storage?*',
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complate
	});
};

/**
 * Gets lesson object from the server with the corresponding IDs
 * @param {Array.<String>} ids
 * @param {function(Array.<Lesson>, string=,Object|undefined)} success
 * @param {function(XMLHttpRequest, Object, Object)} error
 * @param {function()} complete
 */
cursoconducir.Lesson.get = function(ids, success, error, complete) {
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
 * Stores lesson objects on the server
 * @param {Array.<Lesson>} lessons
 * @param {function(Array.<Question>, string=,Object|undefined)} success
 * @param {function(XMLHttpRequest, Object, Object)} error
 * @param {function()} complete
 */
cursoconducir.Lesson.store = function(lessons, success, error, complete) {
	var jsonData = {
        json : goog.json.serialize(questions)
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
 * @param {Array.<string>} lesson ids
 * @param {function(Array.<Lesson>, string=,Object|undefined)} success
 * @param {function(XMLHttpRequest, Object, Object)=} error
 * @param {function()=} complete
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

