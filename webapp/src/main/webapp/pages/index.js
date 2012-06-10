goog.provide('cursoconducir.IndexPage');
goog.provide('cursoconducir.index');

goog.require('jquery');
goog.require('hashchange');
goog.require('jquery.querystring');
goog.require('bootstrap.modal');
goog.require('goog.net.Cookies');

goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestPreviewModule');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.indexpage.template');
goog.require('cursoconducir.index.ShowLesson');
goog.require('cursoconducir.index.Initial');
goog.require('cursoconducir.index.LessonList');
goog.require('cursoconducir.index.SigninForm');

/**
 * @param {string}
 *            allTestJson
 */
cursoconducir.index.init = function(allTestJson) {
	$(function() {
		var indexPage = new cursoconducir.IndexPage();
		indexPage.start(allTestJson);
		cursoconducir.index.showInConstruction();
	});
};

cursoconducir.index.showInConstruction = function() {
	var visitedCookie = "cursoconducirInConstruction";
	var cookies = new goog.net.Cookies(document);
	if (!cookies.containsKey(visitedCookie) == "true") {
		$('#under-construction-modal').modal({
			keyboard : true,
			backdrop : true,
			show : true
		});
		cookies.set(visitedCookie, "true", 864000);
	}
};

/**
 * @constructor
 */
cursoconducir.IndexPage = function() {
	var allTests = null;

	/** @private */
	var ANSWER = "answer";
	/** @private */
	var PREVIEW = "#preview";
	/** @private */
	var TEST_KEY = "test";
	/** @private */
	var LESSON = "lesson";
	/** @private */
	var LESSONS = "lessons";
	/** @private */
	var SIGNIN = "signin";

	var initial = null;
	var showALesson = null;
	var lessonList = null;
	var signinForm = null;

	this.start = function(allTestsParam) {
		allTests = allTestsParam;
		var indexContainer = $('#indexContainer');
		initial = new cursoconducir.index.Initial(indexContainer, allTests);
		showALesson = new cursoconducir.index.ShowLesson(indexContainer);
		lessonList = new cursoconducir.index.LessonList(indexContainer);
		signinForm = new cursoconducir.index.SigninForm(indexContainer);
		
		$(window).hashchange(function() {
			doHashChanged();
		});
		$(window).hashchange();
	};

	/** @private */
	var doHashChanged = function(hash) {
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#') {
			doDefault();
		} else if (hash.indexOf(PREVIEW) == 0) {
			initial.doPreview($.getQueryString(TEST_KEY));
		} else if (hash.indexOf(LESSONS) > -1) {
			cursoconducir.Lesson.getAll(function(allLessons){
				lessonList.show(allLessons);
			});
		} else if (hash.indexOf(LESSON) > -1) {
			doShowLesson();
		} else if (hash.indexOf(SIGNIN) > -1) {
			signinForm.show();
		}
		$("#footer").addClass("loaded");
	};

	var doDefault = function() {
		var activeTest = null;
		if (allTests.length > 0) {
			activeTest = cursoconducir.utils.decode(allTests[0]);
		}
		initial.show(activeTest);
	};

	var doShowLesson = function() {
		var lessonId = $.getQueryString(LESSON);
		// var questionId = $.getQueryString(TEST_KEY)
		cursoconducir.Lesson.get([ lessonId ], function(lessons) {
			var foundLesson = lessons;
			if (goog.isArray(lessons)) {
				foundLesson = lessons[0];
			}

			cursoconducir.Question.get(foundLesson.questionIds, function(
					questions) {
				var foundQuestions = questions;
				if (!goog.isArray(foundQuestions)) {
					foundQuestions = [foundQuestions];
				}
				showALesson.show(foundLesson, foundQuestions);
			});
		});
	};
};

