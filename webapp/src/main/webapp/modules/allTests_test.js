goog.require('goog.testing.jsunit');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');

goog.require('jquery');

var allTestsModule;
var testContainer;
var question1 = {
	id : "test1",
	title : "test1",
	image : "http://imageKey",
	description : "test1Description",
	possibleAnswers : [ {
		title : "answer1",
		index : 0,
		text : "answer1text",
		sel : false
	}, {
		title : "answer2",
		index : 0,
		text : "answer2text",
		sel : false
	} ],
	explanation : "explanation"
};
var question2 = {
	id : "test2",
	title : "test2",
	image : "http://imageKey2",
	description : "test1Description2",
	possibleAnswers : [ {
		title : "answer21",
		index : 0,
		text : "answer21text",
		sel : false
	}, {
		title : "answer22",
		index : 0,
		text : "answer22text",
		sel : false
	} ],
	explanation : "explanation2"
};

var setUp = function() {
	$('body').append("<div id='testContainer'/>");
	init();
};

var init = function() {
	testContainer = $('#testContainer');
	testContainer.empty();
	allTestsModule = new cursoconducir.AllTestsModule(testContainer);
};

var testShowEmptyModel = function() {
	allTestsModule.show({
		allTests : [],
		activeTest : null,
		answerIndex : null
	});
	var allTestsContainer = $('#allTestsContainer');
	assertNotNull(allTestsContainer);

	assertEquals("No tests yet", allTestsContainer.text());
};

var testShowSomeTests = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
		activeTest : null,
		answerIndex : null
	});
	var allTestsContainer = $('#allTestsContainer');
	assertNotNullNorUndefined(allTestsContainer);

	assertTestPresent(question1);
	assertTestPresent(question2);
};

var testGetSelection = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
		activeTest : null,
		answerIndex : null
	});
	var checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	
	assertTrue(goog.array.equals([], allTestsModule.getSelection()));
	
	checkBox1.click();
	assertTrue(goog.array.equals([question1.id], allTestsModule.getSelection()));
	
	checkBox2.click();
	assertTrue(goog.array.equals([question1.id, question2.id], allTestsModule.getSelection()));
	
	checkBox1.click();
	assertTrue(goog.array.equals([question2.id], allTestsModule.getSelection()));
	
	checkBox2.click();
	assertTrue(goog.array.equals([], allTestsModule.getSelection()));
};

var testSelectionChanged = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
		activeTest : null,
		answerIndex : null
	});
	
	var selection = null;
	var selectionChangeCount = 0;
	var selectionChangeCallback = function(sel) {
		selection = sel;
		selectionChangeCount++;
	};
	
	allTestsModule.addSelectionChangeCallback(selectionChangeCallback);
	
	var checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	
	checkBox1.click();
	assertEquals(1, selectionChangeCount);
	assertTrue(goog.array.equals([question1.id], selection));
	
	checkBox2.click();
	assertEquals(2, selectionChangeCount);
	assertTrue(goog.array.equals([question1.id, question2.id], selection));
	
	checkBox2.click();
	assertEquals(3, selectionChangeCount);
	assertTrue(goog.array.equals([question1.id], selection));
	
	checkBox1.click();
	assertEquals(4, selectionChangeCount);
	assertTrue(goog.array.equals([], selection));
};

var assertTestPresent = function(question, isSelected) {
	assertNotNullNorUndefined($("a[href='" + question.image + "']"));
	var testTitle = $("a[href='#update?test=" + question.id + "']");
	assertNotNullNorUndefined(testTitle);
	assertEquals(question.title, testTitle.text().trim());

	assertNotNullNorUndefined($("div:contains('" + question.description + "')")
			.text());

	assertUndefined($("a[href='#delete?test=" + question.id + "']")[0]);
	assertUndefined($("a[href='#publish?test=" + question.id + "']")[0]);

	var checkBox = $("input[type='checkbox'][name='" + question.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
	assertEquals(isSelected, checkBox.attr('checked'));
};
