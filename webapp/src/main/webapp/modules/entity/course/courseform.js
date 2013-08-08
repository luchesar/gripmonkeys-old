goog.provide('cursoconducir.CourseForm');

goog.require('cursoconducir.Course')
goog.require('cursoconducir.CourseClient')
goog.require('cursoconducir.template.courseForm');
goog.require('cursoconducir.EntityList');
goog.require('cursoconducir.Lesson');
goog.require('cursoconducir.LessonClient');
goog.require("bootstrap.twipsy");
goog.require("bootstrap.popover");
goog.require("bootstrap.tooltip");
goog.require("goog.array");
goog.require('cursoconducir.utils');
goog.require("cursoconducir.admin.courses.Model");
goog.require("cursoconducir.admin.tests.Model");

/**
 * @constructor
 * @param container
 */
cursoconducir.CourseForm = function(container) {
	this.container = container;
	
	/** 
	 * @private
	 * @type {cursoconducir.EntityList}
	 */
	var courseLessons;
	
	/**
	 * @private
	 * @type {cursoconducir.EntityList}
	 */
	var allLessons;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var addLessonsButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var removeLessonsButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var moveLessonUpButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var moveLessonDownButton;
	
	/**
	 * @private
	 * @type {cursoconducir.LessonClient}
	 */
	var lessonClient = new cursoconducir.LessonClient();
	
	/**
     * @public
     * @param {cursoconducir.admin.courses.Model} model
     */
    this.show = function(model) {
    	/** @type {string}*/
        var templateHtml = cursoconducir.template.courseForm.template(model);
        container.html(templateHtml);
        if (goog.isDefAndNotNull(model.activeCourse)) {
        	init(model);
    	}
    };
    
    /**
     * @private
     * @param {cursoconducir.admin.courses.Model} model
     */
    var init = function(model) {
    	courseLessons = new cursoconducir.EntityList($('#courseLessons'));
        allLessons = new cursoconducir.EntityList($('#allLessons'));
        
        addLessonsButton = container.find("#addLessonsButton");
    	removeLessonsButton = container.find("#removeLessonsButton");
    	
    	moveLessonUpButton = container.find("#moveLessonUpButton");
    	moveLessonDownButton = container.find("#moveLessonDownButton");
        
    	lessonClient.getAll(
        		/** @type {cursoconducir.Lesson.onSuccess}*/function(lessons) {
        	updateLessonPanels(model, lessons);
        	
        	addLessonsButton.click(function() {
        		$(allLessons.getSelection()).each(function() {
        			goog.array.insert(model.activeCourse.lessonIds, this.toString());
        		});
        		
        		updateLessonPanels(model, lessons);
        		removeLessonsButton.addClass('disabled');
        		addLessonsButton.addClass('disabled');
        	});
        	
        	removeLessonsButton.click(function() {
        		$(courseLessons.getSelection()).each(function() {
        			goog.array.remove(model.activeCourse.lessonIds, this.toString());
        			goog.array.remove(model.activeCourse.lessonIds, parseInt(this, 10));
        		});
        		updateLessonPanels(model, lessons);
        		removeLessonsButton.addClass('disabled');
        		addLessonsButton.addClass('disabled');
        	});
        	
        	moveLessonUpButton.click(function() {
        		/** @type {Array.<string>}*/
				var selection = courseLessons.getSelection();
				/** @type {Array.<cursoconducir.Lesson>}*/
				var updatedCourseLessons = moveUp(lessons, courseLessons
						.getEntityIds(), selection);

				courseLessons.show({
					entities : updatedCourseLessons,
					emptyLabel: 'No lessons'
				});
				courseLessons.setSelection(selection);
			});
        	
        	moveLessonDownButton.click(function() {
        		/** @type {Array.<string>}*/
        		var selection = courseLessons.getSelection();
        		/** @type {Array.<cursoconducir.Lesson>}*/
				var updatedCourseLessons = moveDown(lessons, courseLessons
						.getEntityIds(), selection);

				courseLessons.show({
					entities : updatedCourseLessons,
					emptyLabel: 'No lessons'
				});
				courseLessons.setSelection(selection);
        	});
        	
        	courseLessons.addSelectionChangeCallback(function(selection) {
        		if (selection.length > 0) {
        			removeLessonsButton.removeClass('disabled');
        		} else {
        			removeLessonsButton.addClass('disabled');
        		}
        	});
        	
        	allLessons.addSelectionChangeCallback(
        			/**@type {function(Array.<string>)}*/function(selection) {
        		if (selection.length > 0) {
        			addLessonsButton.removeClass('disabled');
        		} else {
        			addLessonsButton.addClass('disabled');
        		}
        	});
        	
        	courseLessons.addSelectionChangeCallback(
        			/**@type {function(Array.<string>)}*/function(selection) {
        		if (selection.length > 0) {
        			moveLessonUpButton.removeClass('disabled');
        			moveLessonDownButton.removeClass('disabled');
        		} else {
        			moveLessonUpButton.addClass('disabled');
        			moveLessonDownButton.addClass('disabled');
        		}
        	});
        	
//        	addLessonsButton.popover({title:"Add selected lessons to the course"});
//        	removeLessonsButton.popover({title:"Add lessons", content:"Remove selected lessons to the course"});
        });
    };
    
    /**
     * @private
     * @param {Array.<cursoconducir.Lesson>} allLessons
     * @param {Array.<string>} courseLessonIds
     * @param {Array.<string>} selectedIds
     * @return {Array.<cursoconducir.Lesson>}
     */
    var moveUp = function(allLessons, courseLessonIds, selectedIds) {
    	var newLessonOrder = /** @type {Array.<cursoconducir.Lesson>}*/[];
    	var minIndex = 0;
    	goog.array.forEach(courseLessonIds, 
    			/**@type {function(string, number)}*/function(id, index) {
    		/** @type {?cursoconducir.Lesson}*/
    		var lesson  = cursoconducir.utils.findObjectById(allLessons, id);
    		if (goog.array.contains(selectedIds, id)) {
    			if (minIndex < index) {
    				minIndex = index -1;
        			goog.array.insertAt(newLessonOrder, lesson, minIndex);
    			} else {
    				goog.array.insert(newLessonOrder, lesson);
    				minIndex = index + 1;
    			}
    		} else {
    			goog.array.insert(newLessonOrder, lesson);
    		}
    	});
    	
    	return newLessonOrder;
    };
    
    /**
     * @private
     * @param {Array.<cursoconducir.Lesson>} allLessons
     * @param {Array.<string>} courseLessonIds
     * @param {Array.<string>} selectedIds
     * @return {Array.<cursoconducir.Lesson>}
     */
    var moveDown = function(allLessons, courseLessonIds, selectedIds) {
    	var newLessonOrder = /** @type {Array.<cursoconducir.Lesson>}*/[];
    	var maxIndex = courseLessonIds.length - 1 ;
    	goog.array.forEachRight(courseLessonIds, 
    			/**@type {function(string, number)}*/function(id, index) {
    		/** @type {?cursoconducir.Lesson}*/
    		var lesson  = cursoconducir.utils.findObjectById(allLessons, id);
    		if (goog.array.contains(selectedIds, id)) {
    			if (maxIndex > index) {
    				maxIndex = index + 1;
    				goog.array.insertAt(newLessonOrder, lesson, maxIndex);
    			} else {
    				goog.array.insertAt(newLessonOrder, lesson, 0);
    				maxIndex = index -1;
    			}
    		} else {
    			goog.array.insertAt(newLessonOrder, lesson, 0);
    		}
    	});
    	
    	return newLessonOrder;
    };
    
    /**
     * @private
     * @param {cursoconducir.admin.courses.Model} model
     * @param {Array.<cursoconducir.Lesson>} lessons
     */
    var updateLessonPanels = function(model, lessons) {
    	/** @type {{courseLessons: Array.<cursoconducir.Lesson>, allOtherLessons: Array.<cursoconducir.Lesson>}} */
    	var lessonsSplit = splitLessons(model, lessons);
    	courseLessons.show({entities:lessonsSplit.courseLessons, emptyLabel:'No lessons'});
    	allLessons.show({entities:lessonsSplit.allOtherLessons, emptyLabel:'No lessons'});
    };
    
    /**
     * @param {cursoconducir.admin.courses.Model} model
     * @param {Array.<cursoconducir.Lesson>} lessons
     * @return {{courseLessons: Array.<cursoconducir.Lesson>, allOtherLessons: Array.<cursoconducir.Lesson>}} 
     */
    var splitLessons = function(model, lessons) {
    	/** @type {Array.<cursoconducir.Lesson>}*/
    	var courseLessons = [];
    	/** @type {Array.<cursoconducir.Lesson>}*/
    	var allOtherLessons = [];
    	
    	goog.array.insertArrayAt(allOtherLessons, lessons);
    	if (!goog.isDefAndNotNull(model.activeCourse.lessonIds)) {
    		model.activeCourse.lessonIds = [];
    	}
		goog.array.forEach(model.activeCourse.lessonIds, function(id) {
			/** @type {?cursoconducir.Lesson}*/
			var lessonById = cursoconducir.utils.findObjectById(lessons, id);
			if (goog.isDefAndNotNull(lessonById)) {
				goog.array.insert(courseLessons, lessonById);
				goog.array.remove(allOtherLessons, lessonById);
			}
		});
    	
    	return {courseLessons: courseLessons, allOtherLessons: allOtherLessons};
    };
    
    /**
     * @public
     * @return {?cursoconducir.Course}
     */
    this.getCourse = function() {
    	/** @type {?string}*/
    	var id = $('input[type=hidden][name=courseId]').val().toString();
    	if (!id || id == "null" || id == "undefined") {
    		id = null;
    	}
    	/** @type {string}*/
    	var title = $('input[type=text][name=courseTitle]').val().toString();
    	/** @type {?string}*/
    	var description = $("textarea[name=courseDescription]").val().toString();
    	/** @type {Array.<?number>}*/
    	var lessonIds = courseLessons.getEntityIds();
    	return {
			id: id,
			title: title,
			image: null,
			description: description,
			published: false,
			lessonIds: lessonIds
    	};
    };
    
    /**
     * @public
     * @return {boolean}
     */
    this.isValid = function() {
    	return true;
    };
};