function TestsPage(testsContainer, activeTestTemplate, allTestsTemplate) {
    /** @private */
    var CREATE = '#create';
    /** @private */
    var CANCEL = '#cancel';
    /** @private */
    var UPDATE = '#update';
    /** @private */
    var TEST_KEY = 'test';
    /** @private */
    var DELETE = '#delete';

    /** @private */
    var model = { allTests : null, activeTest : null };

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
        hideFeedback();
        if (!hash) {
            hash = window.location.hash;
        }
        if (hash == '' || hash == '#' || hash == CANCEL) {
            testsContainer.empty();
            model.activeTest = null;
            if (initAllTests(function() {
                allTestsModule.show(model, allTestsTemplate, testsContainer);
                updateButtons($('#buttonsInitialTemplate'));
            }))
                ;
        } else if (hash == CREATE) {
            testsContainer.empty();
            model.activeTest = createEmptyTest();
            testModule.show(model, activeTestTemplate, testsContainer);
            updateButtons($('#buttonsEditTestTemplate'));
        } else if (hash.indexOf(UPDATE) == 0) {
            testsContainer.empty();
            var testId = $.getQueryString(TEST_KEY);
            findOrFetchTest(testId, function(test) {
                model.activeTest = test;
                testModule.show(model, activeTestTemplate, testsContainer);
                updateButtons($('#buttonsEditTestTemplate'));
            });
        } else if (hash.indexOf(DELETE) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            findOrFetchTest(testId, function(test) {
                if (confirmDelete(test)) {
                    doDelete(test.id);
                }
            });
        }
    };

    var initAllTests = function(onComplate) {
        if (model.allTests != null) {
            onComplate();
            return;
        }
        hideFeedback();
        $.ajax({
            type : "GET",
            url : '/test-storage?*',
            data : {},
            dataType : 'json',
            success : function(data, textStatus, jqXHR) {
                model.allTests = [];
                for ( var i = 0; i < data.length; i++) {
                    model.allTests[i] = decode(data[i]);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showFeedback('Cannot fetch all test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            }, complete : onComplate });
    };

    /** @private */
    var postToServer = function(templateTest, onSuccess) {
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
                        var testIndex = findTestIndexById(data.id);
                        if (!model.allTests) {
                            model.allTests = [];
                        }
                        if (testIndex < 0) {
                            testIndex = model.allTests.length;
                        }
                        model.allTests[testIndex] = decode(data);
                        window.location.hash = '#';
                    },
                    error : function(xhr, ajaxOptions, thrownError) {
                        showFeedback('the test did not get saved because server returned error \''
                                + xhr.status + ' ' + thrownError + '\'');
                    } });
    };

    var findOrFetchTest = function(testId, callback) {
        if (model.allTests) {
            var testIndex = findTestIndexById(testId);
            if (testIndex > -1) {
                callback(model.allTests[testIndex]);
                return;
            }
        }
        hideFeedback();
        $.ajax({
            type : "GET",
            url : '/test-storage?key=' + testId,
            data : {},
            dataType : 'json',
            success : function(test, textStatus, jqXHR) {
                if (test && test.length > 0) {
                    callback(decode(test[0]));
                } else {
                    showFeedback('No test found with id ' + testId);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showFeedback('Cannot fetch a test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            }, complete : callback() });
    };

    var doDelete = function(testId) {
        hideFeedback();
        $.ajax({
            type : "DELETE",
            url : '/test-storage?key=' + testId,
            data : {},
            dataType : 'json',
            success : function(wasDeleted, textStatus, jqXHR) {
                if (wasDeleted) {
                    var spliceIndex = findTestIndexById(testId);
                    model.allTests.splice(spliceIndex, 1);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showFeedback('Cannot delete a test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            }, complete : function() {
                testsContainer.empty();
                allTestsModule.show(model, allTestsTemplate, testsContainer);
                updateButtons($('#buttonsInitialTemplate'));
            } });
    };

    var findTestIndexById = function(testId) {
        if (model.allTests == undefined || model.allTests == null) {
            return - 1;
        }
        var allTestsLength = model.allTests.length;
        for ( var i = 0; i < allTestsLength; i++) {
            if (model.allTests[i].id == testId) {
                return i;
            }
        }
        return -1;
    };
    
    var removeTestById = function(testId) {
        if (model.allTests == undefined || model.allTests == null) {
            return;
        }
        if (model.allTests.length == 0) {
            return;
        }
        var allTestsLength = model.allTests.length;
        var deleteOffset = 0;
        for ( var i = 0; i < allTestsLength; i++) {
            if (model.allTests[i].id == testId) {
                deleteOffset = -1;
            } else {
                model.allTests[i + deleteOffset] = model.allTests[i];
            }
        }
        model.allTests[allTestsLength] = undefined;

    };

    /** @private */
    var createEmptyTest = function() {
        return {
            title : '',
            image : '/images/330x230.gif',
            description : '',
            possibleAnswers : [
                    { title : 'Answer 1', index : 0, text : '', sel : true },
                    { title : 'Answer 2', index : 1, text : '', sel : false },
                    { title : 'Answer 3', index : 2, text : '', sel : false } ],
            explanation : '' };
    };

    /** @private */
    var code = function(template) {
        var possibleAnswers = [];
        var correctAnswerIndex = 0;
        for ( var i = 0; i < template.possibleAnswers.length; i++) {
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
        for ( var i = 0; i < jsonObject.possibleAnswers.length; i++) {
            var visualIndex = i + 1;
            possibleAnswers[i] = { title : "Answer " + visualIndex, index : i,
                text : jsonObject.possibleAnswers[i],
                sel : i == jsonObject.correctAnswerIndex ? true : false };
        }
        return { id : jsonObject.id, title : jsonObject.title,
            image : jsonObject.image, description : jsonObject.description,
            possibleAnswers : possibleAnswers,
            explanation : jsonObject.explanation };
    };

    /** @private*/
    var confirmDelete = function(test) {
        return window.confirm("Are you sure you want to delete '" + test.title
                + "' ?");
        // var modalContainer = $('#confirmDeleteContainer');
        // modalContainer.empty();
        // $('#confirmDeleteTemplate').mustache(test).appendTo(modalContainer);
        // var modal = $('confirm-delete-modal');
        // modal.modal({ backdrop : false, keyboard : true }).show();
    };

    /** @private */
    var updateButtons = function(template) {
        var pageButtons = $('.pageButtons');
        pageButtons.empty();
        template.mustache(model).appendTo(pageButtons);
    };

    /** @private */
    var showFeedback = function(errorMessage) {
        var feedback = $('.feedback');
        feedback.empty();
        $('#feedbackTemplate').mustache({ errorMessage : errorMessage })
                .appendTo(feedback);
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