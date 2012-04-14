goog.require('goog.testing.jsunit');
goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.Lesson');
goog.require('jquery');

var lessonForm;
var lessonContainer;
var lesson1;

var setUp = function() {
	$('body').append("<div id='testContainer'/>");
	lesson1 = cursoconducir.Lesson.create({
		id: "lesson1Id",
		title: "lesson1",
		description: "lesson1 description",
		questionIds: [1, 2, 3]
	});
	init();
};

var init = function() {
	lessonContainer = $('#testContainer');
	lessonContainer.empty();
	lessonForm = new cursoconducir.LessonForm(lessonContainer);
};

var testShowEmptyModel = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : null
	});
	var lessonContainer = $('#lessonContainer');
	assertNotNullNorUndefined(lessonContainer);

	assertEquals("No lessons selected", lessonContainer.text());
};

var testShowEmptyLesson = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : cursoconducir.Lesson.create({
			id: "",
			title: "",
			description: "",
			questionIds: []
		})
	});
	var lessonContainer = $('#lessonContainer');
	assertNotNullNorUndefined(lessonContainer);

	assertEquals("Create new lesson enter new lesson fields", $('h3[align=center]').text());	
	assertEquals("", $('input[type=text][name=lessonTitle]').val());
	assertEquals("", $("textarea[name=lessonDescription]").val());
	
	
};

var testShowALesson = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : lesson1,
	});
	var lessonContainer = $('#lessonContainer');
	assertNotNullNorUndefined(lessonContainer);
	
	assertEquals("Create new lesson enter new lesson fields", $('h3[align=center]').text());
	assertEquals(lesson1.id, $('input[type=hidden][name=lessonId]').val());
	assertEquals(lesson1.title, $('input[type=text][name=lessonTitle]').val());
	assertEquals(lesson1.description, $("textarea[name=lessonDescription]").val());
};

var testGetLesson = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : cursoconducir.Lesson.create({
			id: "234",
			title: null,
			description: null,
			questionIds: null
		})
	});
	$('input[type=text][name=lessonTitle]').val("lesson1");
	$("textarea[name=lessonDescription]").val("lesson1Description");
	
	/** @type {cursoconducir.Lesson}*/
	var lesson = lessonForm.getLesson();
	assertEquals("234", lesson.id);
	assertEquals("lesson1", lesson.title);
	assertEquals("lesson1Description", lesson.description);
};