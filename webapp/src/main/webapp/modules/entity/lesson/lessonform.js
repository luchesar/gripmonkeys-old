goog.provide('cursoconducir.LessonForm');

goog.require('cursoconducir.template.lessonForm');
goog.require('cursoconducir.EntityList');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.QuestionClient');
goog.require("bootstrap.twipsy");
goog.require("bootstrap.popover");
goog.require("bootstrap.tooltip");
goog.require("goog.array");
goog.require('cursoconducir.utils');
goog.require("cursoconducir.admin.lessons.Model");
goog.require("cursoconducir.admin.tests.Model");

/**
 * @constructor
 * @param container
 */
cursoconducir.LessonForm = function(container) {
	this.container = container;
	
	/** 
	 * @private
	 * @type {cursoconducir.EntityList}
	 */
	var lessonQuestions;
	
	/**
	 * @private
	 * @type {cursoconducir.EntityList}
	 */
	var allQuestions;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var addQuestionsButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var removeQuestionsButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var moveQuestionUpButton;
	
	/**
	 * @private
	 * @type {jQuery}
	 */
	var moveQuestionDownButton;
	
	/**
	 * @private
	 * @type {cursoconducir.QuestionClient}
	 */
	var questionClient = new cursoconducir.QuestionClient();
	
	/**
     * @public
     * @param {cursoconducir.admin.lessons.Model} model
     */
    this.show = function(model) {
    	/** @type {string}*/
        var templateHtml = cursoconducir.template.lessonForm.template(model);
        container.html(templateHtml);
        if (goog.isDefAndNotNull(model.activeLesson)) {
        	init(model);
    	}
    };
    
    /**
     * @private
     * @param {cursoconducir.admin.lessons.Model} model
     */
    var init = function(model) {
    	lessonQuestions = new cursoconducir.EntityList($('#lessonQuestions'));
        allQuestions = new cursoconducir.EntityList($('#allQuestions'));
        
        addQuestionsButton = container.find("#addQuestionsButton");
    	removeQuestionsButton = container.find("#removeQuestionsButton");
    	
    	moveQuestionUpButton = container.find("#moveQuestionUpButton");
    	moveQuestionDownButton = container.find("#moveQuestionDownButton");
        
    	questionClient.getAll(
        		/** @type {cursoconducir.Question.onSuccess}*/function(questions) {
        	updateQuestionPanels(model, questions);
        	
        	addQuestionsButton.click(function() {
        		$(allQuestions.getSelection()).each(function() {
        			goog.array.insert(model.activeLesson.questionIds, this.toString());
        		});
        		
        		updateQuestionPanels(model, questions);
        		removeQuestionsButton.addClass('disabled');
        		addQuestionsButton.addClass('disabled');
        	});
        	
        	removeQuestionsButton.click(function() {
        		$(lessonQuestions.getSelection()).each(function() {
        			goog.array.remove(model.activeLesson.questionIds, this.toString());
        			goog.array.remove(model.activeLesson.questionIds, parseInt(this, 10));
        		});
        		updateQuestionPanels(model, questions);
        		removeQuestionsButton.addClass('disabled');
        		addQuestionsButton.addClass('disabled');
        	});
        	
        	moveQuestionUpButton.click(function() {
        		/** @type {Array.<string>}*/
				var selection = lessonQuestions.getSelection();
				/** @type {Array.<cursoconducir.Question>}*/
				var updatedLessonQuestions = moveUp(questions, lessonQuestions
						.getEntityIds(), selection);

				lessonQuestions.show({
					entities : updatedLessonQuestions,
					emptyLabel: 'No questions'
				});
				lessonQuestions.setSelection(selection);
			});
        	
        	moveQuestionDownButton.click(function() {
        		/** @type {Array.<string>}*/
        		var selection = lessonQuestions.getSelection();
        		/** @type {Array.<cursoconducir.Question>}*/
				var updatedLessonQuestions = moveDown(questions, lessonQuestions
						.getEntityIds(), selection);

				lessonQuestions.show({
					entities : updatedLessonQuestions,
					emptyLabel: 'No questions'
				});
				lessonQuestions.setSelection(selection);
        	});
        	
        	lessonQuestions.addSelectionChangeCallback(function(selection) {
        		if (selection.length > 0) {
        			removeQuestionsButton.removeClass('disabled');
        		} else {
        			removeQuestionsButton.addClass('disabled');
        		}
        	});
        	
        	allQuestions.addSelectionChangeCallback(
        			/**@type {function(Array.<string>)}*/function(selection) {
        		if (selection.length > 0) {
        			addQuestionsButton.removeClass('disabled');
        		} else {
        			addQuestionsButton.addClass('disabled');
        		}
        	});
        	
        	lessonQuestions.addSelectionChangeCallback(
        			/**@type {function(Array.<string>)}*/function(selection) {
        		if (selection.length > 0) {
        			moveQuestionUpButton.removeClass('disabled');
        			moveQuestionDownButton.removeClass('disabled');
        		} else {
        			moveQuestionUpButton.addClass('disabled');
        			moveQuestionDownButton.addClass('disabled');
        		}
        	});
        	
//        	addQuestionsButton.popover({title:"Add selected questions to the lesson"});
//        	removeQuestionsButton.popover({title:"Add questions", content:"Remove selected questions to the lesson"});
        });
    };
    
    /**
     * @private
     * @param {Array.<cursoconducir.Question>} allQuestions
     * @param {Array.<string>} lessonQuestionIds
     * @param {Array.<string>} selectedIds
     * @return {Array.<cursoconducir.Question>}
     */
    var moveUp = function(allQuestions, lessonQuestionIds, selectedIds) {
    	var newQuestionOrder = /** @type {Array.<cursoconducir.Question>}*/[];
    	var minIndex = 0;
    	goog.array.forEach(lessonQuestionIds, 
    			/**@type {function(string, number)}*/function(id, index) {
    		/** @type {?cursoconducir.Question}*/
    		var question  = cursoconducir.utils.findQuestionById(allQuestions, id);
    		if (goog.array.contains(selectedIds, id)) {
    			if (minIndex < index) {
    				minIndex = index -1;
        			goog.array.insertAt(newQuestionOrder, question, minIndex);
    			} else {
    				goog.array.insert(newQuestionOrder, question);
    				minIndex = index + 1;
    			}
    		} else {
    			goog.array.insert(newQuestionOrder, question);
    		}
    	});
    	
    	return newQuestionOrder;
    };
    
    /**
     * @private
     * @param {Array.<cursoconducir.Question>} allQuestions
     * @param {Array.<string>} lessonQuestionIds
     * @param {Array.<string>} selectedIds
     * @return {Array.<cursoconducir.Question>}
     */
    var moveDown = function(allQuestions, lessonQuestionIds, selectedIds) {
    	var newQuestionOrder = /** @type {Array.<cursoconducir.Question>}*/[];
    	var maxIndex = lessonQuestionIds.length - 1 ;
    	goog.array.forEachRight(lessonQuestionIds, 
    			/**@type {function(string, number)}*/function(id, index) {
    		/** @type {?cursoconducir.Question}*/
    		var question  = cursoconducir.utils.findQuestionById(allQuestions, id);
    		if (goog.array.contains(selectedIds, id)) {
    			if (maxIndex > index) {
    				maxIndex = index + 1;
    				goog.array.insertAt(newQuestionOrder, question, maxIndex);
    			} else {
    				goog.array.insertAt(newQuestionOrder, question, 0);
    				maxIndex = index -1;
    			}
    		} else {
    			goog.array.insertAt(newQuestionOrder, question, 0);
    		}
    	});
    	
    	return newQuestionOrder;
    };
    
    /**
     * @private
     * @param {cursoconducir.admin.lessons.Model} model
     * @param {Array.<cursoconducir.Question>} questions
     */
    var updateQuestionPanels = function(model, questions) {
    	/** @type {{lessonQuestions: Array.<cursoconducir.Question>, allOtherQuestions: Array.<cursoconducir.Question>}} */
    	var questionsSplit = splitQuestions(model, questions);
    	lessonQuestions.show({entities:questionsSplit.lessonQuestions, emptyLabel:'No questions'});
    	allQuestions.show({entities:questionsSplit.allOtherQuestions, emptyLabel:'No questions'});
    };
    
    /**
     * @param {cursoconducir.admin.lessons.Model} model
     * @param {Array.<cursoconducir.Question>} questions
     * @return {{lessonQuestions: Array.<cursoconducir.Question>, allOtherQuestions: Array.<cursoconducir.Question>}} 
     */
    var splitQuestions = function(model, questions) {
    	/** @type {Array.<cursoconducir.Question>}*/
    	var lessonQuestions = [];
    	/** @type {Array.<cursoconducir.Question>}*/
    	var allOtherQuestions = [];
    	
    	goog.array.insertArrayAt(allOtherQuestions, questions);
    	if (!goog.isDefAndNotNull(model.activeLesson.questionIds)) {
    		model.activeLesson.questionIds = [];
    	}
		goog.array.forEach(model.activeLesson.questionIds, function(id) {
			/** @type {?cursoconducir.Question}*/
			var questionById = cursoconducir.utils.findQuestionById(questions, id);
	    	goog.array.insert(lessonQuestions, questionById);
	    	goog.array.remove(allOtherQuestions, questionById);
		});
    	
    	return {lessonQuestions: lessonQuestions, allOtherQuestions: allOtherQuestions};
    };
    
    /**
     * @public
     * @return {?cursoconducir.Lesson}
     */
    this.getLesson = function() {
    	/** @type {?string}*/
    	var id = $('input[type=hidden][name=lessonId]').val().toString();
    	if (!id || id == "null" || id == "undefined") {
    		id = null;
    	}
    	return {
			id: id,
			title: $('input[type=text][name=lessonTitle]').val().toString(),
			description: $("textarea[name=lessonDescription]").val().toString(),
			questionIds: lessonQuestions.getEntityIds()
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