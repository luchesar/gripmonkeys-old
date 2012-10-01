goog.provide('cursoconducir.admin.LessonsPage');
goog.provide('cursoconducir.admin.lessons');

goog.require('cursoconducir.LessonForm');
goog.require('cursoconducir.template.lessonpage');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.LessonClient');
goog.require('cursoconducir.dialogs');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.moduleconstants');
goog.require('cursoconducir.EntityList');

goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.History');
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
	var contanier = lessonsContainer.find('#container');
	/** @type {jQuery} */
	var pageButtons = lessonsContainer.find('.pageButtons');
	/** @type {jQuery} */
	var feedback = lessonsContainer.find('.feedback');

	/** @private */
	var model = {
		/** @type {Array.<cursoconducir.Lesson>} */
		allLessons : [],
		/** @type {?cursoconducir.Lesson} */
		activeLesson : {id:null, title: "", description: "", questionIds:/**@type {Array.<string>}*/[]}
	};
	
	/**
	 * @private
	 * @type {cursoconducir.LessonClient}
	 */
	var lessonClient = new cursoconducir.LessonClient();
	
	/**
	 * @type {cursoconducir.EntityList}
	 * @private
	 */
	var allLessons = new cursoconducir.EntityList(contanier);
	allLessons.setShowImage(false);
	allLessons.addLinkCallback(function(id) {
		var locationUri = new goog.Uri(window.location);
		locationUri.removeParameter("lesson");
		locationUri.setFragment("update?lesson=" + id );
		
		window.location = locationUri.toString();
	});

	/**
	 * @param {Array.<string>} selection
	 * @private
	 */
	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			/** @type {Array.<cursoconducir.Lesson>} */
			var selectedLessons = cursoconducir.utils.findLessons(model, selection);
			/** @type {?boolean} */
			var allPublished = null;
			for ( var i = 0; i < selectedLessons.length; i++) {
				if (i == 0) {
					allPublished = selectedLessons[i].published;
				}
				if (allPublished != selectedLessons[i].published) {
					allPublished = null;
					break;
				}
			}
			if (allPublished === true) {
				updateButtons(cursoconducir.template.lessonpage.initialSelectionUnpublish);
			} else if (allPublished === false) {
				updateButtons(cursoconducir.template.lessonpage.initialSelectionPublish);
			} else {
				updateButtons(cursoconducir.template.lessonpage.initialSelectionDifferentPublish);
			}
		} else {
			updateButtons(cursoconducir.template.lessonpage.initialButtons);
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
	 */
	var showTheLessons = function() {
		allLessons.show({entities: model.allLessons, emptyLabel: 'No lessons'});
		updateButtons(cursoconducir.template.lessonpage.initialButtons);
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
			updateTitle(cursoconducir.template.lessonpage.titleInitial);
			fetchAllLessons(showTheLessons);
		} else if (hash == CREATE) {
			updateTitle(cursoconducir.template.lessonpage.createTitle);
			model.activeLesson = {
				id : null,
				title : "",
				description : "",
				questionIds : []
			};
			lessonForm.show(model);
			updateButtons(cursoconducir.template.lessonpage.editButtons);
		} else if (hash.indexOf(UPDATE) == 0) {
			updateTitle(cursoconducir.template.lessonpage.editTitle);
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
			updateButtons(cursoconducir.template.lessonpage.editButtons);
		} else {
			/** @type {?cursoconducir.Lesson} */
			var foundLesson = cursoconducir.utils.findObjectById(
					model.allLessons, lessonId);
			if (foundLesson) {
				model.activeLesson = foundLesson;
				lessonForm.show(model);
				updateButtons(cursoconducir.template.lessonpage.editButtons);
			} else {
				lessonClient.get([ lessonId ], 
					/** @type {cursoconducir.Lesson.onSuccess}*/
					function(lessons) {
						model.activeLesson = lessons[0];
						if (!goog.isArray(lessons)) {
							model.activeLesson = /** @type {cursoconducir.Lesson}*/lessons;
						}
						
						lessonForm.show(model);
						updateButtons(cursoconducir.template.lessonpage.editButtons);
					}, 
					/** @type {cursoconducir.TitledEntity.onError}*/
					function(xhr, ajaxOptions, thrownError) {
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
		lessonClient.getAll(
		/** @type {cursoconducir.Lesson.onSuccess}*/function(allLessons, textStatus, jqXHR) {
			model.allLessons = allLessons;
		}, 
		/** @type {cursoconducir.TitledEntity.onError}*/function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all questions. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};
	
	/**
	 * @private
	 * @param {boolean} published
	 */
	var doPublish = function(published) {
		var selectedLessonIds = allLessons.getSelection();
		var selectedLessons = [];
		$(selectedLessonIds).each(function() {
			var selectedLesson = cursoconducir.utils.findObjectById(
					model.allLessons, this);
			selectedLesson.published = published;
			goog.array.insert(selectedLessons, selectedLesson);
		});

		lessonClient.store(selectedLessons, 
				/**@type {cursoconducir.Lesson.onSuccess}*/
				function(a,b,c){showTheLessons();},
				function(xhr, ajaxOptions, thrownError) {
					showFeedback('Cannot publish or unpublish lesson. Server returned error \''
							+ xhr.status + ' ' + thrownError + '\'');
				});
	};

	/**
	 * @param {function(Object.<*>)} template
	 * @private
	 */
	var updateButtons = function(template) {
		/** @type {string} */
		var templateHtml = template(model);
		pageButtons.html(templateHtml);
		pageButtons.find('#deleteButton').click(function() {
			doDelete();
		});
		pageButtons.find('[id="saveButton"]').click(function() {
			updateCurrentEditedLesson();
		});
		pageButtons.find('[id="publishButton"]').click(function() {
			doPublish(true);
		});
		pageButtons.find('[id="unpublishButton"]').click(function() {
			doPublish(false);
		});
	};
	
	/**
	 * @param {function(Object.<*>)} template
	 * @private
	 */
	var updateTitle = function(template) {
		/** @type {string} */
		var templateHtml = template(model);
		$('#mainTitle').html(templateHtml);
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

		lessonClient.store([ lesson ],onSuccess,
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
		confirmDelete(selectedLessons,
			/** @type {cursoconducir.dialogs.confirmCb} */
			function(confirmed) {
				if (confirmed) {
					deleteLessons(selectedLessonsIds);
				}
			});
	};
	
	/**
	 * @private
	 * @param {Array.<string>} selectedLessonsIds
	 */
	var deleteLessons = function(selectedLessonsIds) {
		lessonClient.del(selectedLessonsIds,
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
				}, showTheLessons);
	}

	/**
	 * @private
	 * @param {string} selectedTests
	 * @param {cursoconducir.dialogs.confirmCb} callBack
	 * @return boolean
	 */
	var confirmDelete = function(selectedTests, callBack) {
		return cursoconducir.dialogs.confirm("Please confirm", "Are you sure you want to delete '"
				+ selectedTests + "' ?", callBack);
	};

	/** @private */
	var showFeedback = function(errorMessage) {
		/** @type {string} */
		var templateHtml = cursoconducir.template.lessonpage.feedback({
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