goog.require('cursoconducir.admin.CoursesPage');
goog.require('cursoconducir.admin.courses');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.MockCourseClient');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.titledentityassert');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.MockLessonClient');
goog.require('goog.string');
goog.require('goog.History');
goog.require('goog.testing.ContinuationTestCase');
goog.require('goog.testing.jsunit');
goog.require('goog.Uri');
goog.require('cursoconducir.CourseClient');
goog.require('cursoconducir.titledentityassert');

var assertEntityPresent;

/** @type {cursoconducir.admin.CoursePage} */
var allCourses;
var coursesContainer;
/** @type {?cursoconducir.Course} */
var course1;
/** @type {?cursoconducir.Course} */
var course2;
/** @type {?cursoconducir.Lesson} */
var lesson1;
/** @type {?cursoconducir.Lesson} */
var lesson2;
/** @type {?cursoconducir.Lesson} */
var lesson3;
/** @type {cursoconducir.MockCourseClient} */
var mockCourse;

/** @type {cursoconducir.MockLessonClient} */
var mockLesson;

/** @type {jQuery}*/
var createButton;
/** @type {jQuery}*/
var mainTitle;
/** @type {jQuery}*/
var saveButton;
/** @type {jQuery}*/
var addLessonsButton;
/** @type {jQuery}*/
var removeLessonsButton;
/** @type {jQuery}*/
var courseLessonsContainer;
/** @type {jQuery}*/
var allLessonsContainer;
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
	$('body').append("<div id='coursesContainer'/>");
	$('body').append("<div class='pageButtons'></div>");
	initialLocation = window.location;
};

function setUp() {
	lesson1 = lesson(1);
	lesson2 = lesson(2);
	lesson3 = lesson(3);
	course1 = {
		id : "course1Id",
		title : "course1",
		image: null,
		description : "course1 description",
		lessonIds : [ lesson1.id, lesson2.id, lesson3.id ],
		published: false
	};
	course2 = {
		id : "course2Id",
		title : "course2",
		image: null,
		description : "course2 description",
		lessonIds : [ lesson1.id, lesson2.id, lesson3.id ],
		published: false
	};
	mockCourse = new cursoconducir.MockCourseClient([ course1, course2 ]);
	mockCourse.setUp();

	mockLesson = new cursoconducir.MockLessonClient([ lesson1, lesson2,
			lesson3 ]);
	mockLesson.setUp();
	
	stubs.set(window.location, "hash", "");

	init();
};

function tearDownPage() {
	stubs.set(window, "location", initialLocation);
}

function initElements() {
	coursesContainer = $('#coursesContainer');
	pageButtonsContainer = $('.pageButtons');
	feedbackContainer = $('.feedback');
	createButton = $('#createButton');
	
	mainTitle = $('#mainTitle');
	saveButton = $('#saveButton');
	addLessonsButton = $('#addLessonsButton');
	removeLessonsButton = $('#removeLessonsButton');
	courseLessonsContainer = $('#courseLessons');
	allLessonsContainer = $('#allLessons');
	
	publishButton = $('#publishButton');
	unpublishButton = $('#unpublishButton');
	mainTitle = $('#mainTitle');
}

function init() {
	initElements();
	stubs.set(window.location, "hash", "");
	coursesContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	allCourses = new cursoconducir.admin.CoursesPage(coursesContainer);
	allCourses.start();
	initElements();
};

function testDefaultUrl() {
	assertEntityPresent(coursesContainer, course1, false, false);
	assertEntityPresent(coursesContainer, course2, false, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	assertEquals('Manage Courses <small>Create new or modify old courses</small>', mainTitle.html());
};

function testDefaltUrlServerError() {
	var error = {status: "error status", error: "error message"};
	mockCourse.setError(error);
	init();
	
	assertTrue($('.feedback').text().indexOf(error.status + ' ' + error.error) > 0);
	assertFalse($('.feedback').hasClass('hide'));
}

function testCancelUrl() {
	stubs.set(window.location, "hash", "#cancel");
	assertEntityPresent(coursesContainer, course1, false, false);
	assertEntityPresent(coursesContainer, course2, false, false);

	assertNotNullNorUndefined(createButton[0]);

	assertEquals('#create', createButton.attr('href'));
	assertEquals('Manage Courses <small>Create new or modify old courses</small>', mainTitle.html());
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
	assertNotNullNorUndefined(addLessonsButton[0]);
	assertNotNullNorUndefined(removeLessonsButton[0]);
	assertNotNullNorUndefined(courseLessonsContainer[0]);
	assertNotNullNorUndefined(allLessonsContainer[0]);
	
	assertEquals('Create a Course <small>enter the course details</small>', mainTitle.html());

	assertTrue(goog.string.contains(addLessonsButton.attr('class'),
			'disabled'));
	assertTrue(goog.string.contains(removeLessonsButton.attr('class'),
			'disabled'));

	var titleTextField = $('input[type="text"][name="courseTitle"]');
	var descriptionTextArea = $("textarea[name=courseDescription]");
	assertEquals('', titleTextField.val());
	assertEquals('', descriptionTextArea.val());

	titleTextField.val('createdTestTitle');
	descriptionTextArea.val('createdTestDescription');

	assertEquals('No lessons', courseLessonsContainer.text());

	assertEntityPresent(allLessonsContainer, lesson1, false);
	assertEntityPresent(allLessonsContainer, lesson2, false);
	assertEntityPresent(allLessonsContainer, lesson3, false);

	allLessonsContainer.find('input[type=checkbox]').click();
	// assertFalse(goog.string.contains(addLessonsButton.attr('class'),
	// 'disabled'));
	// assertTrue(goog.string.contains(removeLessonsButton.attr('class'),
	// 'disabled'));

	addLessonsButton.click();

	assertEquals('No lessons', allLessonsContainer.text());

	assertEntityPresent(courseLessonsContainer, lesson1, false);
	assertEntityPresent(courseLessonsContainer, lesson2, false);
	assertEntityPresent(courseLessonsContainer, lesson3, false);

	saveButton.click();

	init();

	assertEntityPresent(coursesContainer, course1, false, false);
	assertEntityPresent(coursesContainer, course2, false, false);

	var createdCourse;
	new cursoconducir.CourseClient().getAll(function(allCourses) {
		assertEquals(3, allCourses.length);
		var savedCourse = allCourses[2];
		assertNotNull('createdTestTitle', savedCourse.id);
		assertEquals('createdTestTitle', savedCourse.title);
		assertEquals('createdTestDescription', savedCourse.description);
		assertTrue(goog.array.equals(
				[ lesson1.id, lesson2.id, lesson3.id ],
				savedCourse.lessonIds));

		createdCourse = savedCourse;
	});

	assertEntityPresent(coursesContainer, createdCourse, false, false);
};


function testCreateServerErrorOnSave() {
	stubs.set(window.location, "hash", "#create");

	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveButton')[0]);
	}, function() {
		initElements();
		var titleTextField = $('input[type="text"][name="courseTitle"]');
		var descriptionTextArea = $("textarea[name=courseDescription]");
		titleTextField.val('createdTestTitle');
		descriptionTextArea.val('createdTestDescription');
		var error = {status: "error status", error: "error message"};
		mockCourse.setError(error);
		saveButton.click();
		
		waitForCondition(function() {
			return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
		}, function() {
			assertFalse($('.feedback').hasClass('hide'));
		});
	});
}

function testEdit() {
	assertNotNullNorUndefined($('a[eid="' + course1.id + '"]')[0]);
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("course", course1.id);
	locationUri.setFragment("update?course=" + course1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return goog.isDefAndNotNull($('#saveButton')[0]);
	}, editTest);
};

function editTest() {
	initElements();
	assertNotNullNorUndefined(mainTitle[0]);
	assertNotNullNorUndefined(saveButton[0]);
	assertNotNullNorUndefined(addLessonsButton[0]);
	assertNotNullNorUndefined(removeLessonsButton[0]);
	assertNotNullNorUndefined(courseLessonsContainer[0]);
	assertNotNullNorUndefined(allLessonsContainer[0]);
	
	assertEquals('Edit a Course <small>enter the course new details</small>', mainTitle.html());

	assertTrue(goog.string.contains(addLessonsButton.attr('class'),
			'disabled'));
	assertTrue(goog.string.contains(removeLessonsButton.attr('class'),
			'disabled'));

	var titleTextField = $('input[type="text"][name="courseTitle"]');
	var descriptionTextArea = $("textarea[name=courseDescription]");
	assertEquals(course1.title, titleTextField.val());
	assertEquals(course1.description, descriptionTextArea.val());
	
	assertEquals('No lessons', allLessonsContainer.text());

	assertEntityPresent(courseLessonsContainer, lesson1, false);
	assertEntityPresent(courseLessonsContainer, lesson2, false);
	assertEntityPresent(courseLessonsContainer, lesson3, false);

	titleTextField.val('editedTestTitle');
	descriptionTextArea.val('editedTestDescription');
	
	courseLessonsContainer.find('input[type=checkbox]').click();
	removeLessonsButton.click();
	
	assertEquals('No lessons', courseLessonsContainer.text());

	assertEntityPresent(allLessonsContainer, lesson1, false);
	assertEntityPresent(allLessonsContainer, lesson2, false);
	assertEntityPresent(allLessonsContainer, lesson3, false);

	saveButton.click();
}

function testEditFromUrl() {
	initElements();
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("course", course1.id);
	locationUri.setFragment("update?course=" + course1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	coursesContainer.empty();
	pageButtonsContainer.empty();
	feedbackContainer.empty();
	allCourses = new cursoconducir.admin.CoursesPage(coursesContainer);
	allCourses.start();
	initElements();
	
	editTest();
}

function testEditServerError() {
	mockCourse = new cursoconducir.MockCourseClient([]);
	mockCourse.setUp();
	init();
	var error = {status: "error status", error: "error message"};
	mockCourse.setError(error);
	/** type {goog.Uri}*/ 
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("course", lesson1.id);
	locationUri.setFragment("update?course=" + lesson1.id );
	
	stubs.set(window, "location", locationUri.toString());
	
	waitForCondition(function() {
		return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
	}, function() {
		assertFalse($('.feedback').hasClass('hide'));
	});
}

function testClickLink() {
	$('a[eid="' + course1.id + '"]').click();
	
	var locationUri = new goog.Uri(window.location);
	locationUri.removeParameter("course", course1.id);
	assertEquals("update?course=" + course1.id , locationUri.getFragment());
}

function testDelete() {
	assertEntityPresent(coursesContainer, course1, false, false);
	assertEntityPresent(coursesContainer, course2, false, false);
	
	var course1CheckBox =coursesContainer.find("input[type='checkbox'][name='" + course1.id + "']");
	assertNotNullNorUndefined(course1CheckBox);
	course1CheckBox.click();
	var deleteButton = $("#deleteButton");
	assertNotNullNorUndefined(deleteButton[0]);
	deleteButton.click();
	
	$('#cursoconducir-dialog-confirm').find('a.btn')[0].click();
	
	course1CheckBox =coursesContainer.find("input[type='checkbox'][name='" + course1.id + "']");
	assertFalse(goog.isDefAndNotNull(course1CheckBox[0]));
	var courseTitle = $("a[href='#update?course=" + course1.id + "']");
	assertFalse(goog.isDefAndNotNull(courseTitle[0]));
	assertEntityPresent(coursesContainer, course2, false, false);
}

function testPublishUnpublish() {
	assertEntityPresent(coursesContainer, course1, false, false);
	assertFalse(course1.published);
	
	$("input[type='checkbox'][name='" + course1.id + "']").click();
	initElements();
	assertTrue(goog.isDefAndNotNull(publishButton[0]));
	assertFalse(goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEntityPresent(coursesContainer, course1, true, false);
	publishButton.click();
	
	new cursoconducir.CourseClient().get([course1.id], function(courses) {
		assertEquals(course1.id, courses.id);
		assertTrue(courses.published);
		assertEntityPresent(coursesContainer, courses, false, false);
		course1 = courses;
	});
	
	$("input[type='checkbox'][name='" + course1.id + "']").click();
	initElements();
	assertFalse(goog.isDefAndNotNull(publishButton[0]));
	assertTrue(goog.isDefAndNotNull(unpublishButton[0]));
	
	assertEntityPresent(coursesContainer, course1, true, false);
	unpublishButton.click();
	
	new cursoconducir.CourseClient().get([course1.id], function(courses) {
		assertEquals(course1.id, courses.id);
		assertFalse(courses.published);
		assertEntityPresent(coursesContainer, courses, false, false);
	});
}

function testPublishUnpublishServerError() {
	$("input[type='checkbox'][name='" + course1.id + "']").click();
	initElements();
	
	var error = {status: "error status", error: "error message"};
	mockCourse.setError(error);
	publishButton.click();
	
	waitForCondition(function() {
		return $('.feedback').text().indexOf(error.status + ' ' + error.error) > 0;
	}, function() {
		assertFalse($('.feedback').hasClass('hide'));
		
		new cursoconducir.CourseClient().get([course1.id], function(courses) {
			assertEquals(course1.id, courses[0].id);
			assertTrue(courses[0].published);
			assertEntityPresent(coursesContainer, courses[0], false, false);
		});
	});
}

function _testBackForthNavigation() {
	fail();
}

/**
 * @private
 * @param {number} n
 */
function lesson(n) {
	return {
		id : "lesson" + n + "Id",
		title : "lesson" + n,
		description : "lesson" + n + " description",
		questionIds : [ "1", "2", "3" ],
		published : false
	};
};
