function TestsPage(testsContainer, activeTestTemplate, allTestsTemplate,
        previewTestTemplate) {
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
    var EDIT = '#edit';
    /** @private */
    var PREVIEW = '#preview';

    /** @private */
    var model = { allTests : null, activeTest : null };

    /** @private */
    var testModule = new TestModule();
    /** @private */
    var allTestsModule = new AllTestsModule();

    /** @private */
    var testPreviewModule = new TestPreviewModule();

    this.testPreview = testPreviewModule;

    /** public */
    this.updateCurrentEditedTest = function() {
        if (!testModule.isValid()) {
            return;
        }
        var templateTest = testModule.getTest();
        postToServer(templateTest);
    };

    /** public */
    this.updateCurrentPreviewedTest = function() {
        postToServer(model.activeTest);
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
            model.activeTest = testModule.createEmptyTest();
            testModule.show(model, activeTestTemplate, testsContainer);
            updateButtons($('#buttonsEditTestTemplate'));
        } else if (hash.indexOf(UPDATE) == 0) {
            testsContainer.empty();
            var testId = $.getQueryString(TEST_KEY);
            if (model && model.activeTest && model.activeTest.id == testId) {
                testModule.show(model, activeTestTemplate, testsContainer);
                updateButtons($('#buttonsEditTestTemplate'));
            } else {
                findOrFetchTest(testId, function(test) {
                    model.activeTest = test;
                    testModule.show(model, activeTestTemplate, testsContainer);
                    updateButtons($('#buttonsEditTestTemplate'));
                });
            }
        } else if (hash.indexOf(PREVIEW) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            if (model && model.activeTest && model.activeTest.id == testId) {
                previewTest(testModule.getTest());
            } else {
                findOrFetchTest(testId, function(test) {
                    previewTest(test);
                });
            } 
        } else if (hash.indexOf(DELETE) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            findOrFetchTest(testId, function(test) {
                if (confirmDelete(test)) {
                    doDelete(test.id);
                }
            });
        } 
    };

    var previewTest = function(test) {
        testsContainer.empty();
        model.activeTest = test;
        testPreviewModule.show(model, previewTestTemplate, testsContainer);
        updateButtons($('#buttonsPreviewTestTemplate'));
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
            contentType : "application/json; charset=utf-8",
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
        $.ajax({
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
            return -1;
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

    this.editImage = function(imageElement) {
        testModule.editImage(imageElement);
    };

    this.answer = function(answerIndex) {
        testPreviewModule.answer(model.activeTest, answerIndex);
    };
}