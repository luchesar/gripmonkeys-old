goog.require('goog.testing.jsunit');
goog.require('cursoconducir.CourseForm');
goog.require('cursoconducir.Course');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.MockLessonClient');
goog.require('cursoconducir.titledentityassert');
goog.require('goog.array');

var courseForm;
var courseContainer;
var mockLesson;
var course1;
var lesson1;
var lesson2;
var lesson3;

function setUp() {
	lesson1 = lesson(1);
	lesson2 = lesson(2);
	lesson3 = lesson(3);
	
	$('#testContainer').remove();
	$('body').append("<div id='testContainer'/>");
	course1 = {
		id : "course1Id",
		image: null,
		title : "course1",
		description : "course1 description",
		published: false,
		lessonIds : []
	};

	mockLesson = new cursoconducir.MockLessonClient([ lesson1, lesson2, lesson3 ]);
	mockLesson.setUp();

	init();
};

var init = function() {
	courseContainer = $('#testContainer');
	courseContainer.empty();
	courseForm = new cursoconducir.CourseForm(courseContainer);
};

var testShowEmptyModel = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : null
	});
	var courseContainer = $('#courseContainer');
	assertNotNullNorUndefined(courseContainer);

	assertEquals("No courses selected", courseContainer.text());
};

var testShowEmptyCourse = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : {
			id : "",
			title : "",
			description : "",
			lessonIds : []
		}
	});
	assertEmptyCourse();
};

var testCourseWithEmptyActiveCourseLessonIds = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : {
			id : "",
			title : "",
			description : "",
			lessonIds : null
		}
	});
	assertEmptyCourse();
};

var assertEmptyCourse = function() {
	var courseContainer = $('#courseContainer');
	assertNotNullNorUndefined(courseContainer);

	assertEquals("", courseContainer.find('input[type=text][name=courseTitle]')
			.val());
	assertEquals("", courseContainer.find("textarea[name=courseDescription]")
			.val());

	var courseLessons = courseContainer.find("#courseLessons");
	assertEquals("No lessons", courseLessons.text());

	var allLessons = courseContainer.find('#allLessons');
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson3, false);
}

var testShowACourse = function() {
	course1.lessonIds = [ lesson1.id, lesson3.id ];
	courseForm.show({
		allCourses : [],
		activeCourse : course1
	});
	var courseContainer = $('#courseContainer');
	assertNotNullNorUndefined(courseContainer);

	assertEquals(course1.id, courseContainer.find(
			'input[type=hidden][name=courseId]').val());
	assertEquals(course1.title, courseContainer.find(
			'input[type=text][name=courseTitle]').val());
	assertEquals(course1.description, courseContainer.find(
			"textarea[name=courseDescription]").val());

	var courseLessons = courseContainer.find("#courseLessons");
	cursoconducir.titledentityassert.assertEntityPresent(courseLessons, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(courseLessons, lesson3, false);

	var allLessons = courseContainer.find('#allLessons');
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson2, false);
};

var testShowCourseInTheRightOrder = function() {
	course1.lessonIds = [ lesson3.id, lesson1.id, lesson2.id ];
	courseForm.show({
		allCourses : [],
		activeCourse : course1
	});
	var courseContainer = $('#courseContainer');
	cursoconducir.titledentityassert.assertEntityBefore(courseContainer, lesson3, lesson1);
	cursoconducir.titledentityassert.assertEntityBefore(courseContainer, lesson3, lesson2);
	cursoconducir.titledentityassert.assertEntityBefore(courseContainer, lesson1, lesson2);
};

var testAddRemoveLessons = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : course1
	});

	var addLessonsButton = courseContainer.find('#addLessonsButton');
	var removeLessonsButton = courseContainer.find('#removeLessonsButton');
	var allLessons = courseContainer.find('#allLessons');

	allLessons.find("input[type='checkbox'][name='" + lesson1.id + "']")
			.click();
	allLessons.find("input[type='checkbox'][name='" + lesson3.id + "']")
			.click();

	addLessonsButton.click();
	var courseLessons = courseContainer.find("#courseLessons");
	cursoconducir.titledentityassert.assertEntityPresent(courseLessons, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(courseLessons, lesson3, false);
	assertTrue(goog.array.equals([lesson1.id, lesson3.id], courseForm.getCourse().lessonIds));

	courseLessons.find("input[type='checkbox'][name='" + lesson1.id + "']")
			.click();
	courseLessons.find("input[type='checkbox'][name='" + lesson3.id + "']")
			.click();
	removeLessonsButton.click();

	allLessons = courseContainer.find('#allLessons');
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allLessons, lesson3, false);
	assertTrue(goog.array.equals([], courseForm.getCourse().lessonIds));
};

var testMoveLessonUpDown = function() {
	course1.lessonIds = [lesson1.id, lesson2.id, lesson3.id];
	courseForm.show({
		allCourses : [],
		activeCourse : course1
	});

	var moveLessonUpButton = courseContainer.find('#moveLessonUpButton');
	var moveLessonDownButton = courseContainer.find('#moveLessonDownButton');
	var courseLessons = courseContainer.find("#courseLessons");
	
	courseLessons.find("input[type='checkbox'][name='" + lesson3.id + "']")
	.click();
	moveLessonUpButton.click();
	assertTrue(goog.array.equals([lesson1.id, lesson3.id, lesson2.id], courseForm.getCourse().lessonIds));
	
	moveLessonUpButton.click();
	assertTrue(goog.array.equals([lesson3.id, lesson1.id, lesson2.id], courseForm.getCourse().lessonIds));
	moveLessonUpButton.click();
	assertTrue(goog.array.equals([lesson3.id, lesson1.id, lesson2.id], courseForm.getCourse().lessonIds));
	
	moveLessonDownButton.click();
	assertTrue(goog.array.equals([lesson1.id, lesson3.id, lesson2.id], courseForm.getCourse().lessonIds));
	
	moveLessonDownButton.click();
	assertTrue(goog.array.equals([lesson1.id, lesson2.id, lesson3.id], courseForm.getCourse().lessonIds));
	
	courseLessons.find("input[type='checkbox'][name='" + lesson2.id + "']")
	.click();
	
	moveLessonUpButton.click();
	assertTrue(goog.array.equals([lesson2.id, lesson3.id, lesson1.id], courseForm.getCourse().lessonIds));
	moveLessonUpButton.click();
	assertTrue(goog.array.equals([lesson2.id, lesson3.id, lesson1.id], courseForm.getCourse().lessonIds));
	
	moveLessonDownButton.click();
	assertTrue(goog.array.equals([lesson1.id, lesson2.id, lesson3.id], courseForm.getCourse().lessonIds));
	moveLessonDownButton.click();
	assertTrue(goog.array.equals([lesson1.id, lesson2.id, lesson3.id], courseForm.getCourse().lessonIds));
};

var testGetCourse = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : {
			id : "234",
			title : null,
			description : null,
			lessonIds : [lesson1.id, lesson3.id]
		}
	});
	courseContainer.find('input[type=text][name=courseTitle]').val("course1");
	courseContainer.find("textarea[name=courseDescription]").val(
			"course1Description");

	/** @type {?cursoconducir.Course} */
	var course = courseForm.getCourse();
	assertEquals("234", course.id);
	assertEquals("course1", course.title);
	assertEquals("course1Description", course.description);
	assertTrue(goog.array.equals([lesson1.id, lesson3.id], course.lessonIds));
};

var testGetCourseNullId = function() {
	courseForm.show({
		allCourses : [],
		activeCourse : {
			id : null,
			title : null,
			description : null,
			lessonIds : [lesson1.id, lesson3.id]
		}
	});
	/** @type {?cursoconducir.Course} */
	var course = courseForm.getCourse();
	assertNull(course.id);
	
	courseForm.show({
		allCourses : [],
		activeCourse : {
			title : null,
			description : null,
			lessonIds : [lesson1.id, lesson3.id]
		}
	});
	course = courseForm.getCourse();
	assertNull(course.id);
};

/**
 * @private
 * @param {number} n
 */
var lesson = function(n) {
	return {
		id : "lesson" + n + "Id",
		title : "lesson" + n,
		description : "lesson" + n + " description",
		questionIds : [ "1", "2", "3" ],
		published : false
	};
};