function TestPreviewModule(model, template, container) {
    var done = false;
    /** public */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
        done = false;
    };
    
    /** public*/
    this.answer = function(activeTest, answerIndex) {
        if (done) {
            return;
        }
        for (var i = 0; i < activeTest.possibleAnswers.length; i++) {
            if (activeTest.possibleAnswers[i].sel === true) {
                if (answerIndex === i) {
                    $('#answerLink' + answerIndex).addClass('success');
                } else {
                    $('#answerLink' + answerIndex).addClass('danger');
                }
                $('#answerText' + i).addClass('alert-message block-message success');
            } 
        }
        done = true;
    };
}