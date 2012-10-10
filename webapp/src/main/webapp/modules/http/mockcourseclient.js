goog.provide('cursoconducir.MockCourseClient');

goog.require('cursoconducir.Course');
goog.require('goog.array');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.utils');

/**
 * @public
 * @constructor
 * @param {Array.<cursoconducir.Course>} allCourses
 */
cursoconducir.MockCourseClient = function(allCourses) {
	/**
	 * @private 
	 * @type {goog.testing.PropertyReplacer}
	 */
	var stubs = new goog.testing.PropertyReplacer();
	
	/**
	 * @private
	 * @type {cursoconducir.MockTitledEntityStorageClient}
	 */
	var mockClient = new cursoconducir.MockTitledEntityStorageClient(allCourses);
	
	/**
	 * @public
	 */
	this.setUp = function() {
		stubs.set(cursoconducir.CourseClient.prototype, "getAll", mockClient.getAll);
		stubs.set(cursoconducir.CourseClient.prototype, "get", mockClient.get);
		stubs.set(cursoconducir.CourseClient.prototype, "store", mockClient.store);
		stubs.set(cursoconducir.CourseClient.prototype, "del", mockClient.del);
		stubs.set(cursoconducir.CourseClient.prototype, "count", mockClient.count);
		stubs.set(cursoconducir.CourseClient.prototype, "getPaged", mockClient.getPaged);
		stubs.set(cursoconducir.CourseClient.prototype, "allEntities_", mockClient.allEntities_);
		stubs.set(cursoconducir.CourseClient.prototype, "error", mockClient.error);
		stubs.set(cursoconducir.CourseClient.prototype, "doError", mockClient.doError);
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
		stubs.set(cursoconducir.CourseClient.prototype, "error", mockClient.error);
	};
};