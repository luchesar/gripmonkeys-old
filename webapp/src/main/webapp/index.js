function IndexPage(test) {
    var model = { allTests : null, activeTest : test, activeTestIndex : -1, answerIndex: null };
    
    /** @private*/
    var ANSWER = "#answer";
    
    /** @private */
    var testPreviewModule = new TestPreviewModule();

    this.start = function(allTests) {
        model.allTests = allTests;
        $(window).hashchange(function() {
            doHashChanged();
        });
        $(window).hashchange();
    };

    /** @private */
    var doHashChanged = function(hash) {
        if (!hash) {
            hash = window.location.hash;
        }
        if (hash == '' || hash == '#') {
            $('#testContainer').empty();
            $('#headerHintContainer').removeClass('hide');
            $('#addThisContainer').removeClass('hide');
            $('#threeTutorialsContainer').removeClass('hide');
            $('#nextTestLinkContainer').addClass('hide');
            if (model.allTests.length > 0) {
                model.activeTestIndex = 0;
                model.activeTest = decode(model.allTests[model.activeTestIndex]);
                testPreviewModule.show(model, $('#testPreviewTemplate'),
                        $('#testContainer'));
            }
        } else if (hash == ANSWER) {
            $('#headerHintContainer').addClass('hide');
            $('#addThisContainer').addClass('hide');
            $('#threeTutorialsContainer').addClass('hide');
            $('#nextTestLinkContainer').removeClass('hide');
            testPreviewModule.answer(model.activeTest, model.answerIndex);
        }
    };

    this.answer = function(answerIndex) {
        model.answerIndex = answerIndex;
        window.location.hash = ANSWER;
    };
}