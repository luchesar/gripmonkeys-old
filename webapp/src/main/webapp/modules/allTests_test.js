goog.require('goog.testing.jsunit');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.MockQuestion');
goog.require('cursoconducir.allquestions');

goog.require('jquery');

var allTestsModule;
var testContainer;
var testContainer1;

var question1;
var question2;
var question3;
var question4;

var setUp = function() {
	$('body').append("<div id='testContainer'/>");
	$('body').append("<div id='testContainer1'/>");
	
	question1 = cursoconducir.allquestions.createTestQuestion(1);
	question2 = cursoconducir.allquestions.createTestQuestion(2);
	question3 = cursoconducir.allquestions.createTestQuestion(3);
	question4 = cursoconducir.allquestions.createTestQuestion(4);
	
	init();
};

var init = function() {
	testContainer = $('#testContainer');
	testContainer1 = $('#testContainer1');
	testContainer.empty();
	testContainer1.empty();
	allTestsModule = new cursoconducir.AllTestsModule(testContainer);
};

var testShowEmptyModel = function() {
	allTestsModule.show({
		allTests : []
	});
	var allTestsContainer = $('#allTestsContainer');
	assertNotNull(allTestsContainer);

	assertEquals("No tests yet", allTestsContainer.text());
};

var testShowSomeTests = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
	});
	var allTestsContainer = $('#allTestsContainer');
	assertNotNullNorUndefined(allTestsContainer);

	cursoconducir.allquestions.assertQuestionPresent(allTestsContainer, question1);
	cursoconducir.allquestions.assertQuestionPresent(allTestsContainer, question2);
};

var testGetSelection = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
	});
	var checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");

	assertTrue(goog.array.equals([], allTestsModule.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ question1.id ], allTestsModule
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([ question1.id, question2.id ], allTestsModule
			.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ question2.id ], allTestsModule
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([], allTestsModule.getSelection()));
};

var testSetSelection = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ],
	});
	allTestsModule.setSelection([question1.id]);
	assertTrue(goog.array.equals([question1.id], allTestsModule.getSelection()));
	var checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	assertNotNullNorUndefined(checkBox1.attr('checked'));
	assertUndefined(checkBox2.attr('checked'));
	
	allTestsModule.setSelection([question1.id, question2.id]);
	assertTrue(goog.array.equals([question1.id, question2.id], allTestsModule.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	assertNotNullNorUndefined(checkBox1.attr('checked'));
	assertNotNullNorUndefined(checkBox2.attr('checked'));
	
	allTestsModule.setSelection([question2.id]);
	assertTrue(goog.array.equals([question2.id], allTestsModule.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	assertUndefined(checkBox1.attr('checked'));
	assertNotNullNorUndefined(checkBox2.attr('checked'));
	
	allTestsModule.setSelection([]);
	assertTrue(goog.array.equals([], allTestsModule.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	assertUndefined(checkBox1.attr('checked'));
	assertUndefined(checkBox2.attr('checked'));
};

var testGetSelectionWhenTwoInstancesPresent = function() {
	var allTestsModule1 = new cursoconducir.AllTestsModule(testContainer1);

	allTestsModule.show({
		allTests : [ question1, question2 ]
	});

	allTestsModule1.show({
		allTests : [ question3, question4 ]
	});

	var checkBox1 = $("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + question2.id + "']");
	var checkBox3 = $("input[type='checkbox'][name='" + question3.id + "']");
	var checkBox4 = $("input[type='checkbox'][name='" + question4.id + "']");

	checkBox1.click();
	checkBox2.click();
	checkBox3.click();
	checkBox4.click();

	assertTrue(goog.array.equals([ question1.id, question2.id ], allTestsModule
			.getSelection()));
	assertTrue(goog.array.equals([ question3.id, question4.id ],
			allTestsModule1.getSelection()));
};

var testSelectionChanged = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ]
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
	assertTrue(goog.array.equals([ question1.id ], selection));

	checkBox2.click();
	assertEquals(2, selectionChangeCount);
	assertTrue(goog.array.equals([ question1.id, question2.id ], selection));

	checkBox2.click();
	assertEquals(3, selectionChangeCount);
	assertTrue(goog.array.equals([ question1.id ], selection));

	checkBox1.click();
	assertEquals(4, selectionChangeCount);
	assertTrue(goog.array.equals([], selection));
};

var testSelectionChangedWhenTwoInstancesPresent = function() {
	var allTestsModule1 = new cursoconducir.AllTestsModule(testContainer1);

	allTestsModule.show({
		allTests : [ question1, question2 ]
	});

	allTestsModule1.show({
		allTests : [ question3, question4 ]
	});

	var selection = null;
	var selectionChangeCount = 0;
	var selectionChangeCallback = function(sel) {
		selection = sel;
		selectionChangeCount++;
	};

	allTestsModule1.addSelectionChangeCallback(selectionChangeCallback);

	$("input[type='checkbox'][name='" + question1.id + "']").click();
	$("input[type='checkbox'][name='" + question2.id + "']").click();

	assertNull(selection);
	assertEquals(0, selectionChangeCount);
};

var testGetQuestionIds = function() {
	allTestsModule.show({
		allTests : [ question1, question2 ]
	});
	
	assertTrue(goog.array.equals([ question1.id, question2.id], allTestsModule.getQuestionIds()));
};
