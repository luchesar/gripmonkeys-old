 goog.provide('cursoconducir.admin.TestsPage');
goog.provide('cursoconducir.admin.tests');

goog.require('hashchange');
goog.require('jquery.querystring');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestModule');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.TestPreviewModule');
goog.require('goog.net.Cookies');
goog.require('cursoconducir.template.tests.buttons');
goog.require('cursoconducir.Question');

cursoconducir.admin.tests.init = function() {
    var testPage;
    $(function() {
        cursoconducir.Question.create({});
        var contanier = $('#container');
        testPage = new cursoconducir.admin.TestsPage(contanier);
        testPage.start();
        window._cursoConducirPage = testPage;
    });
};

cursoconducir.admin.TestsPage = function(testsContainer, previewTestTemplate) {
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
    var PUBLISH = '#publish';
    /** @private */
    var UNPUBLISH = '#unpublish';

    /** @private */
    var model = { allTests : null, activeTest : null };

    /** @private */
    var testModule = new cursoconducir.TestModule(testsContainer);
    /** @private */
    var allTestsModule = new cursoconducir.AllTestsModule(testsContainer);

    /** @private */
    var testPreviewModule = new cursoconducir.TestPreviewModule(testsContainer);

    this.testPreview = testPreviewModule;

    /** public */
    this.updateCurrentEditedTest = function() {
        if (!testModule.isValid()) {
            return;
        }
        var templateTest = testModule.getTest();
        postToServer(templateTest, postToServerDefaultSuccess);
    };

    /** public */
    this.updateCurrentPreviewedTest = function() {
        postToServer(model.activeTest, postToServerDefaultSuccess);
    };

    /** @private */
    var doHashChanged = function(hash) {
        hideFeedback();
        if (!hash) {
            hash = window.location.hash;
        }
        if (hash == '' || hash == '#' || hash == CANCEL) {
            model.activeTest = null;
            if (initAllTests(function() {
                allTestsModule.show(model);
                updateButtons(cursoconducir.template.tests.buttons.initial);
                $("#footer").addClass("loaded");
            }))
                ;
        } else if (hash == CREATE) {
            model.activeTest = testModule.createEmptyTest();
            testModule.show(model);
            updateButtons(cursoconducir.template.tests.buttons.edit);
        } else if (hash.indexOf(UPDATE) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            if ((model && model.activeTest && model.activeTest.id == testId)
                    || testId == undefined || testId == "") {
                testModule.show(model);
                updateButtons(cursoconducir.template.tests.buttons.edit);
            } else {
                cursoconducir.utils.findOrFetchTest(model, testId, function(
                        test) {
                    model.activeTest = test;
                    testModule.show(model);
                    updateButtons(cursoconducir.template.tests.buttons.edit);
                }, hideFeedback, showFeedback);
            }
        } else if (hash.indexOf(PREVIEW) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            if ((model && model.activeTest && model.activeTest.id == testId)
                    || testId == undefined || testId == "") {
                previewTest(testModule.getTest());
                $("#footer").addClass("loaded");
            } else {
                cursoconducir.utils.findOrFetchTest(model, testId, function(
                        test) {
                    previewTest(test);
                    $("#footer").addClass("loaded");
                }, hideFeedback, showFeedback);
            }
        } else if (hash.indexOf(DELETE) == 0) {
            var testId = $.getQueryString(TEST_KEY);
            cursoconducir.utils.findOrFetchTest(model, testId, function(test) {
                if (confirmDelete(test)) {
                    doDelete(test.id);
                }
            }, hideFeedback, showFeedback);
        } else if (hash.indexOf(PUBLISH) == 0) {
            publish(true);
        } else if (hash.indexOf(UNPUBLISH) == 0) {
            publish(false);
        }
    };

    var publish = function(published) {
        var testId = $.getQueryString(TEST_KEY);
        initAllTests(function() {
            cursoconducir.utils
                    .findOrFetchTest(
                            model,
                            testId,
                            function(test) {
                                test.published = published;
                                var testIndex = cursoconducir.utils
                                        .findTestIndexById(model, test.id);
                                model.allTests[testIndex] = cursoconducir.utils
                                        .code(test);
                                postToServer(
                                        test,
                                        function() {
                                            allTestsModule.show(model);
                                            updateButtons(cursoconducir.template.tests.buttons.initial);
                                        });
                            }, hideFeedback, showFeedback);
        });
    };

    var previewTest = function(test) {
        model.activeTest = test;
        testPreviewModule.show(model);
        updateButtons(cursoconducir.template.tests.buttons.preview);
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
                    model.allTests[i] = cursoconducir.utils.decode(data[i]);
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
        test = cursoconducir.utils.code(templateTest);
        jsonData = { json : JSON.stringify(test) };
        $
                .ajax({
                    type : "POST",
                    url : '/test-storage',
                    data : jsonData,
                    dataType : 'json',
                    success : onSuccess,
                    error : function(xhr, ajaxOptions, thrownError) {
                        showFeedback('the test did not get saved because server returned error \''
                                + xhr.status + ' ' + thrownError + '\'');
                    } });
    };

    var postToServerDefaultSuccess = function(data, textStatus, jqXHR) {
        var testIndex = cursoconducir.utils.findTestIndexById(model, data.id);
        if (!model.allTests) {
            model.allTests = [];
        }
        if (testIndex < 0) {
            testIndex = model.allTests.length;
        }
        model.allTests[testIndex] = cursoconducir.utils.decode(data);
        window.location.hash = '#';
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
                    var spliceIndex = cursoconducir.utils.findTestIndexById(
                            model, testId);
                    model.allTests.splice(spliceIndex, 1);
                }
            },
            error : function(xhr, ajaxOptions, thrownError) {
                showFeedback('Cannot delete a test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            }, complete : function() {
                testsContainer.empty();
                allTestsModule.show(model);
                updateButtons(cursoconducir.template.tests.buttons.initial);
            } });
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
        var templateHtml = template(model);
        pageButtons.html(templateHtml);
    };

    /** @private */
    var showFeedback = function(errorMessage) {
        var feedback = $('.feedback');
        var templateHtml = cursoconducir.template.tests.buttons
                .feedback({ errorMessage : errorMessage });
        feedback.html(templateHtml);
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