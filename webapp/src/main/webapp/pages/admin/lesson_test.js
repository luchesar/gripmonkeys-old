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
goog.require('goog.string');

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

var pageButtonsContainer;
var feedbackContainer;

this.setUpPage = function() {
	$('body').append("<div id='lessonsContainer'/>");
	$('body').append("<div class='pageButtons'></div>");
	$('body').append("<div class='feedback hide'></div>");
};

this.setUp = function() {
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
		questionIds : [ "1", "2", "3" ]
	});
	lesson2 = cursoconducir.Lesson.create({
		id : "lesson2Id",
		title : "lesson2",
		description : "lesson2 description",
		questionIds : [ "1", "2", "3" ]
	});
	mockLesson = new cursoconducir.MockLesson([ lesson1, lesson2 ]);
	mockLesson.setUp();

	mockQuestion = new cursoconducir.MockQuestion([ question1, question2,
			question3 ]);
	mockQuestion.setUp();

	init();
};

var init = function() {
	lessonsContainer = $('#lessonsContainer');
	pageButtonsContainer = $('.pageButtons');
	feedbackContainer = $('.feedback');
	lessonsContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	allLessons = new cursoconducir.admin.LessonPage(lessonsContainer);
	allLessons.start();

	createButton = $('#createButton');
};

var testDefaultUrl = function() {
	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
};

var testCancelUrl = function() {
	window.location.hash = "#cancel";
	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
};

var testCreateUrl = function() {
	window.location.hash = "#create";

	var saveButton = $('#saveButton');
	var addQuestionsButton = $('#addQuestionsButton');
	var removeQuestionsButton = $('#addQuestionsButton');
	var lessonQuestionsContainer = $('#lessonQuestions');
	var allQuestionsContainer = $('#allQuestions');
	assertNotNullNorUndefined(saveButton[0]);
	assertNotNullNorUndefined(addQuestionsButton[0]);
	assertNotNullNorUndefined(removeQuestionsButton[0]);
	assertNotNullNorUndefined(lessonQuestionsContainer[0]);
	assertNotNullNorUndefined(allQuestionsContainer[0]);

	assertTrue(goog.string.contains(addQuestionsButton.attr('class'),
			'disabled'));
	assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
			'disabled'));

	var titleTextField = $('input[type="text"][name="lessonTitle"]');
	var descriptionTextArea = $("textarea[name=lessonDescription]");
	assertEquals('', titleTextField.val());
	assertEquals('', descriptionTextArea.val());

	titleTextField.val('createdTestTitle');
	descriptionTextArea.val('createdTestDescription');

	assertEquals('No tests yet', lessonQuestionsContainer.text());

	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question1);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question2);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question3);

	allQuestionsContainer.find('input[type=checkbox]').click();
	// assertFalse(goog.string.contains(addQuestionsButton.attr('class'),
	// 'disabled'));
	// assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
	// 'disabled'));

	addQuestionsButton.click();

	assertEquals('No tests yet', allQuestionsContainer.text());

	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question1);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question2);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question3);

	saveButton.click();

	init();

	cursoconducir.alllessons.assertLessonPresent(lesson1);
	cursoconducir.alllessons.assertLessonPresent(lesson2);

	var createdLesson;
	cursoconducir.Lesson.getAll(function(allLessons) {
		assertEquals(3, allLessons.length);
		var savedLesson = allLessons[2];
		assertNotNull('createdTestTitle', savedLesson.id);
		assertEquals('createdTestTitle', savedLesson.title);
		assertEquals('createdTestDescription', savedLesson.description);
		assertTrue(goog.array.equals(
				[ question1.id, question2.id, question3.id ],
				savedLesson.questionIds));

		createdLesson = savedLesson;
	});

	cursoconducir.alllessons.assertLessonPresent(createdLesson);
};

var testEdit = function() {
	assertNotNulNorUndefined($('a[href="#update?lesson=' + lesson1.id + '"]')[0]);
	window.location.hash = "#update?lesson=" + lesson1.id;

	var saveButton = $('#saveButton');
	var addQuestionsButton = $('#addQuestionsButton');
	var removeQuestionsButton = $('#addQuestionsButton');
	var lessonQuestionsContainer = $('#lessonQuestions');
	var allQuestionsContainer = $('#allQuestions');
	assertNotNullNorUndefined(saveButton[0]);
	assertNotNullNorUndefined(addQuestionsButton[0]);
	assertNotNullNorUndefined(removeQuestionsButton[0]);
	assertNotNullNorUndefined(lessonQuestionsContainer[0]);
	assertNotNullNorUndefined(allQuestionsContainer[0]);

	assertTrue(goog.string.contains(addQuestionsButton.attr('class'),
			'disabled'));
	assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
			'disabled'));

	var titleTextField = $('input[type="text"][name="lessonTitle"]');
	var descriptionTextArea = $("textarea[name=lessonDescription]");
	assertEquals(lesson1.title, titleTextField.val());
	assertEquals(lesson1.description, descriptionTextArea.val());
	
	assertEquals('No tests yet', allQuestionsContainer.text());

	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question1);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question2);
	cursoconducir.allquestions.assertQuestionPresent(lessonQuestionsContainer,
			question3);

	titleTextField.val('editedTestTitle');
	descriptionTextArea.val('editedTestDescription');
	
	lessonQuestionsContainer.find('input[type=checkbox]').click();
	removeQuestionsButton.click();

	assertEquals('No tests yet', lessonQuestionsContainer.text());

	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question1);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question2);
	cursoconducir.allquestions.assertQuestionPresent(allQuestionsContainer,
			question3);

	saveButton.click();
};

var testDelete = function() {
	fail();
};
