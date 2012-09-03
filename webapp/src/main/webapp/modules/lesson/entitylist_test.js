goog.require('goog.testing.jsunit');
goog.require('cursoconducir.EntityList');
goog.require('cursoconducir.TitledEntity');

/** @type {Array.<cursoconducir.EntityList>}*/
var entityList;
/** @type {jQuery}*/
var parent;
/** @type {jQuery}*/
var parent1;
/** @type {cursoconducir.TitledEntity}*/
var e1;
/** @type {cursoconducir.TitledEntity}*/
var e2;
/** @type {cursoconducir.TitledEntity}*/
var e3;
/** @type {cursoconducir.TitledEntity}*/
var e4;

var setUp = function() {
	$('body').append("<div id='parent'/>");
	$('body').append("<div id='parent1'/>");
	e1 = newE(1);
	e2 = newE(2);
	e3 = newE(3);
	e4 = newE(4);
	init();
};

var init = function() {
	parent = $('#parent');
	parent.empty();
	parent1 = $('#parent1');
	parent1.empty();
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
	e3.published = true;
	e4.image = undefined;
	entityList.show({
		entities : [ e1, e2 , e3, e4]
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

var testSelectionChangedWhenTwoInstancesPresent = function() {
	var entityList1 = new cursoconducir.EntityList(parent1);

	entityList.show({
		entities : [ e1, e2 ]
	});

	entityList1.show({
		entities : [ e3, e4 ]
	});

	var selection = null;
	var selectionChangeCount = 0;
	var selectionChangeCallback = function(sel) {
		selection = sel;
		selectionChangeCount++;
	};

	entityList1.addSelectionChangeCallback(selectionChangeCallback);

	$("input[type='checkbox'][name='" + e1.id + "']").click();
	$("input[type='checkbox'][name='" + e2.id + "']").click();

	assertNull(selection);
	assertEquals(0, selectionChangeCount);
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

var testImageLinkClick = function() {
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

	var link1 = $('a[id="testImageLink' + e1.id + '"]');
	var link2 = $('a[id="testImageLink' + e2.id + '"]');

	link1.click();
	assertEquals(1, linkClickChangeCount);
	assertEquals(e1.id , clickId);
	
	link2.click();
	assertEquals(2, linkClickChangeCount);
	assertEquals(e2.id , clickId);
};

var testSetSelection = function() {
	entityList.show({
		entities : [ e1, e2],
	});
	entityList.setSelection([e1.id]);
	assertTrue(goog.array.equals([e1.id], entityList.getSelection()));
	var checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");
	assertNotNullNorUndefined(checkBox1.attr('checked'));
	assertUndefined(checkBox2.attr('checked'));
	
	entityList.setSelection([e1.id, e2.id]);
	assertTrue(goog.array.equals([e1.id, e2.id], entityList.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");
	assertNotNullNorUndefined(checkBox1.attr('checked'));
	assertNotNullNorUndefined(checkBox2.attr('checked'));
	
	entityList.setSelection([e2.id]);
	assertTrue(goog.array.equals([e2.id], entityList.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");
	assertUndefined(checkBox1.attr('checked'));
	assertNotNullNorUndefined(checkBox2.attr('checked'));
	
	entityList.setSelection([]);
	assertTrue(goog.array.equals([], entityList.getSelection()));
	checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");
	assertUndefined(checkBox1.attr('checked'));
	assertUndefined(checkBox2.attr('checked'));
};

var testGetSelectionWhenTwoInstancesPresent = function() {
	var entityList1 = new cursoconducir.EntityList(parent1);

	entityList.show({
		entities : [ e1, e2 ]
	});

	entityList1.show({
		entities : [ e3, e4 ]
	});

	var checkBox1 = $("input[type='checkbox'][name='" + e1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + e2.id + "']");
	var checkBox3 = $("input[type='checkbox'][name='" + e3.id + "']");
	var checkBox4 = $("input[type='checkbox'][name='" + e4.id + "']");

	checkBox1.click();
	checkBox2.click();
	checkBox3.click();
	checkBox4.click();

	assertTrue(goog.array.equals([ e1.id, e2.id ], entityList.getSelection()));
	assertTrue(goog.array.equals([ e3.id, e4.id ], entityList1.getSelection()));
};

var testGetQuestionIds = function() {
	entityList.show({
		entities : [e1, e2]
	});
	
	assertTrue(goog.array.equals([e1.id, e2.id], entityList.getEntityIds()));
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
	assertTrue(entityTitle.attr('href') == undefined);
	
	if (entity.published) {
		var publishedImage = $('img[src="/images/published.png"][id="publishedIndication' + entity.id + '"]');	
		assertNotNullNorUndefined(publishedImage[0]);
	} else {
		var unpublishedImage = $('img[src="/images/unpublished.png"][id="publishedIndication' + entity.id + '"]');
		assertNotNullNorUndefined(unpublishedImage[0]);
	}
	
	var imageLink = $('a[id="testImageLink' + entity.id + '"]');
	assertNotNullNorUndefined(imageLink[0]);
	
	var image = $('img[src="/image?key=' + entity.image + '&s=80&falback=/images/80x50.gif"]');
	assertNotNullNorUndefined(image[0]);

	assertNotNullNorUndefined($("div:contains('" + entity.description + "')")
			.text());

	var checkBox = $("input[type='checkbox'][name='" + entity.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
};