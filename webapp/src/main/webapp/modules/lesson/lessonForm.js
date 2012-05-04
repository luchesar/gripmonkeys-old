goog.provide('cursoconducir.LessonForm');

goog.require('cursoconducir.template.lessonForm');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');
goog.require("bootstrap.twipsy");
goog.require("bootstrap.popover");
goog.require("bootstrap.tooltip");
goog.require("goog.array");

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
     * @public
     * @param {Object} model
     */
    this.show = function(model) { 
        var templateHtml = cursoconducir.template.lessonForm.template(model);
        container.html(templateHtml);
        
        lessonQuestions = new cursoconducir.AllTestsModule($('#lessonQuestions'));
        allQuestions = new cursoconducir.AllTestsModule($('#allQuestions'));
        
        addQuestionsButton = container.find("#addQuestionsButton");
    	removeQuestionsButton = container.find("#removeQuestionsButton");
        
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
        			goog.array.remove(model.activeLesson.questionIds, parseInt(this));
        		});
        		updateQuestionPanels(model, questions);
        		removeQuestionsButton.addClass('disabled');
        		addQuestionsButton.addClass('disabled');
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
        	
//        	addQuestionsButton.popover({title:"Add selected questions to the lesson"});
//        	removeQuestionsButton.popover({title:"Add questions", content:"Remove selected questions to the lesson"});
        });
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
    	
    	$(questions).each(function() {
    		var questionId=this.id.toString();
			if (model.activeLesson && model.activeLesson.questionIds && 
					(goog.array.contains(model.activeLesson.questionIds, questionId) || 
							goog.array.contains(model.activeLesson.questionIds, this.id))) {
    			goog.array.insert(lessonQuestions, this);
    		} else {
    			goog.array.insert(allOtherQuestions, this);
    		}
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