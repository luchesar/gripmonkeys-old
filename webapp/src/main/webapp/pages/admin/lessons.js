goog.provide('cursoconducir.admin.LessonsPage');
goog.provide('cursoconducir.admin.lessons');

goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.AllLessons');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.template.lesson.buttons');
goog.require('cursoconducir.template.lessonpage');
goog.require('cursoconducir.utils');

goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.History');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.moduleconstants');
goog.require('goog.module.ModuleManager');

/**
 * @constructor
 * @public
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
	
	lessonsContainer.html(cursoconducir.template.lessonpage.content());

	/** @type {jQuery} */
	var contanier = $('#container');
	/** @type {jQuery} */
	var pageButtons = $('.pageButtons');
	/** @type {jQuery} */
	var feedback = $('.feedback');

	/** @private */
	var model = {
		/** @type {Array.<cursoconducir.Lesson>} */
		allLessons : [],
		/** @type {?cursoconducir.Lesson} */
		activeLesson : {id:null, title: "", description: "", questionIds:/**@type {Array.<string>}*/[]}
	};
	/**
	 * @type {cursoconducir.AllLessons}
	 * @private
	 */
	var allLessons = new cursoconducir.AllLessons(contanier);

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
	var lessonForm = new cursoconducir.LessonForm(contanier);
	
	/** 
	 * @private
	 * @param {?goog.events.BrowserEvent} e
	 */
	var hashChangeListener = function(e) {
		doHashChanged();
	};

	/**
	 * @public
	 */
	this.start = function() {
		goog.events.listen(window, goog.events.EventType.HASHCHANGE,hashChangeListener);
//		cursoconducir.onHashChange = hashChangeListener;
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
			model.activeLesson = {
				id : null,
				title : "",
				description : "",
				questionIds : []
			};
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
		/** @type {goog.Uri}*/
		var locationUri = new goog.Uri(window.location);
		/** @type {string} */
		var lessonId = /** @type {string} */ locationUri.getQueryData().get(LESSON_KEY);
		if (!goog.isDefAndNotNull(lessonId)) {
			var fragmentUri = new goog.Uri(locationUri.getFragment());
			lessonId = /** @type {string} */fragmentUri.getQueryData().get(LESSON_KEY);
		}
		if ((model && model.activeLesson && model.activeLesson.id == lessonId)
				|| lessonId == undefined || lessonId == "") {
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lesson.buttons.edit);
		} else {
			/** @type {?cursoconducir.Lesson} */
			var foundLesson = cursoconducir.utils.findObjectById(
					model.allLessons, lessonId);
			if (foundLesson) {
				model.activeLesson = foundLesson;
				lessonForm.show(model);
				updateButtons(cursoconducir.template.lesson.buttons.edit);
			} else {
				cursoconducir.Lesson.get([ lessonId ], 
						/** @type {cursoconducir.Lesson.onSuccess}*/function(lessons) {
					model.activeLesson = lessons[0];
					lessonForm.show(model);
					updateButtons(cursoconducir.template.lesson.buttons.edit);
				}, 
				/** @type {cursoconducir.TitledEntity.onError}*/function(xhr, ajaxOptions, thrownError) {
					showFeedback('Cannot fetch test with id ' + lessonId
							+ '. Server returned error \'' + xhr.status + ' '
							+ thrownError + '\'');
				});
			}
		}
	};

	/**
	 * @param {cursoconducir.TitledEntity.onComplate} onComplate
	 * @private
	 */
	var fetchAllLessons = function(onComplate) {
		hideFeedback();
		cursoconducir.Lesson.getAll(
		/** @type {cursoconducir.Lesson.onSuccess}*/function(allLessons, textStatus, jqXHR) {
			model.allLessons = allLessons;
		}, 
		/** @type {cursoconducir.TitledEntity.onError}*/function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all questions. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};

	/**
	 * @param {function(Object.<*>)} template
	 * @private
	 */
	var updateButtons = function(template) {
		/** @type {string} */
		var templateHtml = template(model);
		pageButtons.html(templateHtml);

		$('#deleteButton').click(function() {
			doDelete();
		});
		/** @type {jQuery} */
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
				/** @type {cursoconducir.Lesson.onSuccess}*/
				function(savedLessons, textStatus, jqXHR) {
					if (!model.allLessons) {
						model.allLessons = [];
					}

					// we can only save one lesson
					/** @type {?cursoconducir.Lesson}*/
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
	 * @param {?cursoconducir.Lesson} lesson
	 * @param {cursoconducir.Lesson.onSuccess} onSuccess
	 */
	var postToServer = function(lesson, onSuccess) {
		hideFeedback();

		cursoconducir.Lesson
				.store([ lesson ],onSuccess,
						/**@type {cursoconducir.TitledEntity.onError}*/
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the lesson did not get saved because server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
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
			/** @type {?cursoconducir.Lesson} */
			var selectedLesson = cursoconducir.utils.findObjectById(
					model.allLessons, selectedLessonsIds[i]);
			selectedLessons += selectedLesson.title + ", ";
		}
		if (confirmDelete(selectedLessons)) {
			cursoconducir.Lesson.del(selectedLessonsIds,
			/**@type {cursoconducir.TitledEntity.onDelSuccess}*/
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
			}, 
			/**@type {cursoconducir.TitledEntity.onError}*/ function(xhr, ajaxOptions, thrownError) {
				showFeedback('Cannot delete a lesson. Server returned error \''
						+ xhr.status + ' ' + thrownError + '\'');
			}, 
			/**@type {cursoconducir.TitledEntity.onComplate}*/function() {
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
		/** @type {string} */
		var templateHtml = cursoconducir.template.lesson.buttons.feedback({
			errorMessage : errorMessage
		});
		feedback.html(templateHtml);
		feedback.removeClass('hide');
	};

	/** @private */
	var hideFeedback = function() {
		feedback.empty();
		feedback.addClass('hide');
	};
};