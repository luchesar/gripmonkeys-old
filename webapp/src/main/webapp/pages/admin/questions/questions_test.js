goog.require('goog.testing.jsunit');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.Uri');
goog.require('goog.string');

goog.require('cursoconducir.admin.TestsPage');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.allquestions');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.QuestionClient');
goog.require('cursoconducir.MockQuestionClient');

/** @type {cursoconducir.admin.TestsPage} */
var questionPage;
/** @type {jQuery}*/
var questionContainer;
/** @type {?cursoconducir.Question} */
var question1;
/** @type {?cursoconducir.Question} */
var question2;
/** @type {?cursoconducir.Question} */
var question3;

/** @type {cursoconducir.MockQuestionClient} */
var mockQuestion;

/** @type {jQuery}*/
var saveButton; 
/** @type {jQuery}*/
var createButton;
/** @type {jQuery}*/
var cancelButton;
/** @type {jQuery}*/
var deleteButton;
/** @type {jQuery}*/
var publishButton;
/** @type {jQuery}*/
var previewButton;
/** @type {jQuery}*/
var unpublishButton;
/** @type {jQuery}*/
var mainTitle ;
/** @type {jQuery}*/
var pageButtonsContainer;
/** @type {jQuery}*/
var feedbackContainer;
/** @type {jQuery}*/
var questionTitle;
/** @type {jQuery}*/
var questionDescription;

var testCase = new goog.testing.ContinuationTestCase();
testCase.autoDiscoverTests();

var initialLocation;

if (typeof G_testRunner != 'undefined') {
  G_testRunner.initialize(testCase);
}

var stubs = new goog.testing.PropertyReplacer();

function setUp() {
	$("[id='questionContainer']").remove();
	$('body').append("<div id='questionContainer'/>");
	question1 = createTestQuestion(1, 2, false);
	question2 = createTestQuestion(2, 1, false);
	question3 = createTestQuestion(3, 0, false);
	
	window.location.hash = '';
	mockQuestion = new cursoconducir.MockQuestionClient([ question1, question2, question3]);
	mockQuestion.setUp();
	
	init();
};


function init() {
	questionContainer = $('#questionContainer');
	pageButtonsContainer = $('.pageButtons');
	feedbackContainer = $('.feedback');
	questionContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	questionPage = new cursoconducir.admin.TestsPage(questionContainer);
	questionPage.start();
	initElements();
};

function initElements() {
	saveButton = $('#saveEditedButton');
	if (!goog.isDefAndNotNull(saveButton[0])) {
		saveButton = $('#savePreviewedButton');
	}
	cancelButton = $('#testCancel');
	previewButton = $('#previewButton');
	createButton = $('#createButton');
	deleteButton = $('#deleteButton');
	publishButton = $('#publishButton');
	unpublishButton = $('#unpublishButton');
	mainTitle = $('#mainTitle');
	
	assertTrue(goog.isDefAndNotNull(mainTitle[0]));
	
	questionTitle = questionContainer.find("input[type=text][name=testTitle]");
	questionDescription = questionContainer.find("textarea[name=testDescription]");
}

function testDefaultUrl() {
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);

	assertTrue(goog.isDefAndNotNull(createButton[0]));
	assertTrue(!goog.isDefAndNotNull(saveButton[0]));
	assertTrue(!goog.isDefAndNotNull(cancelButton)[0]);
	assertTrue(!goog.isDefAndNotNull(deleteButton[0]));
	assertTrue(!goog.isDefAndNotNull(previewButton[0]));
	assertTrue(!goog.isDefAndNotNull(publishButton[0]));
	assertTrue(!goog.isDefAndNotNull(unpublishButton[0]));

	assertEquals('#create', createButton.attr('href'));
	
	assertEquals('Manage Questions <small>Create new or modify old questions</small>', mainTitle.html());
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
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);

	assertTrue(goog.isDefAndNotNull(createButton[0]));
	assertTrue(!goog.isDefAndNotNull(saveButton[0]));
	assertTrue(!goog.isDefAndNotNull(cancelButton)[0]);
	assertTrue(!goog.isDefAndNotNull(deleteButton[0]));
	assertTrue(!goog.isDefAndNotNull(previewButton[0]));
	assertTrue(!goog.isDefAndNotNull(publishButton[0]));
	assertTrue(!goog.isDefAndNotNull(unpublishButton[0]));

	assertEquals('#create', createButton.attr('href'));
	
	assertEquals('Manage Questions <small>Create new or modify old questions</small>', mainTitle.html());
};

function testCreateUrl() {
	stubs.set(window.location, "hash", "#create");

	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveEditedButton')[0]);
	}, createUrlTest);
};

function createUrlTest() {
	initElements();
	assertTrue(goog.isDefAndNotNull(saveButton[0]));
	assertTrue(goog.isDefAndNotNull(cancelButton[0]));
	assertTrue(goog.isDefAndNotNull(previewButton[0]));
	
	assertTrue(!goog.isDefAndNotNull(createButton[0]));
	assertTrue(!goog.isDefAndNotNull(deleteButton[0]));
	assertTrue(!goog.isDefAndNotNull(publishButton[0]));
	assertTrue(!goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEquals('Create a Question <small>enter the question details</small>', mainTitle.html());

	assertEquals('', questionTitle.val());
	assertEquals('', questionDescription.val());

	questionTitle.val('createdTestTitle');
	questionDescription.val('createdTestDescription');

	saveButton.click();

	init();

	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);

	var createdQuestion;
	new cursoconducir.QuestionClient().getAll(function(questions) {
		assertEquals(4, questions.length);
		var savedQuestion = questions[3];
		assertNotNull('createdTestTitle', savedQuestion.id);
		assertEquals('createdTestTitle', savedQuestion.title);
		assertEquals('createdTestDescription', savedQuestion.description);

		createdQuestion = savedQuestion;
	});

	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, createdQuestion, false);
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
	assertNotNullNorUndefined($('a[eid="' + question1.id + '"]')[0]);
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("test", question1.id);
	locationUri.setFragment("update?test=" + question1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveEditedButton')[0]);
	}, editTest);
};

function editTest() {
	initElements();
	assertTrue(goog.isDefAndNotNull(saveButton[0]));
	assertTrue(goog.isDefAndNotNull(cancelButton[0]));
	assertTrue(goog.isDefAndNotNull(previewButton[0]));
	
	assertTrue(!goog.isDefAndNotNull(createButton[0]));
	assertTrue(!goog.isDefAndNotNull(deleteButton[0]));
	assertTrue(!goog.isDefAndNotNull(publishButton[0]));
	assertTrue(!goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEquals('Edit a Question <small>enter the question new details</small>', mainTitle.html());

	assertEquals(question1.title, questionTitle.val());
	assertEquals(question1.description, questionDescription.val());

	questionTitle.val('editedTestTitle');
	questionDescription.val('editedTestDescription');
	
	saveButton.click();
	
	init();

	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);

	var editedQuestion;
	new cursoconducir.QuestionClient().getAll(function(questions) {
		assertEquals(3, questions.length);
		var eq = questions[0];
		assertNotNull(question1.id, eq.id);
		assertEquals('editedTestTitle', eq.title);
		assertEquals('editedTestDescription', eq.description);

		editedQuestion = eq;
	});
	
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, editedQuestion, false);
}

function testEditFromUrl() {
	initElements();
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("test", question1.id);
	locationUri.setFragment("update?test=" + question1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	questionContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	questionPage = new cursoconducir.admin.TestsPage(questionContainer);
	questionPage.start();
	initElements();
	
	editTest();
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
	$('a[eid="' + question1.id + '"]').click();
	
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("test", question1.id);
	assertEquals("update?test=" + question1.id , locationUri.getFragment());
}

function testDelete() {
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);
	var lesson1CheckBox = questionContainer.find("input[type='checkbox'][name='" + question1.id + "']");
	assertNotNullNorUndefined(lesson1CheckBox);
	lesson1CheckBox.click();
	var deleteButton = $("#deleteButton");
	assertNotNullNorUndefined(deleteButton[0]);
	deleteButton.click();
	
	$('#cursoconducir-dialog-confirm').find('a.btn')[0].click();
	
	var question1CheckBox = questionContainer.find("input[type='checkbox'][name='" + question1.id + "']");
	assertFalse(goog.isDefAndNotNull(question1CheckBox[0]));
	var lessonTitle = $("a[href='#update?question=" + question1.id + "']");
	assertFalse(goog.isDefAndNotNull(lessonTitle[0]));
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);
};

function _testCancelDelete() {
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);
	var lesson1CheckBox = questionContainer.find("input[type='checkbox'][name='" + question1.id + "']");
	assertNotNullNorUndefined(lesson1CheckBox);
	lesson1CheckBox.click();
	var deleteButton = $("#deleteButton");
	assertNotNullNorUndefined(deleteButton[0]);
	deleteButton.click();
	
	$('#cursoconducir-dialog-confirm').find('a.btn')[1].click();
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, true);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);
};

function testPreview() {
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("test", question1.id);
	locationUri.setFragment("update?test=" + question1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveEditedButton')[0]);
	}, function() {
		initElements();
		questionTitle.val('editedTestTitle');
		questionDescription.val('editedTestDescription');
		assertTrue(goog.isDefAndNotNull(previewButton[0]));
		previewButton.click();
		waitForCondition(function() {
			return goog.isDefAndNotNull($('#savePreviewedButton')[0]);
		}, previewTest);
	});
}

function previewTest() {
	initElements();
	var editPreviewedButton = $('#editPreviewedButton');
	assertTrue(goog.isDefAndNotNull(saveButton[0]));
	assertTrue(goog.isDefAndNotNull(cancelButton[0]));
	assertTrue(goog.isDefAndNotNull(editPreviewedButton[0]));
	
	assertTrue(!goog.isDefAndNotNull(createButton[0]));
	assertTrue(!goog.isDefAndNotNull(deleteButton[0]));
	assertTrue(!goog.isDefAndNotNull(publishButton[0]));
	assertTrue(!goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEquals('Edit a Question <small>enter the question new details</small>', mainTitle.html());

	assertEquals("editedTestTitle", $('#testPreviewTitle').html());
	assertEquals("editedTestDescription", $('#testPreviewDescription').html());

	saveButton.click();
	
	init();

	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question2, false);
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question3, false);

	var editedQuestion;
	new cursoconducir.QuestionClient().getAll(function(questions) {
		assertEquals(3, questions.length);
		var eq = questions[0];
		assertNotNull(question1.id, eq.id);
		assertEquals('editedTestTitle', eq.title);
		assertEquals('editedTestDescription', eq.description);

		editedQuestion = eq;
	});
	
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, editedQuestion, false);
}

function testPublishUnpublish() {
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, false);
	assertFalse(question1.published);
	
	$("input[type='checkbox'][name='" + question1.id + "']").click();
	initElements();
	assertTrue(goog.isDefAndNotNull(publishButton[0]));
	assertFalse(goog.isDefAndNotNull(unpublishButton[0]));
	
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, true);
	publishButton.click();
	
	new cursoconducir.QuestionClient().get([question1.id], function(questions) {
		assertEquals(question1.id, questions.id);
		assertTrue(questions.published);
		cursoconducir.titledentityassert.assertEntityPresent(questionContainer, questions, false);
		question1 = questions;
	});
	
	$("input[type='checkbox'][name='" + question1.id + "']").click();
	initElements();
	assertFalse(goog.isDefAndNotNull(publishButton[0]));
	assertTrue(goog.isDefAndNotNull(unpublishButton[0]));
	
	cursoconducir.titledentityassert.assertEntityPresent(questionContainer, question1, true);
	unpublishButton.click();
	
	new cursoconducir.QuestionClient().get([question1.id], function(questions) {
		assertEquals(question1.id, questions.id);
		assertFalse(questions.published);
		cursoconducir.titledentityassert.assertEntityPresent(questionContainer, questions, false);
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
			cursoconducir.titledentityassert.assertEntityPresent(questionContainer, questions[0], false);
		});
	});
	
}

function createTestQuestion(index, correctAnswerIndex, published) {
	return {
		id : "test" + index,
		title : "test" + index,
		image : "http://imageKey" + index,
		description : "test1Description" + index,
		possibleAnswers : [ "answer" + index + "1text", 
		                    "answer" + index + "2text", 
		                    "answer" + index + "3text"],
		explanation : "explanation" + index,
		published : published,
		correctAnswerIndex: correctAnswerIndex
	};
};

function _testBackForthNavigation() {
	fail();
}