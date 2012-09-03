goog.require('goog.testing.jsunit');
goog.require('cursoconducir.EntityList');
goog.require('cursoconducir.TitledEntity');

/** @type {Array.<cursoconducir.EntityList>}*/
var entityList;
/** @type {jQuery}*/
var parent;
/** @type {cursoconducir.TitledEntity}*/
var e1;
/** @type {cursoconducir.TitledEntity}*/
var e2;

var setUp = function() {
	$('body').append("<div id='parent'/>");
	e1 = newE(1);
	e2 = newE(2);
	init();
};

var init = function() {
	parent = $('#parent');
	parent.empty();
	entityList = new cursoconducir.EntityList(parent);
};

var testShowEmptyModel = function() {
	entityList.show({
		entities : []
	});
	var parent = $('#parent');
	assertNotNull(parent);

	assertEquals("No entities", parent.text());
};

var testShowEmptyModelWithLabel = function() {
	entityList.show({
		entities : [],
		emptyMessage: 'some meaningful message'
	});
	var parent = $('#parent');
	assertNotNull(parent);

	assertEquals("some meaningful message", parent.text());
};

var testShowSomeTests = function() {
	entityList.show({
		entities : [ e1, e2 ]
	});
	var allLessonsContainer = $('#parent');
	assertNotNullNorUndefined(allLessonsContainer);

	assertEntityPresent(e1);
	assertEntityPresent(e2);
};

var testGetSelection = function() {
	entityList.show({
		entities : [ e1, e2 ]
	});
	var checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");

	assertTrue(goog.array.equals([], entityList.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ e1.id ], entityList
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([ e1.id, e2.id ], entityList
			.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ e2.id ], entityList
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([], entityList.getSelection()));
};

var testSelectionChanged = function() {
	entityList.show({
		entities : [ e1, e2 ],
		activeTest : null,
		answerIndex : null
	});

	var selection = null;
	var selectionChangeCount = 0;
	var selectionChangeCallback = function(sel) {
		selection = sel;
		selectionChangeCount++;
	};

	entityList.addSelectionChangeCallback(selectionChangeCallback);

	var checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");

	checkBox1.click();
	assertEquals(1, selectionChangeCount);
	assertTrue(goog.array.equals([ e1.id ], selection));

	checkBox2.click();
	assertEquals(2, selectionChangeCount);
	assertTrue(goog.array.equals([ e1.id, e2.id ], selection));

	checkBox2.click();
	assertEquals(3, selectionChangeCount);
	assertTrue(goog.array.equals([ e1.id ], selection));

	checkBox1.click();
	assertEquals(4, selectionChangeCount);
	assertTrue(goog.array.equals([], selection));
};

var testTitleLinkClick = function() {
	entityList.show({
		entities : [ e1, e2 ]
	});

	var clickId = null;
	var linkClickChangeCount = 0;
	var linkClickCallback = function(id) {
		clickId = id;
		linkClickChangeCount++;
	};

	entityList.addLinkCallback(linkClickCallback);

	var link1 = $("a[id='entityTitleLink" + e1.id + "']");
	var link2 = $("a[id='entityTitleLink" + e2.id + "']");

	link1.click();
	assertEquals(1, linkClickChangeCount);
	assertEquals(e1.id , clickId);
	
	link2.click();
	assertEquals(2, linkClickChangeCount);
	assertEquals(e2.id , clickId);
};

/**
 * @param {number} num
 * @return {cursoconducir.TitledEntity}
 */
function newE(num) {
	return {
		"id" : "id" + num,
		"title" : "name" + num,
		"image" : "image" + num,
		"description" : "d" + num
	};
}

var assertEntityPresent = function(entity) {
	var entityTitle = $("a[id='entityTitleLink" + entity.id + "']");
	assertNotNullNorUndefined(entityTitle);
	assertEquals(entity.title, entityTitle.text().trim());

	assertNotNullNorUndefined($("div:contains('" + entity.description + "')")
			.text());

	var checkBox = $("input[type='checkbox'][name='" + entity.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
};