goog.provide('cursoconducir.Course');
goog.provide('cursoconducir.CourseClient');

goog.require('goog.array');
goog.require('goog.json');

goog.require('cursoconducir.TitledEntityStorageClient');

/** @typedef {{id:?string, title:string, image:?string, description:?string, published:?boolean, lessonIds: Array.<?number>}}*/
cursoconducir.Course = {};

/** @typedef {function(Array.<cursoconducir.Course>, string=,jQuery.jqXHR=)}*/
cursoconducir.Course.onSuccess;

/**
 * @public
 * @constructor
 * @extends {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.CourseClient = function() {
	cursoconducir.TitledEntityStorageClient.call(this, 'course-storage');
};

goog.inherits(cursoconducir.CourseClient, cursoconducir.TitledEntityStorageClient);

/**
 * @public
 * @override
 * Gets all the Course object from the server
 * @param {cursoconducir.Course.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.CourseClient.prototype.getAll = function(success, error, complete) {
	goog.base(this, 'getAll', success, error, complete);
};