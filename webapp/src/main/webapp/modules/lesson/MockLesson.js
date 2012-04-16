goog.provide('cursoconducir.MockLesson');
goog.provide('cursoconducir.alllessons');

goog.require('cursoconducir.Lesson');
goog.require('goog.array');
goog.require('goog.testing.PropertyReplacer');
goog.require('jquery');

/**
 * @public
 * @constructor
 * @param {Array.<cursoconducir.Lesson>} lessons
 */
cursoconducir.MockLesson = function(allLessons) {
	/**
	 * @private
	 * @type {Array.<cursoconducir.Lesson>}
	 */
	var lessons = allLessons;

	/**
	 * @private 
	 * @type {goog.testing.PropertyReplacer}
	 */
	var stubs = new goog.testing.PropertyReplacer();
	
	/**
	 * @public
	 */
	this.setUp = function() {
		stubs.set(cursoconducir.Lesson, "getAll", function(success, error, complete) {
			success(lessons);
			complete();
		});
		
		stubs.set(cursoconducir.Lesson, "get", function(ids, success, error, complete) {
			/**@type {Array.<cursoconducir.Lesson>}*/ var  foundLessons = [];
			$(lessons).each(function() {
				if (goog.array.contains(ids, this.id)) {
					goog.array.insert(foundLessons, this);
				}
			});
			success(foundLessons);
			complete();
		});
		
		stubs.set(cursoconducir.Lesson, "store", function(lessons, success, error, complete) {
			var storedLessons = [];
			$(lessons).each(function() {
				this.id = Math.random(); 
				goog.array.insert(storedLessons, this);
			});
			success(storedLessons);
			complete();
		});
		
		stubs.set(cursoconducir.Lesson, "del", function(ids, success, error, complete) {
			/**@type {Array.<cursoconducir.Lesson>}*/ var  newLessons = [];
			$(lessons).each(function() {
				if (!goog.array.contains(ids, this.id)) {
					goog.array.insert(newLessons, this);
				}
			});
			lessons = newLessons;
			success();
			complete();
		});
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
