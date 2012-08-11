goog.provide('cursoconducir.index.Initial');

goog.require('goog.array');
goog.require('cursoconducir.indexpage.template');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestPreviewModule');

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.index.Initial = function(container, allTests) {
	/** @private */
	var TEST_NAVIGATION_LENGTH = 20;

	var initialHtml = cursoconducir.indexpage.template.initial();
	var testPreviewModule = null;

	this.show = function(activeTest) {
		container.html(initialHtml);
		testPreviewModule = new cursoconducir.TestPreviewModule(container
				.find('#testContainer'));
		if (!goog.isNull(activeTest) && activeTest != undefined) {
			testPreviewModule.show({
				activeTest : activeTest, allTests: null
			}, function(activeTest, answerIndex) {
				doAnswer(activeTest, answerIndex);
			});
		}
	};

	this.doPreview = function(testId) {
		hideExtras();
		var explanationHtml = cursoconducir.indexpage.template
				.explanation({
					title : 'Test Especiales',
					explanation : 'Las preguntas de los test especiales han sido seleccionadas entre todas las preguntas de'
							+ 'trafico por su dificultad . En un test normal de 30 preguntas de la dgt encontrara unas media de 5 preguntas'
							+ 'especiales como estas.'
				});
		$('#courceExplanationContainer').html(explanationHtml);

		$('#testContainer').empty();
		cursoconducir.utils.findOrFetchTest({
			allTests : allTests
		}, testId, function(test) {
			if (test == undefined) {
				return;
			}
			testPreviewModule.show({
				allTests : allTests,
				activeTest : test
			}, function(activeTest, answerIndex) {
				doAnswer(activeTest, answerIndex);
			});
			showNavigation(test);
		});
	};

	var doAnswer = function(activeTest, answerIndex) {
		$('#courceExplanationContainer').empty();
		$('#nextTestLinkContainer').addClass('hide');
		hideExtras();
		testPreviewModule.answer(answerIndex);
//		showGoToNextButton(activeTest, answerIndex);
		showNavigation(activeTest);
	};

	var hideExtras = function() {
		container.find('#headerHintContainer').addClass('hide');
		container.find('#addThisContainer').addClass('hide');
		container.find('#threeTutorialsContainer').addClass('hide');
		container.find('#nextTestLinkContainer').removeClass('hide');
		container.find('#courceExplanationContainer').removeClass('hide');
		testPreviewModule.hideGoToNextButton();
	};

	var showNavigation = function(activeTest) {
		container.find('#testNavigationContainer').empty();
		var convertedModel = convertModel(activeTest);
		var templateHtml = cursoconducir.indexpage.template
				.navigation(convertedModel);
		container.find('#testNavigationContainer').html(templateHtml);
	};

	var showGoToNextButton = function(activeTest) {
		var convertedModel = convertModel(activeTest);
		var goToNextUrl = "#preview?test=" + convertedModel.nextTestId
				+ "&hide";
		testPreviewModule.showGoToNextButton(goToNextUrl);
	};

	var convertModel = function(activeTest) {
		var truncatedModel = {
			allTests : null,
			activeTest : activeTest
		};
		var testArray = [];

		if (allTests && allTests.length > 0) {
			var activeTestIndex = cursoconducir.utils.findObjectIndexById(
					allTests, activeTest.id);
			if (allTests.length - 1 > activeTestIndex) {
				truncatedModel.nextTestId = allTests[activeTestIndex + 1].id;
				truncatedModel.hasNext = true;
			}
			for ( var i = 0; i < allTests.length
					&& i < TEST_NAVIGATION_LENGTH; i++) {
				var test = cursoconducir.utils.decode(allTests[i]);
				if (test.id == activeTest.id) {
					test.active = true;
				}
				testArray[i] = test;
			}
		}
		truncatedModel.allTests = testArray;

		return truncatedModel;
	};
};
