goog.provide('cursoconducir.admin.LessonsPage');
goog.provide('cursoconducir.admin.lessons');

goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.AllLessons');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.template.lesson.buttons');
goog.require('cursoconducir.utils');

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
		allLessons : [],
		/** @type {cursoconducir.Lesson} */
		activeLesson : cursoconducir.Lesson.create({id: null, title: "", description: "", questionIds:[]})
	};

	/** @type {cursoconducir.AllLessons} */
	var allLessons = new cursoconducir.AllLessons(lessonsContainer);
	
	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			updateButtons(cursoconducir.template.lesson.buttons.initialWithSelection);
		} else {
			updateButtons(cursoconducir.template.lesson.buttons.initial);
		}
	};
	allLessons.addSelectionChangeCallback(selectionChangedCallback);
	
	/** @type {cursoconducir.LessonForm} */
	var lessonForm = new cursoconducir.LessonForm(lessonsContainer);

	this.start = function() {
		$(window).hashchange(function() {
			doHashChanged();
		});
		$(window).hashchange();
	};

	/**
	 * @private
	 * @param {string=}
	 *            hash
	 */
	var doHashChanged = function(hash) {
		hideFeedback();
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#' || hash == CANCEL) {
			fetchAllLessons(function() {
				allLessons.show(model);
			});
			updateButtons(cursoconducir.template.lesson.buttons.initial);
		} else if (hash == CREATE) {
			model.activeLesson = cursoconducir.Lesson.create({
				title : "",
				description : "",
				questionIds : []
			});
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lesson.buttons.edit);
		} else if (hash.indexOf(UPDATE) == 0) {
			doUpdateLesson();
		}
	};
	
	/**
	 * @private
	 */
	var doUpdateLesson = function() {
		var lessonId = $.getQueryString(LESSON_KEY);
		if ((model && model.activeLesson && model.activeLesson.id == lessonId)
				|| lessonId == undefined || lessonId == "") {
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lesson.buttons.edit);
		} else {
			var foundLesson = cursoconducir.utils.findObjectById(
					model.allLessons, lessonId);
			if (foundLesson) {
				model.activeLesson = foundLesson;
				lessonForm.show(model);
				updateButtons(cursoconducir.template.lesson.buttons.edit);
			} else {
				cursoconducir.Lesson.get([ lessonId ], function(lessons) {
					model.activeLesson = lessons[0];
					lessonForm.show(model);
					updateButtons(cursoconducir.template.lesson.buttons.edit);
				}, function(xhr, ajaxOptions, thrownError) {
					showFeedback('Cannot fetch test with id ' + lessonId
							+ '. Server returned error \'' + xhr.status
							+ ' ' + thrownError + '\'');

				});
			}
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
		var saveButton = $('#saveButton')[0];
		$('#saveButton').click(function() {
			updateCurrentEditedLesson();
		});
	};

	/** private */
	var updateCurrentEditedLesson = function() {
		if (!lessonForm.isValid()) {
			return;
		}
		postToServer(lessonForm.getLesson(), function(savedLessons, textStatus,
				jqXHR) {
			if (!model.allLessons) {
				model.allLessons = [];
			}
			
			// we can only save one lesson
			var savedLesson = savedLessons[0];
			

			var lessonIndex = cursoconducir.utils.findObjectIndexById(
							model.allLessons, savedLesson.id);
			if (lessonIndex < 0) {
				goog.array.insert(model.allLessons, savedLesson);
			} else {
				goog.array.removeAt(model.allLessons, lessonIndex);
				goog.array.insertAt(model.allLessons, savedLesson,
						lessonIndex);
			}
			model.activeLesson = savedLesson;
			window.location.hash = '#';
		});
	};

	/**
	 * @private
	 * @param {cursoconducir.Lesson}
	 * @param {Function(Array.
	 *            <cursoconducir.Lesson>)} onSuccess
	 */
	var postToServer = function(lesson, onSuccess) {
		hideFeedback();

		cursoconducir.Lesson
				.store(
						[ lesson ],
						onSuccess,
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the lesson did not get saved because server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
						});
	};

	var doDelete = function() {
		hideFeedback();
		/** @type Array.<string> */
		var selectedLessonsIds = allLessons.getSelection();
		var selectedLessons = '';
		for ( var i = 0; i < selectedLessonsIds.length; i++) {
			/** @type cursoconducir.Lesson */
			var selectedLesson = cursoconducir.utils.findObjectById(
					model.allLessons, selectedLessonsIds[i]);
			selectedLessons += selectedLesson.title + ", ";
		}
		if (confirmDelete(selectedLessons)) {
			cursoconducir.Lesson.del(selectedLessonsIds, function(wasDeleted,
					textStatus, jqXHR) {
				if (wasDeleted) {
					for ( var i = 0; i < selectedLessonsIds.length; i++) {
						var spliceIndex = cursoconducir.utils
								.findObjectIndexById(model,
										selectedLessonsIds[i]);
						model.allLessons.splice(spliceIndex, 1);
					}
				}
			}, function(xhr, ajaxOptions, thrownError) {
				showFeedback('Cannot delete a lesson. Server returned error \''
						+ xhr.status + ' ' + thrownError + '\'');
			}, function() {
				allLessons.show(model);
				updateButtons(cursoconducir.template.lesson.buttons.initial);
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
		var templateHtml = cursoconducir.template.lesson.buttons.feedback({
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