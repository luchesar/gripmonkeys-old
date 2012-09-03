goog.provide('cursoconducir.TitledEntityStorageClient');
goog.provide('cursoconducir.TitledEntity');

goog.require('goog.array');
goog.require('goog.json');


/** @typedef {{id:?string, title:string, image:string, published:?boolean, description:string}}*/
cursoconducir.TitledEntity;

cursoconducir.TitledEntity = {};

/** @typedef {function(Array.<cursoconducir.TitledEntity>, string=,jQuery.jqXHR=)}*/
cursoconducir.TitledEntity.onSuccess;

/** @typedef {function(boolean, string=,Object=)}*/
cursoconducir.TitledEntity.onDelSuccess;

/** @typedef {function(number, string=,Object=)}*/
cursoconducir.TitledEntity.onCountSuccess;

/** @typedef {function(XMLHttpRequest,jQuery.jqXHR,Object.<string, *>,*)} */
cursoconducir.TitledEntity.onError;

/** @typedef {function(jQuery.event,XMLHttpRequest,Object.<string, *>)} */
cursoconducir.TitledEntity.onComplate;

/**
 * @public
 * @constructor
 * @param {string} httpPath
 */
cursoconducir.TitledEntityStorageClient = function(httpPath) {
	this.httpPath = httpPath;
};

/**
 * @private
 * @type {string}
 */
cursoconducir.TitledEntityStorageClient.prototype.httpPath;

/**
 * @public
 * Gets all the entities object from the server
 * @param {cursoconducir.TitledEntity.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.getAll = function(success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/' + this.httpPath + '?*',
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * @public
 * Gets a page of questions from the server
 * @param {number} offset
 * @param {number} length
 * @param {cursoconducir.TitledEntity.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.getPaged = function(offset, length, success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/' + this.httpPath + '?offset='+offset+'&length=' + length,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * @public
 * Gets entities object from the server with the corresponding IDs
 * @param {Array.<String>} ids
 * @param {cursoconducir.TitledEntity.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.get = function(ids, success, error, complete) {
	var idsString = '';
	$(ids).each(function(){
		idsString += this + ",";
	});
	$.ajax({
		type : "GET",
		url : '/' + this.httpPath + '?key='+idsString,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * @public
 * Gets all entity objects count
 * @param {boolean} publishedOnly
 * @param {cursoconducir.TitledEntity.onCountSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.count = function(publishedOnly, success, error, complete) {
	$.ajax({
		type : "GET",
		url : '/' + this.httpPath + '?count=' + publishedOnly,
		contentType : "application/json; charset=utf-8",
		data : {},
		dataType : 'json',
		success : success,
		error :error,
		complete : complete
	});
};

/**
 * @public
 * Stores entities objects on the server
 * @param {Array.<cursoconducir.Question>} questions
 * @param {cursoconducir.TitledEntity.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.store = function(questions, success, error, complete) {
	var jsonData = {
        json : goog.json.serialize(questions)
    };
	$.ajax({
        type : "POST",
        url : '/' + this.httpPath,
        data : jsonData,
        dataType : 'json',
        success : success,
        error : error,
        complate: complete
    });    
};

/**
 * @public
 * Deletes entities object from the server with the corresponding IDs
 * @param {Array.<string>} questionIds
 * @param {cursoconducir.TitledEntity.onDelSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.TitledEntityStorageClient.prototype.del = function(questionIds, success, error, complete) {
	var idsString = "";
	$(questionIds).each(function(){
		idsString += this + ",";
	});
	$.ajax({
        type : "DELETE",
        url : '/' + this.httpPath + '?key=' + idsString,
        contentType : "application/json; charset=utf-8",
        data : {},
        dataType : 'json',
        success : success,
        error : error,
        complete : complete
    });
};


