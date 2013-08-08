goog.provide('cursoconducir.IndexPage');
goog.provide('cursoconducir.index');

goog.require('bootstrap.modal');
goog.require('goog.net.Cookies');

goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestPreviewModule');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.QuestionClient');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.indexpage.template');
goog.require('cursoconducir.ShowLesson');
goog.require('cursoconducir.InitialIndex');
goog.require('cursoconducir.LessonList');
goog.require('cursoconducir.SigninForm');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.LessonClient');

/**
 * @constructor
 * @param {jQuery} indexContainer
 */
cursoconducir.IndexPage = function(indexContainer) {
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
	
	/**
	 * @private
	 * @type {cursoconducir.QuestionClient}
	 */
	var questionClient = new cursoconducir.QuestionClient();

	/** @type {cursoconducir.InitialIndex}*/
	var initial = null;
	/** @type {cursoconducir.ShowLesson}*/	
	var showALesson = null;
	/** @type {cursoconducir.LessonList}*/
	var lessonList = null;
	/** @type {cursoconducir.SigninForm}*/
	var signinForm = null;
	
	/**
	 * @private
	 * @type {cursoconducir.LessonClient}
	 */
	var lessonClient = new cursoconducir.LessonClient();

	/**
	 * @public
	 */
	this.start = function() {
		initial = new cursoconducir.InitialIndex(indexContainer);
		showALesson = new cursoconducir.ShowLesson(indexContainer);
		lessonList = new cursoconducir.LessonList(indexContainer);
		signinForm = new cursoconducir.SigninForm(indexContainer);
		
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
			lessonClient.getAll(function(allLessons){
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
		/** @type {?cursoconducir.Question}*/
//		var activeTest = null;
//		if (allTests.length > 0) {
//			activeTest = cursoconducir.utils.decode(allTests[0]);
//		}
//		initial.show(activeTest);
	};
	
	/**
	 * @private
	 */
	var doShowLesson = function() {
		/** @type {?string}*/
		var lessonId = cursoconducir.utils.queryParam(LESSON);
		lessonClient.get([ lessonId ], 
				/** @type {cursoconducir.Lesson.onSuccess}*/function(lessons) {
			/** @type {Array.<cursoconducir.Lesson>|cursoconducir.Lesson}*/
			var foundLesson = lessons;
			if (goog.isArray(lessons)) {
				foundLesson = lessons[0];
			}

			questionClient.get(foundLesson.questionIds, 
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

