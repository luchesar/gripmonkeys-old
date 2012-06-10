goog.require('goog.testing.jsunit');
goog.require('jquery');
goog.require('cursoconducir.TestPreviewModule');
goog.require('cursoconducir.allquestions');

var testContainer;
var testPreviewModule;

var question1;
var question2;

var setUp = function() {
	$('body').append("<div id='testContainer'/>");
	
	question1 = cursoconducir.allquestions.createTestQuestion(1);
	question2 = cursoconducir.allquestions.createTestQuestion(2);
	
	init();
};

var init = function() {
	testContainer = $('#testContainer');
	testContainer.empty();
	testPreviewModule = new cursoconducir.TestPreviewModule(testContainer);
};

var testShow = function() {
	var previewContainer1 = testPreviewModule.show({activeTest: question1});
	assertNotNullNorUndefined(previewContainer1);
	assertNotNullNorUndefined(previewContainer1[0]);
	assertEquals(previewContainer1.html(), testContainer.find('#questionPreviewContainer' + question1.id).html());
	
	var previewContainer2 = testPreviewModule.show({activeTest: question2});
	assertNotEquals(previewContainer1.html(), previewContainer2.html());
	assertEquals(previewContainer2.html(), testContainer.find('#questionPreviewContainer' + question2.id).html());
	
	assertUndefined(testContainer.find('#questionPreviewContainer' + question1.id)[0]);
};


var testAdd = function() {
	var previewContainer1 = testPreviewModule.add({activeTest: question1});
	var previewContainer2 = testPreviewModule.add({activeTest: question2});
	
	assertNotNullNorUndefined(previewContainer1);
	assertNotNullNorUndefined(previewContainer1[0]);
	assertEquals(previewContainer1.html(), testContainer.find('#questionPreviewContainer' + question1.id).html());
	
	assertNotEquals(previewContainer1.html(), previewContainer2.html());
	assertNotNullNorUndefined(previewContainer2);
	assertNotNullNorUndefined(previewContainer2[0]);
	assertEquals(previewContainer2.html(), testContainer.find('#questionPreviewContainer' + question2.id).html());
};

var testMarkedIndex = function() {
	var previewContainer1 = testPreviewModule.show({activeTest: question1});
	
	previewContainer1.find("#answerLink0").click();
	assertEquals(0, testPreviewModule.getMarkedIndex());
	
	previewContainer1.find("#answerLink1").click();
	assertEquals(1, testPreviewModule.getMarkedIndex());
};

var testAswer = function() {
	
};


