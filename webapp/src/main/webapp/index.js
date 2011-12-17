function IndexPage(test) {
    var model = { allTests : null, activeTest : test, activeTestIndex: -1};
    
    /** @private*/
    var testPreviewModule = new TestPreviewModule();
    
    this.start = function(allTests) {
        model.allTests = allTests;
        if (model.allTests.length > 0) {
            model.activeTestIndex = 0;
            model.activeTest = decode(model.allTests[model.activeTestIndex]);
            
            testPreviewModule.show(model, $('#testPreviewTemplate'), $('#testContainer'));
        }
    };
    
    this.answer = function(answerIndex) {
        testPreviewModule.answer(model.activeTest, answerIndex);
    };
}