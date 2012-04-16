goog.require('goog.testing.jsunit');
goog.require('cursoconducir.admin.LessonsPage');
goog.require('cursoconducir.admin.lessons');
goog.require('jquery');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.MockLesson');
goog.require('cursoconducir.alllessons');
goog.require('cursoconducir.allquestions');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.MockQuestion');

/** @type {cursoconducir.admin.LessonPage} */
var allLessons;
var lessonsContainer;
/** @type {cursoconducir.Lesson} */
var lesson1;
/** @type {cursoconducir.Lesson} */
var lesson2;
/** @type {cursoconducir.Question} */
var question1;
/** @type {cursoconducir.Question} */
var question2;
/** @type {cursoconducir.Question} */
var question3;

/** @type {cursoconducir.MockLesson} */
var mockLesson;

/** @type {cursoconducir.MockQuestion} */
var mockQuestion;

var createButton;

this.setUp = function() {
	$('body').append("<div id='lessonsContainer'/>");
	question1 = new cursoconducir.Question("1", "question1", "q1image",
			"q1description");
	question2 = new cursoconducir.Question("2", "question2", "q2image",
			"q2description");
	question3 = new cursoconducir.Question("3", "question3", "q3image",
			"q3description");
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
	
	init();
};

this.setUpPage = function() {
	mockLesson = new cursoconducir.MockLesson([ lesson1, lesson2 ]);
	mockLesson.setUp();
	
	mockQuestion = new cursoconducir.MockQuestion([question1, question2, question3]);
	mockQuestion.setUp();
};

this.tearDownPage = function() {
	mockLesson.tearDown();
	mockQuestion.tearDown();
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

	createButton = $('#createButton');
	assertNotNullNorUndefined(createButton[0]);
	assertNotNullNorUndefined(createButton[1]);

	assertTrue(createButton.attr('src').endsWith('#create'));
};

var testCancelUrl = function() {
	window.location.hash = "#cancel";
	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);

	createButton = $('#createButton');
	assertNotNullNorUndefined(createButton[0]);
	assertNotNullNorUndefined(createButton[1]);

	assertTrue(createButton.attr('src').endsWith('#create'));
	
	cursoconducir
};

var testCreateUrl = function() {
	$('#createButton').click();

	var saveButton = $('#saveButton');
	var addQuestionsButton = $('#addQuestionsButton');
	var removeQuestionsButton = $('#addQuestionsButton');
	var lessonQuestionsContainer = $('#lessonQuestions');
	var allQuestionsContainer = $('#allQuestions');
	
	assertTrue(addQuestionsButton.attr('class').contains('disabled'));
	assertTrue(removeQuestionsButton.attr('class').contains('disabled'));

	var titleTextField = $('input[type="text"][name="lessonTitle"]');
	var descriptionTextArea = $("textarea[name=lessonDescription]");
	assertEquals('', titleTextField.val());
	assertEquals('', descriptionTextArea.val());
	
	titleTextField.val('createdTestTitle');
	descriptionTextArea.val('createdTestDescription');
	
	assertEquals('No tests yet', lessonQuestionsContainer.text());
	
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer, question1);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer, question2);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer, question3);
	
	allQuestionsContainer.find('input[type=checkbox]').click();
	assertFalse(addQuestionsButton.attr('class').contains('disabled'));
	assertTrue(removeQuestionsButton.attr('class').contains('disabled'));
	
	addQuestionsButton.click();
	
	assertEquals('No tests yet', allQuestionsContainer.text());
	
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer, question1);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer, question2);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer, question3);
	
	saveButton.click();
	
	assertEquals(window.location.hash, '#');
	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);
	
	var createdLesson;
	cursoconducir.Lesson.getAll(function(allLessons){
		assertEquals(3, allLessons.length);
		var savedLesson = allLessons[2];
		assertNotNull('createdTestTitle', savedLesson.id);
		assertEquals('createdTestTitle', savedLesson.title);
		assertEquals('createdTestDescription', savedLesson.description);
		
		createdLesson = savedLesson;
	});
	
	cursoconducir.alllessons.assertLessonPresent(createdLesson);
};

var testEdit = function() {
	fail();
};

var testDelete = function() {
	fail();
};
