goog.provide('cursoconducir.Lesson');
goog.provide('cursoconducir.LessonClient');

goog.require('goog.array');
goog.require('goog.json');
goog.require('cursoconducir.TitledEntityStorageClient');

/** @typedef {{id:?string, title:?string, description:?string, questionIds:Array.<?number>}}*/
cursoconducir.Lesson = {};

/** @typedef {function(Array.<cursoconducir.Lesson>, string=,jQuery.jqXHR=)}*/
cursoconducir.Lesson.onSuccess;

/**
 * @public
 * @constructor
 * @extends {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.LessonClient = function() {
	cursoconducir.TitledEntityStorageClient.call(this, 'lesson-storage');
};

goog.inherits(cursoconducir.LessonClient, cursoconducir.TitledEntityStorageClient);

/**
 * @public
 * @override
 * Gets all the Lesson object from the server
 * @param {cursoconducir.Lesson.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.LessonClient.prototype.getAll = function(success, error, complete) {
	goog.base(this, 'getAll', success, error, complete);
};

