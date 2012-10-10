goog.provide('cursoconducir.admin.CoursesPage');
goog.provide('cursoconducir.admin.courses');

goog.require('cursoconducir.CourseForm');
goog.require('cursoconducir.template.coursepage');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.Course');
goog.require('cursoconducir.CourseClient');
goog.require('cursoconducir.dialogs');
goog.require('cursoconducir.Course');
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
 * @param coursesContainer
 */
cursoconducir.admin.CoursesPage = function(coursesContainer) {
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
	var LESSON_KEY = 'course';
	
	coursesContainer.html(cursoconducir.template.coursepage.content());

	/** @type {jQuery} */
	var contanier = coursesContainer.find('#container');
	/** @type {jQuery} */
	var pageButtons = coursesContainer.find('.pageButtons');
	/** @type {jQuery} */
	var feedback = coursesContainer.find('.feedback');

	/** @private */
	var model = {
		/** @type {Array.<cursoconducir.Course>} */
		allCourses : [],
		/** @type {?cursoconducir.Course} */
		activeCourse : {
			id : null,
			title : "",
			image : null,
			description : "",
			published : false,
			lessonIds : /** @type {Array.<string>} */[]
		}
	};
	
	/**
	 * @private
	 * @type {cursoconducir.CourseClient}
	 */
	var courseClient = new cursoconducir.CourseClient();
	
	/**
	 * @type {cursoconducir.EntityList}
	 * @private
	 */
	var allCourses = new cursoconducir.EntityList(contanier);
	allCourses.setShowImage(false);
	allCourses.addLinkCallback(function(id) {
		var locationUri = new goog.Uri(window.location);
		locationUri.removeParameter("course");
		locationUri.setFragment("update?course=" + id );
		
		window.location = locationUri.toString();
	});

	/**
	 * @param {Array.<string>} selection
	 * @private
	 */
	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			/** @type {Array.<cursoconducir.Course>} */
			var selectedCourses = findCoursesById(model, selection);
			/** @type {?boolean} */
			var allPublished = null;
			for ( var i = 0; i < selectedCourses.length; i++) {
				if (i == 0) {
					allPublished = selectedCourses[i].published;
				}
				if (allPublished != selectedCourses[i].published) {
					allPublished = null;
					break;
				}
			}
			if (allPublished === true) {
				updateButtons(cursoconducir.template.coursepage.initialSelectionUnpublish);
			} else if (allPublished === false) {
				updateButtons(cursoconducir.template.coursepage.initialSelectionPublish);
			} else {
				updateButtons(cursoconducir.template.coursepage.initialSelectionDifferentPublish);
			}
		} else {
			updateButtons(cursoconducir.template.coursepage.initialButtons);
		}
	};
	allCourses.addSelectionChangeCallback(selectionChangedCallback);

	/**
	 * @type {cursoconducir.CourseForm}
	 * @private
	 */
	var courseForm = new cursoconducir.CourseForm(contanier);
	
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
	var showTheCourses = function() {
		allCourses.show({entities: model.allCourses, emptyLabel: 'No courses'});
		updateButtons(cursoconducir.template.coursepage.initialButtons);
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
			updateTitle(cursoconducir.template.coursepage.titleInitial);
			fetchAllCourses(showTheCourses);
		} else if (hash == CREATE) {
			updateTitle(cursoconducir.template.coursepage.createTitle);
			model.activeCourse = {
				id : null,
				title : "",
				image: null,
				description : "",
				published: false,
				lessonIds : []
			};
			courseForm.show(model);
			updateButtons(cursoconducir.template.coursepage.editButtons);
		} else if (hash.indexOf(UPDATE) == 0) {
			updateTitle(cursoconducir.template.coursepage.editTitle);
			doUpdateCourse();
		}
	};

	/**
	 * @private
	 */
	var doUpdateCourse = function() {
		/** @type {goog.Uri}*/
		var locationUri = new goog.Uri(window.location);
		/** @type {string} */
		var courseId = /** @type {string} */ locationUri.getQueryData().get(LESSON_KEY);
		if (!goog.isDefAndNotNull(courseId)) {
			var fragmentUri = new goog.Uri(locationUri.getFragment());
			courseId = /** @type {string} */fragmentUri.getQueryData().get(LESSON_KEY);
		}
		if ((model && model.activeCourse && model.activeCourse.id == courseId)
				|| courseId == undefined || courseId == "") {
			courseForm.show(model);
			updateButtons(cursoconducir.template.coursepage.editButtons);
		} else {
			/** @type {?cursoconducir.Course} */
			var foundCourse = findCourseById(model.allCourses, courseId);
			if (foundCourse) {
				model.activeCourse = foundCourse;
				courseForm.show(model);
				updateButtons(cursoconducir.template.coursepage.editButtons);
			} else {
				courseClient.get([ courseId ], 
					/** @type {cursoconducir.Course.onSuccess}*/
					function(courses) {
						model.activeCourse = courses[0];
						if (!goog.isArray(courses)) {
							model.activeCourse = /** @type {cursoconducir.Course}*/courses;
						}
						
						courseForm.show(model);
						updateButtons(cursoconducir.template.coursepage.editButtons);
					}, 
					/** @type {cursoconducir.TitledEntity.onError}*/
					function(xhr, ajaxOptions, thrownError) {
						showFeedback('Cannot fetch test with id ' + courseId
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
	var fetchAllCourses = function(onComplate) {
		hideFeedback();
		courseClient.getAll(
		/** @type {cursoconducir.Course.onSuccess}*/function(allCourses, textStatus, jqXHR) {
			model.allCourses = allCourses;
		}, 
		/** @type {cursoconducir.TitledEntity.onError}*/function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all lessons. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};
	
	/**
	 * @private
	 * @param {boolean} published
	 */
	var doPublish = function(published) {
		/** @type {Array.<number>}*/
		var selectedCourseIds = allCourses.getSelection();
		/** @type {Array.<cursoconducir.Course>}*/
		var selectedCourses = /** @type {Array.<cursoconducir.Course>}*/[];
		$(selectedCourseIds).each(function() {
			/** @type {?cursoconducir.Course}*/
			var selectedCourse = findCourseById(model.allCourses, this);
			selectedCourse.published = published;
			goog.array.insert(selectedCourses, selectedCourse);
		});

		courseClient.store(selectedCourses, 
				/**@type {cursoconducir.Course.onSuccess}*/
				function(a,b,c){showTheCourses();},
				function(xhr, ajaxOptions, thrownError) {
					showFeedback('Cannot publish or unpublish course. Server returned error \''
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
			updateCurrentEditedCourse();
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
	var updateCurrentEditedCourse = function() {
		if (!courseForm.isValid()) {
			return;
		}
		postToServer(courseForm.getCourse(),
				/** @type {cursoconducir.Course.onSuccess}*/
				function(savedCourses, textStatus, jqXHR) {
					if (!model.allCourses) {
						model.allCourses = [];
					}

					// we can only save one course
					/** @type {?cursoconducir.Course}*/
					var savedCourse = savedCourses[0];
					
					/** @type {number}*/
					var courseIndex = cursoconducir.utils.findObjectIndexById(
							model.allCourses, savedCourse.id);
					if (courseIndex < 0) {
						goog.array.insert(model.allCourses, savedCourse);
					} else {
						goog.array.removeAt(model.allCourses, courseIndex);
						goog.array.insertAt(model.allCourses, savedCourse,
								courseIndex);
					}
					model.activeCourse = savedCourse;
					window.location.hash = '#';
				});
	};

	/**
	 * @private
	 * @param {?cursoconducir.Course} course
	 * @param {cursoconducir.Course.onSuccess} onSuccess
	 */
	var postToServer = function(course, onSuccess) {
		hideFeedback();

		courseClient.store([ course ],onSuccess,
						/**@type {cursoconducir.TitledEntity.onError}*/
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the course did not get saved because server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
						});
	};

	/** @private */
	var doDelete = function() {
		hideFeedback();
		/** @type {Array.<string>} */
		var selectedCoursesIds = allCourses.getSelection();
		/** @type {string} */
		var selectedCourses = '';
		for ( var i = 0; i < selectedCoursesIds.length; i++) {
			/** @type {?cursoconducir.Course} */
			var selectedCourse = findCourseById(model.allCourses, selectedCoursesIds[i]);
			selectedCourses += selectedCourse.title + ", ";
		}
		confirmDelete(selectedCourses,
			/** @type {cursoconducir.dialogs.confirmCb} */
			function(confirmed) {
				if (confirmed) {
					deleteCourses(selectedCoursesIds);
				}
			});
	};
	
	/**
	 * @private
	 * @param {Array.<string>} selectedCoursesIds
	 */
	var deleteCourses = function(selectedCoursesIds) {
		courseClient.del(selectedCoursesIds,
				/**@type {cursoconducir.TitledEntity.onDelSuccess}*/
				function(wasDeleted, textStatus, jqXHR) {
					if (wasDeleted) {
						for ( var i = 0; i < selectedCoursesIds.length; i++) {
							/** @type {number} */
							var removeIndex = cursoconducir.utils
									.findObjectIndexById(model.allCourses,
											selectedCoursesIds[i]);
							if (removeIndex > -1) {
								goog.array.removeAt(model.allCourses, removeIndex);
							}
						}
					}
				}, 
				/**@type {cursoconducir.TitledEntity.onError}*/ function(xhr, ajaxOptions, thrownError) {
					showFeedback('Cannot delete a course. Server returned error \''
							+ xhr.status + ' ' + thrownError + '\'');
				}, showTheCourses);
	};

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
		var templateHtml = cursoconducir.template.coursepage.feedback({
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
	
	/**
	 * @private
	 * @param {Array.<cursoconducir.Course>} array
	 * @param {string} id
	 * @return {?cursoconducir.Course}
	 */
	var findCourseById = function(array, id) {
		if (array) {
			/** @type {number}*/
			var index = cursoconducir.utils.findObjectIndexById(array, id);
			if (index > -1) {
				return array[index];
			}
		}
		return null;
	};
	
	/**
	 * @private
	 * @param {cursoconducir.admin.courses.Model} model
	 * @param {Array.<string>} coursesIds
	 * @return {Array.<cursoconducir.Course>}
	 */
	var findCoursesById = function(model, coursesIds) {
		/** @type {Array.<cursoconducir.Course>}*/
		var foundCourses = [];
		for (var i = 0; i < coursesIds.length; i++) {
			var course = findCourseById(model.allCourses, coursesIds[i]);
			goog.array.insert(foundCourses, course);
		}
		return foundCourses;
	};
};