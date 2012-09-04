goog.provide('cursoconducir.MockLessonClient');
goog.provide('cursoconducir.alllessons');

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
	};
	
	/**
	 * @public
	 */
	this.tearDown = function() {
		stubs.reset();
	};
};

var assertLessonPresent = function(lesson) {
	var lessonTitle = $("a[href='#update?lesson=" + lesson.id + "']");
	assertNotNullNorUndefined(lessonTitle);
	assertEquals(lesson.title, lessonTitle.text().trim());

	assertNotNullNorUndefined($("div:contains('" + lesson.description + "')")
			.text());

	var checkBox = $("input[type='checkbox'][name='" + lesson.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
};

/**
 * @public
 */
cursoconducir.alllessons.assertLessonPresent = assertLessonPresent;
