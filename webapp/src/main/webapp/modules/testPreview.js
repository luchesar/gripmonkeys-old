goog.provide('cursoconducir.TestPreviewModule');

goog.require('jquery.mustache');

cursoconducir.TestPreviewModule = function(model, template, container) {
    var done = false;
    /** public */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
        done = false;
    };
    
    /** public */
    this.showGoToNextButton = function(url) {
        $('#goToNextButtonContainer').removeClass('hide');
        $('#goToNextButton').attr('href', url);
    };
    
    /** public */
    this.hideGoToNextButton = function() {
        $('#goToNextButtonContainer').addClass('hide');
        $('#goToNextButton').attr('href', undefined);
    };
    
    /** public*/
    this.answer = function(activeTest, answerIndex) {
        if (done) {
            return;
        }
        $('#doTestHintContainer').addClass('hide');
        for (var i = 0; i < activeTest.possibleAnswers.length; i++) {
            if (activeTest.possibleAnswers[i].sel === true) {
                if (answerIndex === i) {
                    $('#correctAnswerContainer').removeClass('hide');
                    $('#answerLink' + answerIndex).addClass('success');
                } else {
                    $('#wrongAnswerContainer').removeClass('hide');
                    $('#answerLink' + answerIndex).addClass('danger');
                }
                $('#answerLink' + i).addClass('success');
            } 
        }
        
        $('#explanationContainer').addClass('span16');
        done = true;
    };
};