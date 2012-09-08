goog.require('goog.testing.jsunit');
goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.MockQuestionClient');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.allquestions');
goog.require('goog.array');

var lessonForm;
var lessonContainer;
var mockQuestion;
var lesson1;
var question1;
var question2;
var question3;

function setUp() {
	question1 = cursoconducir.Question.create("1", "question1", "q1image",
			"q1description");
	question2 = cursoconducir.Question.create("2", "question2", "q2image",
			"q2description");
	question3 = cursoconducir.Question.create("3", "question3", "q3image",
			"q3description");

	$('body').append("<div id='testContainer'/>");
	lesson1 = {
		id : "lesson1Id",
		title : "lesson1",
		description : "lesson1 description",
		questionIds : []
	};

	mockQuestion = new cursoconducir.MockQuestionClient([ question1, question2,
			question3 ]);
	mockQuestion.setUp();

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
		activeLesson : {
			id : "",
			title : "",
			description : "",
			questionIds : []
		}
	});
	var lessonContainer = $('#lessonContainer');
	assertNotNullNorUndefined(lessonContainer);

	assertEquals("Create new lesson enter new lesson fields", lessonContainer
			.find('h3[align=center]').text());
	assertEquals("", lessonContainer.find('input[type=text][name=lessonTitle]')
			.val());
	assertEquals("", lessonContainer.find("textarea[name=lessonDescription]")
			.val());

	var lessonQuestions = lessonContainer.find("#lessonQuestions");
	assertEquals("No questions", lessonQuestions.text());

	var allQuestions = lessonContainer.find('#allQuestions');
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question3, false);
};

var testShowALesson = function() {
	lesson1.questionIds = [ question1.id, question3.id ];
	lessonForm.show({
		allLessons : [],
		activeLesson : lesson1
	});
	var lessonContainer = $('#lessonContainer');
	assertNotNullNorUndefined(lessonContainer);

	assertEquals("Create new lesson enter new lesson fields", lessonContainer
			.find('h3[align=center]').text());
	assertEquals(lesson1.id, lessonContainer.find(
			'input[type=hidden][name=lessonId]').val());
	assertEquals(lesson1.title, lessonContainer.find(
			'input[type=text][name=lessonTitle]').val());
	assertEquals(lesson1.description, lessonContainer.find(
			"textarea[name=lessonDescription]").val());

	var lessonQuestions = lessonContainer.find("#lessonQuestions");
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestions, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestions, question3, false);

	var allQuestions = lessonContainer.find('#allQuestions');
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question2, false);
};

var testShowLessonInTheRightOrder = function() {
	lesson1.questionIds = [ question3.id, question1.id, question2.id ];
	lessonForm.show({
		allLessons : [],
		activeLesson : lesson1
	});
	var lessonContainer = $('#lessonContainer');
	cursoconducir.titledentityassert.assertQuestionBefore(lessonContainer, question3, question1);
	cursoconducir.titledentityassert.assertQuestionBefore(lessonContainer, question3, question2);
	cursoconducir.titledentityassert.assertQuestionBefore(lessonContainer, question1, question2);
};

var testAddRemoveQuestions = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : lesson1
	});

	var addQuestionsButton = lessonContainer.find('#addQuestionsButton');
	var removeQuestionsButton = lessonContainer.find('#removeQuestionsButton');
	var allQuestions = lessonContainer.find('#allQuestions');

	allQuestions.find("input[type='checkbox'][name='" + question1.id + "']")
			.click();
	allQuestions.find("input[type='checkbox'][name='" + question3.id + "']")
			.click();

	addQuestionsButton.click();
	var lessonQuestions = lessonContainer.find("#lessonQuestions");
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestions, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestions, question3, false);
	assertTrue(goog.array.equals([question1.id, question3.id], lessonForm.getLesson().questionIds));

	lessonQuestions.find("input[type='checkbox'][name='" + question1.id + "']")
			.click();
	lessonQuestions.find("input[type='checkbox'][name='" + question3.id + "']")
			.click();
	removeQuestionsButton.click();

	allQuestions = lessonContainer.find('#allQuestions');
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestions, question3, false);
	assertTrue(goog.array.equals([], lessonForm.getLesson().questionIds));
};

var testMoveQuestionUpDown = function() {
	lesson1.questionIds = [question1.id, question2.id, question3.id];
	lessonForm.show({
		allLessons : [],
		activeLesson : lesson1
	});

	var moveQuestionUpButton = lessonContainer.find('#moveQuestionUpButton');
	var moveQuestionDownButton = lessonContainer.find('#moveQuestionDownButton');
	var lessonQuestions = lessonContainer.find("#lessonQuestions");
	
	lessonQuestions.find("input[type='checkbox'][name='" + question3.id + "']")
	.click();
	moveQuestionUpButton.click();
	assertTrue(goog.array.equals([question1.id, question3.id, question2.id], lessonForm.getLesson().questionIds));
	
	moveQuestionUpButton.click();
	assertTrue(goog.array.equals([question3.id, question1.id, question2.id], lessonForm.getLesson().questionIds));
	moveQuestionUpButton.click();
	assertTrue(goog.array.equals([question3.id, question1.id, question2.id], lessonForm.getLesson().questionIds));
	
	moveQuestionDownButton.click();
	assertTrue(goog.array.equals([question1.id, question3.id, question2.id], lessonForm.getLesson().questionIds));
	
	moveQuestionDownButton.click();
	assertTrue(goog.array.equals([question1.id, question2.id, question3.id], lessonForm.getLesson().questionIds));
	
	lessonQuestions.find("input[type='checkbox'][name='" + question2.id + "']")
	.click();
	
	moveQuestionUpButton.click();
	assertTrue(goog.array.equals([question2.id, question3.id, question1.id], lessonForm.getLesson().questionIds));
	moveQuestionUpButton.click();
	assertTrue(goog.array.equals([question2.id, question3.id, question1.id], lessonForm.getLesson().questionIds));
	
	moveQuestionDownButton.click();
	assertTrue(goog.array.equals([question1.id, question2.id, question3.id], lessonForm.getLesson().questionIds));
	moveQuestionDownButton.click();
	assertTrue(goog.array.equals([question1.id, question2.id, question3.id], lessonForm.getLesson().questionIds));
};

var testGetLesson = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : {
			id : "234",
			title : null,
			description : null,
			questionIds : [question1.id, question3.id]
		}
	});
	lessonContainer.find('input[type=text][name=lessonTitle]').val("lesson1");
	lessonContainer.find("textarea[name=lessonDescription]").val(
			"lesson1Description");

	/** @type {?cursoconducir.Lesson} */
	var lesson = lessonForm.getLesson();
	assertEquals("234", lesson.id);
	assertEquals("lesson1", lesson.title);
	assertEquals("lesson1Description", lesson.description);
	assertTrue(goog.array.equals([question1.id, question3.id], lesson.questionIds));
};

var testGetLessonNullId = function() {
	lessonForm.show({
		allLessons : [],
		activeLesson : {
			id : null,
			title : null,
			description : null,
			questionIds : [question1.id, question3.id]
		}
	});
	/** @type {?cursoconducir.Lesson} */
	var lesson = lessonForm.getLesson();
	assertNull(lesson.id);
	
	lessonForm.show({
		allLessons : [],
		activeLesson : {
			title : null,
			description : null,
			questionIds : [question1.id, question3.id]
		}
	});
	lesson = lessonForm.getLesson();
	assertNull(lesson.id);
};