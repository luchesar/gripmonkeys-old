goog.require('cursoconducir.alllessons');
goog.require('goog.testing.jsunit');
goog.require('cursoconducir.AllLessons');
goog.require('cursoconducir.Lesson');
goog.require('jquery');

var allLessons;
var lessonsContainer;
var lesson1;
var lesson2;

var setUp = function() {
	$('body').append("<div id='lessonsContainer'/>");
	lesson1 = cursoconducir.Lesson.create({
		id: "lesson1Id",
		title: "lesson1",
		description: "lesson1 description",
		questionIds: [1, 2, 3]
	});
	lesson2 = cursoconducir.Lesson.create({
		id: "lesson2Id",
		title: "lesson2",
		description: "lesson2 description",
		questionIds: [1, 2, 3]
	});
	init();
};

var init = function() {
	lessonsContainer = $('#lessonsContainer');
	lessonsContainer.empty();
	allLessons = new cursoconducir.AllLessons(lessonsContainer);
};

var testShowEmptyModel = function() {
	allLessons.show({
		allLessons : [],
		activeLesson : null,
	});
	var lessonsContainer = $('#lessonsContainer');
	assertNotNull(lessonsContainer);

	assertEquals("No lessons yet", lessonsContainer.text());
};

var testShowSomeTests = function() {
	allLessons.show({
		allLessons : [ lesson1, lesson2 ],
		activeLesson : null,
	});
	var allLessonsContainer = $('#lessonsContainer');
	assertNotNullNorUndefined(allLessonsContainer);

	assertLessonPresent(lesson1);
	assertLessonPresent(lesson2);
};

var testGetSelection = function() {
	allLessons.show({
		allLessons : [ lesson1, lesson2 ],
		activeLesson : null,
	});
	var checkBox1 = $("input[type='checkbox'][name='" + lesson1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + lesson2.id + "']");

	assertTrue(goog.array.equals([], allLessons.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ lesson1.id ], allLessons
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([ lesson1.id, lesson2.id ], allLessons
			.getSelection()));

	checkBox1.click();
	assertTrue(goog.array.equals([ lesson2.id ], allLessons
			.getSelection()));

	checkBox2.click();
	assertTrue(goog.array.equals([], allLessons.getSelection()));
};

var testSelectionChanged = function() {
	allLessons.show({
		allLessons : [ lesson1, lesson2 ],
		activeTest : null,
		answerIndex : null
	});

	var selection = null;
	var selectionChangeCount = 0;
	var selectionChangeCallback = function(sel) {
		selection = sel;
		selectionChangeCount++;
	};

	allLessons.addSelectionChangeCallback(selectionChangeCallback);

	var checkBox1 = $("input[type='checkbox'][name='" + lesson1.id + "']");
	var checkBox2 = $("input[type='checkbox'][name='" + lesson2.id + "']");

	checkBox1.click();
	assertEquals(1, selectionChangeCount);
	assertTrue(goog.array.equals([ lesson1.id ], selection));

	checkBox2.click();
	assertEquals(2, selectionChangeCount);
	assertTrue(goog.array.equals([ lesson1.id, lesson2.id ], selection));

	checkBox2.click();
	assertEquals(3, selectionChangeCount);
	assertTrue(goog.array.equals([ lesson1.id ], selection));

	checkBox1.click();
	assertEquals(4, selectionChangeCount);
	assertTrue(goog.array.equals([], selection));
};
