goog.provide('cursoconducir.admin.LessonsPage');
goog.provide('cursoconducir.admin.lessons');

goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.AllLessons');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.template.lesson.buttons');

goog.require('hashchange');
goog.require('jquery.querystring');
goog.require('goog.json');
goog.require('cursoconducir.Lesson');

/**
 * @public
 */
cursoconducir.admin.lessons.init = function() {
	$(function() {
		var contanier = $('#container');
		var lessonPage = new cursoconducir.admin.LessonPage(contanier);
		lessonPage.start();
	});
};

/**
 * @constructor
 * @private
 * @param lessonsContainer
 */
cursoconducir.admin.LessonPage = function(lessonsContainer) {
	var CREATE = '#create';
	var CANCEL = '#cancel';
	var UPDATE = '#update';
	var LESSON_KEY = 'lesson';
	
	/** @private */
	var model = {
		/** @type {Array.<cursoconducir.Lesson>} */
		allLessons : null,
		/** @type {cursoconducir.Lesson} */
		activeLesson : null
	};
	
	/** @type {cursoconducir.AllLessons}*/
	var allLessons = new cursoconducir.AllLessons(lessonsContainer);
	/** @type {cursoconducir.LessonForm}*/
	var lessonForm = new cursoconducir.LessonForm(lessonsContainer);

	this.start = function() {
		$(window).hashchange(function() {
			doHashChanged();
		});
		$(window).hashchange();
	};

	/** 
	 * @private 
	 * @param {string} hash
	 */
	var doHashChanged = function(hash) {
		hideFeedback();
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#' || hash == CANCEL) {
			fetchAllLessons(function(){
				allLessons.show(model);
			});
			updateButtons(cursoconducir.template.lesson.buttons.initial);
		} else if (hash == CREATE) {
			model.activeLesson = cursoconducir.Lesson.create({
				id : null,
				title : "",
				description : "",
				questionIds : []
			});
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lesson.buttons.edit);
		} else if (hash.indexOf(UPDATE) == 0) {
		} else if (hash.indexOf(PREVIEW) == 0) {
		}
	};
	
	var fetchAllLessons = function(onComplate) {
		hideFeedback();
		cursoconducir.Lesson.getAll(function(allLessons, textStatus, jqXHR) {
			model.allLessons = allLessons;
		}, function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all questions. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};
	
	/** @private */
	var updateButtons = function(template) {
		var pageButtons = $('.pageButtons');
		var templateHtml = template(model);
		pageButtons.html(templateHtml);

		$('#deleteButton').click(function() {
			doDelete();
		});
		$('#saveEditedButton').click(function() {
			updateCurrentEditedTest();
		});
	};
	
	var postToServerDefaultSuccess = function(savedQuestionsIds, textStatus, jqXHR) {
		$(savedQuestionsIds).each(function() {
			var testIndex = cursoconducir.utils.findObjectIndexById(model.allLessons, this.id);
	        if (!model.allTests) {
	            model.allTests = [];
	        }
	        if (testIndex < 0) {
	            testIndex = model.allTests.length;
	        }
	        model.allTests[testIndex] = cursoconducir.utils.decode(this);
		});
        
        window.location.hash = '#';
    };
    
    /** private */
	var updateCurrentEditedTest = function() {
		if (!testModule.isValid()) {
			return;
		}
		var templateTest = testModule.getTest();
		postToServer(templateTest, postToServerDefaultSuccess);
	};
    
    /** @private */
	var postToServer = function(templateTest, onSuccess) {
		hideFeedback();
		var test = cursoconducir.utils.code(templateTest);

		cursoconducir.Question
				.store(
						[ test ],
						onSuccess,
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the test did not get saved because server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
						});
	};
	
	var doDelete = function() {
		hideFeedback();
		var selectedLessonsIds = allTestsModule.getSelection();
		var selectedLessons = '';
		for ( var i = 0; i < selectedLessonsIds.length; i++) {
			var selectedLesson = cursoconducir.utils.findObjectById(model.allLessons,
					selectedLessonsIds[i]);
			selectedLessons += selectedLesson.title + ", ";
		}
		if (confirmDelete(selectedLessons)) {
			cursoconducir.Lesson.del(selectedLessonsIds, function(wasDeleted,
					textStatus, jqXHR) {
				if (wasDeleted) {
					for ( var i = 0; i < selectedLessonsIds.length; i++) {
						var spliceIndex = cursoconducir.utils
								.findObjectIndexById(model, selectedLessonsIds[i]);
						model.allLessons.splice(spliceIndex, 1);
					}
				}
			},
			function(xhr, ajaxOptions, thrownError) {
				showFeedback('Cannot delete a lesson. Server returned error \''
						+ xhr.status + ' ' + thrownError + '\'');
			},
			function() {
				testsContainer.empty();
				allTestsModule.show(model);
				updateButtons(cursoconducir.template.tests.buttons.initial);
			});
		}
	};
	
	/** @private */
	var confirmDelete = function(selectedTests) {
		return window.confirm("Are you sure you want to delete '"
				+ selectedTests + "' ?");
	};
	
	/** @private */
	var showFeedback = function(errorMessage) {
		var feedback = $('.feedback');
		var templateHtml = cursoconducir.template.tests.buttons.feedback({
			errorMessage : errorMessage
		});
		feedback.html(templateHtml);
		feedback.removeClass('hide');
	};

	/** @private */
	var hideFeedback = function() {
		var feedback = $('.feedback');
		feedback.empty();
		feedback.addClass('hide');
	};
};