goog.provide('cursoconducir.MockLessonClient');

goog.require('cursoconducir.Lesson');
goog.require('goog.array');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.utils');

/**
 * @public
 * @constructor
 * @param {Array.<cursoconducir.Lesson>} lessons
 */
cursoconducir.MockLessonClient = function(allLessons) {
	/**
	 * @private 
	 * @type {goog.testing.PropertyReplacer}
	 */
	var stubs = new goog.testing.PropertyReplacer();
	
	/**
	 * @private
	 * @type {cursoconducir.MockTitledEntityStorageClient}
	 */
	var mockClient = new cursoconducir.MockTitledEntityStorageClient(allLessons);
	
	/**
	 * @public
	 */
	this.setUp = function() {
		stubs.set(cursoconducir.LessonClient.prototype, "getAll", mockClient.getAll);
		stubs.set(cursoconducir.LessonClient.prototype, "get", mockClient.get);
		stubs.set(cursoconducir.LessonClient.prototype, "store", mockClient.store);
		stubs.set(cursoconducir.LessonClient.prototype, "del", mockClient.del);
		stubs.set(cursoconducir.LessonClient.prototype, "count", mockClient.count);
		stubs.set(cursoconducir.LessonClient.prototype, "getPaged", mockClient.getPaged);
		stubs.set(cursoconducir.LessonClient.prototype, "allEntities_", mockClient.allEntities_);
		stubs.set(cursoconducir.LessonClient.prototype, "error", mockClient.error);
		stubs.set(cursoconducir.LessonClient.prototype, "doError", mockClient.doError);
	};
	
	/**
	 * @public
	 */
	this.tearDown = function() {
		stubs.reset();
	};
	
	/**
	 * @public
	 * @param {{status:string, error:string}} error
	 */
	this.setError = function(error) {
		mockClient.setError(error);
		stubs.set(cursoconducir.LessonClient.prototype, "error", mockClient.error);
	};
};