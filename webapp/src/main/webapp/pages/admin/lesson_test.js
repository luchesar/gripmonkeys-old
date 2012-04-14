goog.require('goog.testing.jsunit');
goog.require('cursoconducir.admin.LessonsPage');
goog.require('cursoconducir.admin.lessons');
goog.require('jquery');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.MockLesson');
goog.require('cursoconducir.alllessons');

/** @type {cursoconducir.admin.LessonPage} */
var allLessons;
var lessonsContainer;
/** @type {cursoconducir.Lesson} */
var lesson1;
/** @type {cursoconducir.Lesson} */
var lesson2;

/** @type {cursoconducir.MockLesson} */
var mockLesson;

var setUp = function() {
	$('body').append("<div id='lessonsContainer'/>");
	lesson1 = cursoconducir.Lesson.create({
		id : "lesson1Id",
		title : "lesson1",
		description : "lesson1 description",
		questionIds : [ 1, 2, 3 ]
	});
	lesson2 = cursoconducir.Lesson.create({
		id : "lesson2Id",
		title : "lesson2",
		description : "lesson2 description",
		questionIds : [ 1, 2, 3 ]
	});
	mockLesson = new cursoconducir.MockLesson([lesson1, lesson2]);
	mockLesson.setUp();
	init();
};



var init = function() {
	lessonsContainer = $('#lessonsContainer');
	lessonsContainer.empty();
	allLessons = new cursoconducir.admin.LessonPage(lessonsContainer);
	allLessons.start();
};

var testDefaultUrl = function() {
	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);
	
	window.location.hash = '#create';
};

var testCancelUrl = function() {
	
};

var testCreateUrl = function() {
	
};

var testEditUrl = function() {
	
};

