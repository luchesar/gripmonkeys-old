goog.provide('cursoconducir.admin.LessonsPage');
goog.provide('cursoconducir.admin.lessons');

goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.AllLessons');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.template.lesson.buttons');
goog.require('cursoconducir.utils');

goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('cursoconducir.Lesson');

/**
 * @public
 */
cursoconducir.admin.lessons.init = function() {
	$(function() {
		/** @type {jQuery} */
		var contanier = $('#container');
		/** @type {cursoconducir.admin.LessonPage} */
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
	/**
	 * @type {string}
	 * @const
	 */
	var CREATE = '#create';
	/**
	 * @type {string}
	 * @const
	 */
	var CANCEL = '#cancel';
	/**
	 * @type {string}
	 * @const
	 */
	var UPDATE = '#update';
	/**
	 * @type {string}
	 * @const
	 */
	var LESSON_KEY = 'lesson';

	/** @private */
	var model = {
		/** @type {Array.<cursoconducir.Lesson>} */
		allLessons : [],
		/** @type {cursoconducir.Lesson} */
		activeLesson : cursoconducir.Lesson.create({
			id : null,
			title : "",
			description : "",
			questionIds : []
		})
	};

	/**
	 * @type {cursoconducir.AllLessons}
	 * @private
	 */
	var allLessons = new cursoconducir.AllLessons(lessonsContainer);

	/**
	 * @param {Array.<string>} selection
	 * @private
	 */
	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			updateButtons(cursoconducir.template.lesson.buttons.initialWithSelection);
		} else {
			updateButtons(cursoconducir.template.lesson.buttons.initial);
		}
	};
	allLessons.addSelectionChangeCallback(selectionChangedCallback);

	/**
	 * @type {cursoconducir.LessonForm}
	 * @private
	 */
	var lessonForm = new cursoconducir.LessonForm(lessonsContainer);

	/**
	 * @public
	 */
	this.start = function() {
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
		/** @type {string} */
		var lessonId = /** @type {string} */ new goog.Uri(window.location).getQueryData().get(LESSON_KEY);
		if ((model && model.activeLesson && model.activeLesson.id == lessonId)
				|| lessonId == undefined || lessonId == "") {
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lesson.buttons.edit);
		} else {
			/** @type {cursoconducir.Lesson} */
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
							+ '. Server returned error \'' + xhr.status + ' '
							+ thrownError + '\'');

				});
			}
		}
	};

	/**
	 * @param {function(jQuery.event,XMLHttpRequest,Object.<string, *>)} onComplate
	 * @private
	 */
	var fetchAllLessons = function(onComplate) {
		hideFeedback();
		cursoconducir.Lesson.getAll(function(allLessons, textStatus, jqXHR) {
			model.allLessons = allLessons;
		}, function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all questions. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};

	/**
	 * @param {function(Object.<*>)} template
	 * @private
	 */
	var updateButtons = function(template) {
		/** @type {jQuery} */
		var pageButtons = $('.pageButtons');
		/** @type {string} */
		var templateHtml = template(model);
		pageButtons.html(templateHtml);

		$('#deleteButton').click(function() {
			doDelete();
		});
		/** @type {jQuery} */
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
		postToServer(lessonForm.getLesson(),
				/** @type {function(Array.<cursoconducir.Lesson>, string=, jQuery.jqXHR=)}*/
				function(savedLessons, textStatus, jqXHR) {
					if (!model.allLessons) {
						model.allLessons = [];
					}

					// we can only save one lesson
					/** @type {cursoconducir.Lesson}*/
					var savedLesson = savedLessons[0];
					
					/** @type {number}*/
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
	 * @param {cursoconducir.Lesson} lesson
	 * @param {function(Array.<cursoconducir.Lesson>, string=, jQuery.jqXHR=)} onSuccess
	 */
	var postToServer = function(lesson, onSuccess) {
		hideFeedback();

		cursoconducir.Lesson
				.store(
						[ lesson ],
						onSuccess,
						/**@type {function(jQuery.event,XMLHttpRequest,Object.<string,*>)}*/
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the lesson did not get saved because server returned error \''
									+ xhr.data + ' ' + thrownError + '\'');
						});
	};

	/** @private */
	var doDelete = function() {
		hideFeedback();
		/** @type {Array.<string>} */
		var selectedLessonsIds = allLessons.getSelection();
		/** @type {string} */
		var selectedLessons = '';
		for ( var i = 0; i < selectedLessonsIds.length; i++) {
			/** @type {cursoconducir.Lesson} */
			var selectedLesson = cursoconducir.utils.findObjectById(
					model.allLessons, selectedLessonsIds[i]);
			selectedLessons += selectedLesson.title + ", ";
		}
		if (confirmDelete(selectedLessons)) {
			cursoconducir.Lesson.del(selectedLessonsIds,
			/**@type {function(Array.<cursoconducir.Lesson>, string=,jQuery.jqXHR=)}*/
			function(wasDeleted, textStatus, jqXHR) {
				if (wasDeleted) {
					for ( var i = 0; i < selectedLessonsIds.length; i++) {
						/** @type {number} */
						var spliceIndex = cursoconducir.utils
								.findObjectIndexById(model.allLessons,
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

	/**
	 * @private
	 * @return boolean
	 */
	var confirmDelete = function(selectedTests) {
		return window.confirm("Are you sure you want to delete '"
				+ selectedTests + "' ?");
	};

	/** @private */
	var showFeedback = function(errorMessage) {
		/** @type {jQuery} */
		var feedback = $('.feedback');
		/** @type {string} */
		var templateHtml = cursoconducir.template.lesson.buttons.feedback({
			errorMessage : errorMessage
		});
		feedback.html(templateHtml);
		feedback.removeClass('hide');
	};

	/** @private */
	var hideFeedback = function() {
		/** @type {jQuery} */
		var feedback = $('.feedback');
		feedback.empty();
		feedback.addClass('hide');
	};
};