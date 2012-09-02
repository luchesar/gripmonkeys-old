goog.provide('cursoconducir.Lesson');

goog.require('goog.array');
goog.require('goog.json');
goog.require('cursoconducir.TitledEntityStorageClient');

/** @typedef {{id:?string, title:?string, description:?string, questionIds:Array.<?number>}}*/
cursoconducir.Lesson;
cursoconducir.Lesson = {};

/** @typedef {function(Array.<cursoconducir.Lesson>, string=,jQuery.jqXHR=)}*/
cursoconducir.Lesson.onSuccess;

/**
 * @private
 * @type {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.Lesson.storageClient = new cursoconducir.TitledEntityStorageClient('lesson-storage');
/**
 * Gets all the lessons object from the server
 * @public
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Lesson.getAll = function(success, error, complete) {
	cursoconducir.Lesson.storageClient.getAll(success, error, complete);
};

/**
 * Gets a page of lessons from the server
 * @param {number} offset
 * @param {number} length
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Lesson.getPaged = function(offset, length, success, error, complete) {
	cursoconducir.Lesson.storageClient.getPaged(offset, length, success, error, complete);
};

/**
 * Gets lesson object from the server with the corresponding IDs
 * @public
 * @param {Array.<String>} ids
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Lesson.get = function(ids, success, error, complete) {
	cursoconducir.Lesson.storageClient.get(ids, success, error, complete);
};

/**
 * Stores lesson objects on the server
 * @public
 * @param {Array.<cursoconducir.Lesson>} lessons
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Lesson.store = function(lessons, success, error, complete) {
	cursoconducir.Lesson.storageClient.store(lessons, success, error, complete);
};

/**
 * Deletes lesson object from the server with the corresponding IDs
 * @public
 * @param {Array.<string>} ids
 * @param {cursoconducir.TitledEntity.onDelSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Lesson.del = function(ids, success, error, complete) {
	cursoconducir.Lesson.storageClient.del(ids, success, error, complete);
};

