goog.provide('cursoconducir.LessonForm');

goog.require('cursoconducir.template.lessonForm');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');
goog.require("bootstrap.twipsy");
goog.require("bootstrap.popover");
goog.require("bootstrap.tooltip");
goog.require("goog.array");
goog.require('cursoconducir.utils');

/**
 * @constructor
 * @param container
 */
cursoconducir.LessonForm = function(container) {
	this.container = container;
	
	/** 
	 * @private
	 * @type {cursoconducir.AllTestsModule}
	 */
	var lessonQuestions;
	
	/**
	 * @private
	 * @type {cursoconducir.AllTestsModule}
	 */
	var allQuestions;
	
	/**
	 * @private
	 */
	var addQuestionsButton;
	
	/**
	 * @private
	 */
	var removeQuestionsButton;
	
	/**
	 * @private
	 */
	var moveQuestionUpButton;
	
	/**
	 * @private
	 */
	var moveQuestionDownButton;
	
	/**
     * @public
     * @param {Object} model
     */
    this.show = function(model) {
        var templateHtml = cursoconducir.template.lessonForm.template(model);
        container.html(templateHtml);
        if (goog.isDefAndNotNull(model.activeLesson)) {
        	init(model);
    	}
    };
    
    var init = function(model) {
    	lessonQuestions = new cursoconducir.AllTestsModule($('#lessonQuestions'));
        allQuestions = new cursoconducir.AllTestsModule($('#allQuestions'));
        
        addQuestionsButton = container.find("#addQuestionsButton");
    	removeQuestionsButton = container.find("#removeQuestionsButton");
    	
    	moveQuestionUpButton = container.find("#moveQuestionUpButton");
    	moveQuestionDownButton = container.find("#moveQuestionDownButton");
        
        cursoconducir.Question.getAll(function(questions) {
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
				var selection = lessonQuestions.getSelection();
				var updatedLessonQuestions = moveUp(questions, lessonQuestions
						.getQuestionIds(), selection);

				lessonQuestions.show({
					allTests : updatedLessonQuestions
				});
				lessonQuestions.setSelection(selection);
			});
        	
        	moveQuestionDownButton.click(function() {
        		var selection = lessonQuestions.getSelection();
				var updatedLessonQuestions = moveDown(questions, lessonQuestions
						.getQuestionIds(), selection);

				lessonQuestions.show({
					allTests : updatedLessonQuestions
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
        	
        	allQuestions.addSelectionChangeCallback(function(selection) {
        		if (selection.length > 0) {
        			addQuestionsButton.removeClass('disabled');
        		} else {
        			addQuestionsButton.addClass('disabled');
        		}
        	});
        	
        	lessonQuestions.addSelectionChangeCallback(function(selection) {
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
    }
    
    var moveUp = function(allQuestions, lessonQuestionIds, selectedIds) {
    	var newQuestionOrder = [];
    	var minIndex = 0;
    	goog.array.forEach(lessonQuestionIds, function(id, index) {
    		var question  = cursoconducir.utils.findObjectById(allQuestions, id);
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
    
    var moveDown = function(allQuestions, lessonQuestionIds, selectedIds) {
    	var newQuestionOrder = [];
    	var maxIndex = lessonQuestionIds.length - 1 ;
    	goog.array.forEachRight(lessonQuestionIds, function(id, index) {
    		var question  = cursoconducir.utils.findObjectById(allQuestions, id);
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
    
    var updateQuestionPanels = function(model, questions) {
    	var questionsSplit = splitQuestions(model, questions);
    	lessonQuestions.show({allTests:questionsSplit.lessonQuestions});
    	allQuestions.show({allTests:questionsSplit.allOtherQuestions});
    }
    
    /**
     * @param {Array.<cursoconducir.Question>} questions
     * @return {Object} 
     */
    var splitQuestions = function(model, questions) {
    	/** @type {Array.<cursoconducir.Question>}*/
    	var lessonQuestions = [];
    	/** @type {Array.<cursoconducir.Question>}*/
    	var allOtherQuestions = [];
    	
    	goog.array.insertArrayAt(allOtherQuestions, questions);
		goog.array.forEach(model.activeLesson.questionIds, function(id) {
			var questionById = cursoconducir.utils.findObjectById(questions, id);
	    	goog.array.insert(lessonQuestions, questionById);
	    	goog.array.remove(allOtherQuestions, questionById);
		});
    	
    	return {lessonQuestions: lessonQuestions, allOtherQuestions: allOtherQuestions}
    };
    
    /**
     * @public
     * @return {cursoconducir.Lesson}
     */
    this.getLesson = function() {
    	var id = $('input[type=hidden][name=lessonId]').val();
    	if (!id || id == "null" || id == "undefined") {
    		id = null;
    	}
    	return cursoconducir.Lesson.create({
			id: id,
			title: $('input[type=text][name=lessonTitle]').val(),
			description: $("textarea[name=lessonDescription]").val(),
			questionIds: lessonQuestions.getQuestionIds()
		});
    };
    
    /**
     * @public
     * @return boolean
     */
    this.isValid = function() {
    	return true;
    };
};