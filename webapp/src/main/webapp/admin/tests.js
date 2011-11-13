function TestsPage(testsContainer, activeTestTemplate, allTestsTemplate) {
    /** @private */
    var CREATE = '#create';
    /** @private */
    var CANCEL = '#cancel';
    /** @private */
    var UPDATE = '#update';

    /** @private */
    var model = { allTests : null, allTestsIdToIndex : [], activeTest : null };

    /** @private */
    var testModule = new TestModule();
    /** @private */
    var allTestsModule = new AllTestsModule();

    /** public */
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
        if (hash == '' || hash == '#' || hash == CANCEL) {
            model.activeTest = null;
            testsContainer.empty();
            if (initAllTests()) {
                allTestsModule.show(model, allTestsTemplate, testsContainer);
                updateButtons($('#buttonsInitialTemplate'));
            }
        } else if (hash == CREATE) {
            testsContainer.empty();
            model.activeTest = createEmptyTest();
            testModule.show(model, activeTestTemplate, testsContainer);
            updateButtons($('#buttonsEditTestTemplate'));
        }
    };

    var initAllTests = function() {
        if (model.allTests != null) {
            return true;
        }
        hideFeedback();
        $.ajax({
            type : "GET",
            url : '/test-storage?*',
            data : {},
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                model.allTests = [];
                for (var i =0 ; i < data.length; i++) {
                    model.allTests[i] = decode(data[i]);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showFeedback('Cannot fetch all test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            },
            complete: function(jqXHR, textStatus) {
                allTestsModule.show(model, allTestsTemplate, testsContainer);
                updateButtons($('#buttonsInitialTemplate'));
            }
        });
        return false;
    };

    /** @private */
    var postToServer = function(templateTest) {
        hideFeedback();
        test = code(templateTest);
        jsonData = { json : JSON.stringify(test) };
        $
                .ajax({
                    type : "POST",
                    url : '/test-storage',
                    data : jsonData,
                    dataType : 'json',
                    success : function(data, textStatus, jqXHR) {
                        model.allTests[model.allTests.length] = decode(data);
                        window.location.hash = '#';
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        showFeedback('the test did not get saved because server returned error \''
                                + xhr.status + ' ' + thrownError + '\'');
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
        for (var i = 0; i < template.possibleAnswers.length; i++) {
            possibleAnswers[i] = template.possibleAnswers[i].text;
            if (template.possibleAnswers[i].sel) {
                correctAnswerIndex = i;
            }
        }
        return { id : template.id, title : template.title,
            image : template.image, description : template.description,
            possibleAnswers : possibleAnswers,
            correctAnswerIndex : correctAnswerIndex,
            explanation : template.explanation };
    };

    /** @private */
    var decode = function(jsonObject) {
        var possibleAnswers = [];
        for (var i = 0; i < jsonObject.possibleAnswers.length; i++) {
            possibleAnswers[i] = { title : "Answer " + i + 1, index : i + 1,
                sel : i == jsonObject.correctAnswerIndex ? true : false };
        }
        return { id : jsonObject.id, title : jsonObject.title,
            image : jsonObject.image, description : jsonObject.description,
            possibleAnswers : possibleAnswers,
            explanation : jsonObject.explanation };
    };

    /** @private */
    var updateButtons = function(template) {
        var pageButtons = $('.pageButtons');
        pageButtons.empty();
        template.mustache(model).appendTo(pageButtons);
    };

    /** @private */
    var showFeedback = function(string) {
        var feedback = $('.feedback');
        feedback.empty();
        $('#feedbackTemplate').mustache(model).appendTo(feedback);
        var feedbackContent = $('.testFeedbackContent');
        feedbackContent.html(string);
        feedback.removeClass('hide');
    };

    /** @private */
    var hideFeedback = function() {
        var feedback = $('.feedback');
        feedback.empty();
        feedback.addClass('hide');
    };

    /** @public */
    this.start = function() {
        $(window).hashchange(function() {
            doHashChanged();
        });
        $(window).hashchange();
    };
}