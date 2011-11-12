function TestsPage(testsContainer, activeTestTemplate, allTestsTemplate) {
    /** @private */
    var CREATE = '#create';
    /** @private */
    var CANCEL = '#cancel';
    /** @private */
    var UPDATE = '#update';

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
    
    /**public*/
    this.updateCurrentEditedTest = function() {
        if (!testModule.isValid()) {
            return;
        }
        var templateTest = testModule.getTest();
        postToServer(templateTest);
    };

    /** @private */
    var doHashChanged = function(hash) {
        if (!hash) {
            hash = window.location.hash;
        }
        if ( hash == '' || hash == '#' || hash == CANCEL) {
            testsContainer.empty();
            model.activeTest = null;
            allTestsModule.show(model, allTestsTemplate, testsContainer);
            updateButtons($('#buttonsInitialTemplate'));
        } else if (hash == CREATE) {
            testsContainer.empty();
            model.activeTest = createEmptyTest();
            testModule.show(model, activeTestTemplate, testsContainer);
            updateButtons($('#buttonsEditTestTemplate'));
        } 
    };

    /** @private */
    var postToServer = function(templateTest) {
        test = code(templateTest);
        jsonData = {json: JSON.stringify(test)};
        $.ajax({ type : "POST", url : '/test-storage', data : jsonData,
            dataType : 'json', success : function(msg) {
                alert("Data Saved: " + msg);
                model.allTests[model.allTests.length] = templateTest;
                doHashChanged('#');
            }, error : function(xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            } });
    };

    /** @private */
    var createEmptyTest = function() {
        return {
            title : '',
            image : '/images/330x230.gif',
            description : '',
            possibleAnswers : [
                    { title : 'Answer 1', index : 1, text : '', sel : true },
                    { title : 'Answer 2', index : 2, text : '' },
                    { title : 'Answer 3', index : 3, text : '' } ],
            explanation : '' };
    };

    /** @private */
    var code = function(template) {
        var possibleAnswers = [];
        var correctAnswerIndex = 0;
        for (i = 0; i < template.possibleAnswers.length; i++) {
            possibleAnswers[i] = template.possibleAnswers[i].text;
            if (template.possibleAnswers[i].sel) {
                correctAnswerIndex = i;
            }
        }
        return { title : template.title, image : template.image,
            description : template.description,
            possibleAnswers : possibleAnswers,
            correctAnswerIndex : correctAnswerIndex,
            explanation : template.explanation };
    };

    /** @private */
    var deCode = function(jsonObject) {
        var possibleAnswers = [];
        for (i = 0; i < jsonObject.possibleAnswers.length; i++) {
            possibleAnswers[i] = { title : "Answer " + i + 1, index : i + 1,
                sel : i == jsonObject.correctAnswerIndex ? true : false };
        }
        return { title : jsonObject.title, image : jsonObject.image,
            description : jsonObject.description,
            possibleAnswers : possibleAnswers,
            explanation : jsonObject.explanation };
    };
    
    /** @private */
    var updateButtons = function(template) {
       var pageButtons=$('.pageButtons');
       pageButtons.empty();
       template.mustache(model).appendTo(pageButtons);
    };

    /** @public */
    this.start = function() {
        $(window).hashchange(function() {
            doHashChanged();
        });
        $(window).hashchange();
    };
}