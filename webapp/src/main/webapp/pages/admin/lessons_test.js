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

var assertEntityPresent;

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

/** @type {jQuery}*/
var createButton;
/** @type {jQuery}*/
var mainTitle;
/** @type {jQuery}*/
var saveButton;
/** @type {jQuery}*/
var addQuestionsButton;
/** @type {jQuery}*/
var removeQuestionsButton;
/** @type {jQuery}*/
var lessonQuestionsContainer;
/** @type {jQuery}*/
var allQuestionsContainer;
/** @type {jQuery}*/
var pageButtonsContainer;
/** @type {jQuery}*/
var feedbackContainer;
/** @type {jQuery}*/
var publishButton;
/** @type {jQuery}*/
var unpublishButton;
/** @type {jQuery}*/
var mainTitle;

var testCase = new goog.testing.ContinuationTestCase();
testCase.autoDiscoverTests();

if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

var stubs = new goog.testing.PropertyReplacer();
var initialLocation;

function setUpPage() {
	assertEntityPresent = cursoconducir.titledentityassert.assertEntityPresent;
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
		questionIds : [ "1", "2", "3" ],
		published: false
	};
	lesson2 = {
		id : "lesson2Id",
		title : "lesson2",
		description : "lesson2 description",
		questionIds : [ "1", "2", "3" ],
		published: false
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

function initElements() {
	lessonsContainer = $('#lessonsContainer');
	pageButtonsContainer = $('.pageButtons');
	feedbackContainer = $('.feedback');
	createButton = $('#createButton');
	
	mainTitle = $('#mainTitle');
	saveButton = $('#saveButton');
	addQuestionsButton = $('#addQuestionsButton');
	removeQuestionsButton = $('#removeQuestionsButton');
	lessonQuestionsContainer = $('#lessonQuestions');
	allQuestionsContainer = $('#allQuestions');
	
	publishButton = $('#publishButton');
	unpublishButton = $('#unpublishButton');
	mainTitle = $('#mainTitle');
}

function init() {
	initElements();
	stubs.set(window.location, "hash", "");
	lessonsContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	allLessons = new cursoconducir.admin.LessonPage(lessonsContainer);
	allLessons.start();
	initElements();
};

function testDefaultUrl() {
	assertEntityPresent(lessonsContainer, lesson1, false, false);
	assertEntityPresent(lessonsContainer, lesson2, false, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	assertEquals('Manage Lessons <small>Create new or modify old lessons</small>', mainTitle.html());
};

function testDefaltUrlServerError() {
	var error = {status: "error status", error: "error message"};
	mockQuestion.setError(error);
	init();
	
	assertTrue($('.feedback').text().indexOf(error.status + ' ' + error.error) > 0);
	
	assertFalse($('.feedback').hasClass('hide'));
}

function testCancelUrl() {
	stubs.set(window.location, "hash", "#cancel");
	assertEntityPresent(lessonsContainer, lesson1, false, false);
	assertEntityPresent(lessonsContainer, lesson2, false, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	assertEquals('Manage Lessons <small>Create new or modify old lessons</small>', mainTitle.html());
};

function testCreateUrl() {
	stubs.set(window.location, "hash", "#create");

	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveButton')[0]);
	}, createUrlTest);
};

function createUrlTest() {
	initElements();
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

	assertEntityPresent(allQuestionsContainer, question1, false);
	assertEntityPresent(allQuestionsContainer, question2, false);
	assertEntityPresent(allQuestionsContainer, question3, false);

	allQuestionsContainer.find('input[type=checkbox]').click();
	// assertFalse(goog.string.contains(addQuestionsButton.attr('class'),
	// 'disabled'));
	// assertTrue(goog.string.contains(removeQuestionsButton.attr('class'),
	// 'disabled'));

	addQuestionsButton.click();

	assertEquals('No questions', allQuestionsContainer.text());

	assertEntityPresent(lessonQuestionsContainer, question1, false);
	assertEntityPresent(lessonQuestionsContainer, question2, false);
	assertEntityPresent(lessonQuestionsContainer, question3, false);

	saveButton.click();

	init();

	assertEntityPresent(lessonsContainer, lesson1, false, false);
	assertEntityPresent(lessonsContainer, lesson2, false, false);

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

	assertEntityPresent(lessonsContainer, createdLesson, false, false);
};


function testCreateServerErrorOnSave() {
	stubs.set(window.location, "hash", "#create");

	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveEditedButton')[0]);
	}, function() {
		initElements();
		questionTitle.val('createdTestTitle');
		questionDescription.val('createdTestDescription');
		var error = {status: "error status", error: "error message"};
		mockQuestion.setError(error);
		saveButton.click();
		
		waitForCondition(function() {
			return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
		}, function() {
			assertFalse($('.feedback').hasClass('hide'));
		});
	});
}

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
	initElements();
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

	assertEntityPresent(lessonQuestionsContainer, question1, false);
	assertEntityPresent(lessonQuestionsContainer, question2, false);
	assertEntityPresent(lessonQuestionsContainer, question3, false);

	titleTextField.val('editedTestTitle');
	descriptionTextArea.val('editedTestDescription');
	
	lessonQuestionsContainer.find('input[type=checkbox]').click();
	removeQuestionsButton.click();
	
	assertEquals('No questions', lessonQuestionsContainer.text());

	assertEntityPresent(allQuestionsContainer, question1, false);
	assertEntityPresent(allQuestionsContainer, question2, false);
	assertEntityPresent(allQuestionsContainer, question3, false);

	saveButton.click();
}

function testEditServerError() {
	mockQuestion = new cursoconducir.MockQuestionClient([]);
	mockQuestion.setUp();
	init();
	var error = {status: "error status", error: "error message"};
	mockQuestion.setError(error);
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("test", question1.id);
	locationUri.setFragment("update?test=" + question1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
	}, function() {
		assertFalse($('.feedback').hasClass('hide'));
	});
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
}

function testPublishUnpublish() {
	assertEntityPresent(lessonsContainer, lesson1, false, false);
	assertFalse(lesson1.published);
	
	$("input[type='checkbox'][name='" + lesson1.id + "']").click();
	initElements();
	assertTrue(goog.isDefAndNotNull(publishButton[0]));
	assertFalse(goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEntityPresent(lessonsContainer, lesson1, true, false);
	publishButton.click();
	
	new cursoconducir.LessonClient().get([lesson1.id], function(lessons) {
		assertEquals(lesson1.id, lessons[0].id);
		assertTrue(lessons[0].published);
		assertEntityPresent(lessonsContainer, lessons[0], false, false);
		lesson1 = lessons[0];
	});
	
	$("input[type='checkbox'][name='" + lesson1.id + "']").click();
	initElements();
	assertFalse(goog.isDefAndNotNull(publishButton[0]));
	assertTrue(goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEntityPresent(lessonsContainer, lesson1, true, false);
	unpublishButton.click();
	
	new cursoconducir.LessonClient().get([lesson1.id], function(lessons) {
		assertEquals(lesson1.id, lessons[0].id);
		assertFalse(lessons[0].published);
		assertEntityPresent(lessonsContainer, lessons[0], false, false);
	});
}

function testPublishUnpublishServerError() {
	$("input[type='checkbox'][name='" + question1.id + "']").click();
	initElements();
	
	var error = {status: "error status", error: "error message"};
	mockQuestion.setError(error);
	publishButton.click();
	
	waitForCondition(function() {
		return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
	}, function() {
		assertFalse($('.feedback').hasClass('hide'));
		
		new cursoconducir.QuestionClient().get([question1.id], function(questions) {
			assertEquals(question1.id, questions[0].id);
			assertTrue(questions[0].published);
			assertEntityPresent(lessonsContainer, questions[0], false);
		});
	});
	
}
