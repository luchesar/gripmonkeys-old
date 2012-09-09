goog.require('cursoconducir.admin.LessonsPage');
goog.require('cursoconducir.admin.lessons');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.MockLessonClient');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.allquestions');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.MockQuestionClient');
goog.require('goog.string');
goog.require('goog.History');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('goog.Uri');
goog.require('cursoconducir.LessonClient');
goog.require('cursoconducir.titledentityassert');

/** @type {cursoconducir.admin.LessonPage} */
var allLessons;
var lessonsContainer;
/** @type {?cursoconducir.Lesson} */
var lesson1;
/** @type {?cursoconducir.Lesson} */
var lesson2;
/** @type {?cursoconducir.Question} */
var question1;
/** @type {?cursoconducir.Question} */
var question2;
/** @type {?cursoconducir.Question} */
var question3;
/** @type {cursoconducir.MockLessonClient} */
var mockLesson;

/** @type {cursoconducir.MockQuestionClient} */
var mockQuestion;

var createButton;

var pageButtonsContainer;
var feedbackContainer;

var testCase = new goog.testing.ContinuationTestCase();
testCase.autoDiscoverTests();

if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

var stubs = new goog.testing.PropertyReplacer();
var initialLocation;

function setUpPage() {
	$('body').append("<div id='lessonsContainer'/>");
	$('body').append("<div class='pageButtons'></div>");
	$('body').append("<div class='feedback hide'></div>");
	initialLocation = window.location;
};

function setUp() {
	question1 = cursoconducir.Question.create("1", "question1", "q1image",
			"q1description");
	question2 = cursoconducir.Question.create("2", "question2", "q2image",
			"q2description");
	question3 = cursoconducir.Question.create("3", "question3", "q3image",
			"q3description");
	lesson1 = {
		id : "lesson1Id",
		title : "lesson1",
		description : "lesson1 description",
		questionIds : [ "1", "2", "3" ]
	};
	lesson2 = {
		id : "lesson2Id",
		title : "lesson2",
		description : "lesson2 description",
		questionIds : [ "1", "2", "3" ]
	};
	mockLesson = new cursoconducir.MockLessonClient([ lesson1, lesson2 ]);
	mockLesson.setUp();

	mockQuestion = new cursoconducir.MockQuestionClient([ question1, question2,
			question3 ]);
	mockQuestion.setUp();
	
	stubs.set(window.location, "hash", "");

	init();
};

function tearDownPage() {
	stubs.set(window, "location", initialLocation);
}

function init() {
	stubs.set(window.location, "hash", "");
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

function testDefaultUrl() {
	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson2, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	var mainTitle = $('#mainTitle');
	assertEquals('Manage Lessons <small>Create new or modify old lessons</small>', mainTitle.html());
};

function testCancelUrl() {
	stubs.set(window.location, "hash", "#cancel");
	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson2, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	var mainTitle = $('#mainTitle');
	assertEquals('Manage Lessons <small>Create new or modify old lessons</small>', mainTitle.html());
};

function testCreateUrl() {
	stubs.set(window.location, "hash", "#create");

	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveButton')[0]);
	}, createUrlTest);
};

function createUrlTest() {
	var mainTitle = $('#mainTitle');
	var saveButton = $('#saveButton');
	var addQuestionsButton = $('#addQuestionsButton');
	var removeQuestionsButton = $('#addQuestionsButton');
	var lessonQuestionsContainer = $('#lessonQuestions');
	var allQuestionsContainer = $('#allQuestions');
	assertNotNullNorUndefined(saveButton[0]);
	assertNotNullNorUndefined(mainTitle[0]);
	assertNotNullNorUndefined(addQuestionsButton[0]);
	assertNotNullNorUndefined(removeQuestionsButton[0]);
	assertNotNullNorUndefined(lessonQuestionsContainer[0]);
	assertNotNullNorUndefined(allQuestionsContainer[0]);
	
	assertEquals('Create a Lesson <small>enter the lesson details</small>', mainTitle.html());

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

	assertEquals('No questions', lessonQuestionsContainer.text());

	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question3, false);

	allQuestionsContainer.find('input[type=checkbox]').click();
	// assertFalse(goog.string.contains(addQuestionsButton.attr('class'),
	// 'disabled'));
	// assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
	// 'disabled'));

	addQuestionsButton.click();

	assertEquals('No questions', allQuestionsContainer.text());

	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question3, false);

	saveButton.click();

	init();

	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, lesson2, false);

	var createdLesson;
	new cursoconducir.LessonClient().getAll(function(allLessons) {
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

	cursoconducir.titledentityassert.assertEntityPresent(lessonsContainer, createdLesson, false);
};

function testEdit() {
	assertNotNullNorUndefined($('a[eid="' + lesson1.id + '"]')[0]);
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("lesson", lesson1.id);
	locationUri.setFragment("update?lesson=" + lesson1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveButton')[0]);
	}, editTest);
};

function editTest() {
	var mainTitle = $('#mainTitle');
	var saveButton = $('#saveButton');
	var addQuestionsButton = $('#addQuestionsButton');
	var removeQuestionsButton = $('#removeQuestionsButton');
	var lessonQuestionsContainer = $('#lessonQuestions');
	var allQuestionsContainer = $('#allQuestions');
	assertNotNullNorUndefined(mainTitle[0]);
	assertNotNullNorUndefined(saveButton[0]);
	assertNotNullNorUndefined(addQuestionsButton[0]);
	assertNotNullNorUndefined(removeQuestionsButton[0]);
	assertNotNullNorUndefined(lessonQuestionsContainer[0]);
	assertNotNullNorUndefined(allQuestionsContainer[0]);
	
	assertEquals('Edit a Lesson <small>enter the lesson new details</small>', mainTitle.html());

	assertTrue(goog.string.contains(addQuestionsButton.attr('class'),
			'disabled'));
	assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
			'disabled'));

	var titleTextField = $('input[type="text"][name="lessonTitle"]');
	var descriptionTextArea = $("textarea[name=lessonDescription]");
	assertEquals(lesson1.title, titleTextField.val());
	assertEquals(lesson1.description, descriptionTextArea.val());
	
	assertEquals('No questions', allQuestionsContainer.text());

	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(lessonQuestionsContainer,
			question3, false);

	titleTextField.val('editedTestTitle');
	descriptionTextArea.val('editedTestDescription');
	
	lessonQuestionsContainer.find('input[type=checkbox]').click();
	removeQuestionsButton.click();
	
	assertEquals('No questions', lessonQuestionsContainer.text());

	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(allQuestionsContainer,
			question3, false);

	saveButton.click();
}

function testClickLink() {
	$('a[eid="' + lesson1.id + '"]').click();
	
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("lesson", lesson1.id);
	assertEquals("update?lesson=" + lesson1.id , locationUri.getFragment());
}

function _testDelete() {
	var lesson1CheckBox =lessonsContainer.find("input[type='checkbox'][name='" + lesson1.id + "']");
	assertNotNullNorUndefined(lesson1CheckBox);
	lesson1CheckBox.click();
	var deleteButton = $("#deleteButton");
	assertNotNullNorUndefined(deleteButton[0]);
	deleteButton.click();
	
	
	lesson1CheckBox =lessonsContainer.find("input[type='checkbox'][name='" + lesson1.id + "']");
	assertTrue(goog.isUndefined(lesson1CheckBox[0]));
	var lessonTitle = $("a[href='#update?lesson=" + lesson.id + "']");
	assertTrue(goog.isUndefined(lessonTitle[0]));
};
