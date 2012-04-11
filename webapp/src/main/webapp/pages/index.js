goog.provide('cursoconducir.IndexPage');
goog.provide('cursoconducir.index');

goog.require('jquery');
goog.require('hashchange');
goog.require('jquery.querystring');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestPreviewModule');
goog.require('bootstrap.modal');
goog.require('goog.net.Cookies');
goog.require('cursoconducir.indexpage.template');

/**
 * @param {string} allTestJson
 */
cursoconducir.index.init = function(allTestJson) {
    $(function() {
        var indexPage = new cursoconducir.IndexPage();
        indexPage.start(allTestJson);
        window._cursoConducirPage = indexPage;
        cursoconducir.index.showInConstruction();
    });
};

cursoconducir.index.showInConstruction = function() {
    var visitedCookie = "cursoconducirInConstruction";
    var cookies = new goog.net.Cookies(document); 
    if (!cookies.containsKey(visitedCookie) == "true") {
        $('#under-construction-modal').modal({ keyboard : true, backdrop : true, show : true });
        cookies.set(visitedCookie, "true", 864000);
    }
};

/**
 * @constructor
 */
cursoconducir.IndexPage = function() {
    var model = { allTests : null, activeTest : null, answerIndex : null };

    /** @private */
    var ANSWER = "answer";
    /** @private */
    var PREVIEW = "#preview";
    /** @private */
    var TEST_NAVIGATION_LENGTH = 20;
    /** @private */
    var TEST_KEY = "test";
    /** @private */
    var HIDE = "hide";

    /** @private */
    var testPreviewModule = new cursoconducir.TestPreviewModule($('#testContainer'));

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
                model.activeTest = cursoconducir.utils.decode(model.allTests[0]);
                testPreviewModule.show(model);
            }
            $("#footer").addClass("loaded");
        } else if (hash.indexOf(PREVIEW) == 0) {
            hideExtras();
            var testId = $.getQueryString(TEST_KEY);
            var answer = $.getQueryString(ANSWER);
            if (answer != undefined && model.activeTest && model.activeTest.id == testId) {
                testPreviewModule.answer(model.activeTest, model.answerIndex);
                return;
            }
            $('#testContainer').empty();
            model.activeTestIndex = testId;
            cursoconducir.utils.findOrFetchTest(model, testId, function(test) {
                if (test == undefined) {
                    return;
                }
                model.activeTest = test;
                testPreviewModule.show(model, $('#testPreviewTemplate'),
                        $('#testContainer'));
                if (answer != undefined) {
                    testPreviewModule.answer(model.activeTest, model.answerIndex);
                }
                showNavigation();
            });
        } else if (hash.indexOf(ANSWER) > -1) {
            $('#courceExplanationContainer').addClass('hide');
            $('#nextTestLinkContainer').addClass('hide');
            var hide = $.getQueryString(HIDE);
            if (hide != undefined) {
                hideExtras();
            } 
            testPreviewModule.answer(model.activeTest, model.answerIndex);
            showGoToNextButton();
        }
    };

    var hideExtras = function() {
        $('#headerHintContainer').addClass('hide');
        $('#addThisContainer').addClass('hide');
        $('#threeTutorialsContainer').addClass('hide');
        $('#nextTestLinkContainer').removeClass('hide');
        $('#courceExplanationContainer').removeClass('hide');
        testPreviewModule.hideGoToNextButton();
    };

    var showNavigation = function() {
        $('#testNavigationContainer').empty();
        var convertedModel = convertModel();
        var templateHtml = cursoconducir.indexpage.template.navigation(convertedModel);
        $('#testNavigationContainer').html(templateHtml);
    };
    
    var showGoToNextButton = function() {
        var convertedModel = convertModel();
        var goToNextUrl = "#preview?test=" + convertedModel.nextTestId + "&hide";
        testPreviewModule.showGoToNextButton(goToNextUrl);
    };

    var convertModel = function() {
        var truncatedModel = { allTests : null, activeTest : model.activeTest,
            answerIndex : model.answerIndex };
        var testArray = [];

        if (model.allTests && model.allTests.length > 0) {
            var activeTestIndex = cursoconducir.utils.findTestIndexById(model, model.activeTest.id);
            if (model.allTests.length - 1 > activeTestIndex) {
                truncatedModel.nextTestId = model.allTests[activeTestIndex + 1].id;
                truncatedModel.hasNext = true;
            }
            for ( var i = 0; i < model.allTests.length; i++) {
                var test = cursoconducir.utils.decode(model.allTests[i]);
                if (test.id == model.activeTest.id) {
                    test.active = true;
                }
                testArray[i] = test;
            }
        }
        truncatedModel.allTests = testArray;

        return truncatedModel;
    };

    this.answer = function(answerIndex) {
        model.answerIndex = answerIndex;
        if (window.location.hash.indexOf(PREVIEW) > -1) {
            window.location.hash = window.location.hash + "&" + ANSWER;
        } else {
            window.location.hash = "#" + ANSWER;
        }
    };
}