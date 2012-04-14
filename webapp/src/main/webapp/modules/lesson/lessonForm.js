goog.provide('cursoconducir.LessonForm');

goog.require('cursoconducir.template.lessonForm');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');

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
     * @public
     * @param {Object} model
     */
    this.show = function(model) { 
        var templateHtml = cursoconducir.template.lessonForm.template(model);
        container.html(templateHtml);
        
        lessonQuestions = new cursoconducir.AllTestsModule($('#lessonQuestions'));
        allQuestions = new cursoconducir.AllTestsModule($('#allQuestions'));
        
        cursoconducir.Question.getAll(function(questions){
        	allQuestions.show({allTests:questions});
        });
    };
    
    /**
     * @public
     * @return {cursoconducir.Lesson}
     */
    this.getLesson = function() {
    	return cursoconducir.Lesson.create({
			id: $('input[type=hidden][name=lessonId]').val(),
			title: $('input[type=text][name=lessonTitle]').val(),
			description: $("textarea[name=lessonDescription]").val(),
			questionIds: []
		});
    };
};