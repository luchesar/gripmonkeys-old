function TestsPage(activeTestContainer, activeTestTemplate, allTestsContainer,
        allTestsTemplate) {
    this.activeTestContainer = activeTestContainer;
    this.activeTestTemplate = activeTestTemplate;
    this.allTestsContainer = allTestsContainer;
    this.allTestsTemplate = allTestsTemplate;

    this.model = { allTests : [], activeTest : null };
    var testModule = new TestModule(this.model, this.activeTestTemplate,
            this.activeTestContainer);
    var allTestsModule = new AllTestsModule(this.model, this.allTestsTemplate,
            this.allTestsContainer);

    this.start = function() {
        $(window).hashchange(function() {
            testModule.onHashChange();
            allTestsModule.onHashChange();
        });
        $(window).hashchange();
    };
}