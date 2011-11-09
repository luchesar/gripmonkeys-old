function TestsPage(testsContainer, activeTestTemplate, allTestsTemplate) {
    /** @private */
    var CREATE = '#create';
    /** @private */
    var CANCEL = '#cancel';
    /** @private */
    var UPDATE = '#update';
    /** @private */
    var DO_UPDATE = '#doUpdate';

    /** @private */
    var model = {
        allTests : [
                {
                    title : "Test 1 title. This is test title",
                    description : "This test will be temporerale put here because I need testing info" },
                {
                    title : "Test 2 title. This is test title",
                    description : "This test will be temporerale put here because I need testing info" } ],
        activeTest : null };

    /** @private */
    var testModule = new TestModule();
    /** @private */
    var allTestsModule = new AllTestsModule();

    /** @private */
    var doHashChanged = function() {
        if (window.location.hash == '' || window.location.hash == CANCEL) {
            testsContainer.empty();
            model.activeTest = null;
            allTestsModule.show(model, allTestsTemplate, testsContainer);
        } else if (window.location.hash == CREATE) {
            testsContainer.empty();
            model.activeTest = { title : '', image : '', description : '' };
            testModule.show(model, activeTestTemplate, testsContainer);
        } else if (window.location.hash == DO_UPDATE) {
            if (!testModule.isValid()) {
                return;
            }
            var test = testModule.getTest();
            if (test && test.title) {
                model.allTests[model.allTests.length] = test;
            }
            testsContainer.empty();
            allTestsModule.show(model, allTestsTemplate, testsContainer);
        }
    };

    /** @public */
    this.start = function() {
        $(window).hashchange(function() {
            doHashChanged();
        });
        $(window).hashchange();
    };
}