goog.provide('cursoconducir.IndexPage');
goog.provide('cursoconducir.index');

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
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');

/**
 * @param {string} allTestJson
 */
cursoconducir.index.init = function(allTestJson) {
	$(function() {
		/** @type {cursoconducir.IndexPage}*/
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
	/** @type {Array.<cursoconducir.Question>}*/
	var allTests = null;
	
	/** 
	 * @private 
	 * @type {string}
	 * @const
	 */
	var PREVIEW = "#preview";
	/** 
	 * @private 
	 * @type {string}
	 * @const
	 */
	var TEST_KEY = "test";
	/** 
	 * @private 
	 * @type {string}
	 * @const
	 */
	var LESSON = "lesson";
	/** 
	 * @private 
	 * @type {string}
	 * @const
	 */
	var LESSONS = "lessons";
	/** 
	 * @private 
	 * @type {string}
	 * @const
	 */
	var SIGNIN = "signin";

	/** @type {cursoconducir.index.Initial}*/
	var initial = null;
	/** @type {cursoconducir.index.ShowLesson}*/
	var showALesson = null;
	/** @type {cursoconducir.index.LessonList}*/
	var lessonList = null;
	/** @type {cursoconducir.index.SigninForm}*/
	var signinForm = null;

	this.start = function(allTestsParam) {
		allTests = allTestsParam;
		var indexContainer = $('#indexContainer');
		initial = new cursoconducir.index.Initial(indexContainer, allTests);
		showALesson = new cursoconducir.index.ShowLesson(indexContainer);
		lessonList = new cursoconducir.index.LessonList(indexContainer);
		signinForm = new cursoconducir.index.SigninForm(indexContainer);
		
		goog.events.listen(window, goog.events.EventType.HASHCHANGE,
				function(e) {
					doHashChanged();
				});
		doHashChanged();
	};

	/**
	 * @private
	 * @param {string=} hash
	 */
	var doHashChanged = function(hash) {
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#') {
			doDefault();
		} else if (hash.indexOf(PREVIEW) == 0) {
			initial.doPreview(cursoconducir.utils.queryParam(TEST_KEY));
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

	/**
	 * @private
	 */
	var doDefault = function() {
		/** @type {cursoconducir.Question}*/
		var activeTest = null;
		if (allTests.length > 0) {
			activeTest = cursoconducir.utils.decode(allTests[0]);
		}
		initial.show(activeTest);
	};
	
	/**
	 * @private
	 */
	var doShowLesson = function() {
		/** @type {string}*/
		var lessonId = cursoconducir.utils.queryParam(LESSON);
		cursoconducir.Lesson.get([ lessonId ], 
				/** @type {cursoconducir.Lesson.onSuccess}*/function(lessons) {
			/** @type {Array.<cursoconducir.Lesson>|cursoconducir.Lesson}*/
			var foundLesson = lessons;
			if (goog.isArray(lessons)) {
				foundLesson = lessons[0];
			}

			cursoconducir.Question.get(foundLesson.questionIds, 
					/** @type {cursoconducir.Question.onSuccess}*/function(questions) {
				/** @type {Array.<cursoconducir.Question>|cursoconducir.Question}*/
				var foundQuestions = questions;
				if (!goog.isArray(foundQuestions)) {
					foundQuestions = [foundQuestions];
				}
				showALesson.show(foundLesson, foundQuestions);
			});
		});
	};
};

