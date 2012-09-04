goog.provide('cursoconducir.InitialIndex');

goog.require('goog.array');
goog.require('cursoconducir.indexpage.template');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestPreviewModule');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.QuestionClient');


/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.InitialIndex = function(container) {
	/**
	 * @private 
	 * @const
	 * @type {number}
	 * */
	var TEST_NAVIGATION_LENGTH = 20;

	/**
	 * @private
	 * @type {string}
	 */
	var initialHtml = cursoconducir.indexpage.template.initial();
	/**
	 * @private
	 * @type {cursoconducir.TestPreviewModule}
	 */
	var testPreviewModule = null;
	
	/**
	 * @private
	 * @type {cursoconducir.QuestionClient}
	 */
	var questionClient = new cursoconducir.QuestionClient();

	/**
	 * @public
	 * @param {?cursoconducir.Question} activeTest
	 */
	this.show = function(activeTest) {
		container.html(initialHtml);
		testPreviewModule = new cursoconducir.TestPreviewModule(container
				.find('#testContainer'));
		if (!goog.isNull(activeTest) && activeTest != undefined) {
			testPreviewModule.show(activeTest, 
			/** @type {function(?cursoconducir.Question, number)}*/
					function(activeTest, answerIndex) {
						doAnswer(activeTest, answerIndex);
					});
		}
	};

	/**
	 * @public
	 * @param {string} testId
	 */
	this.doPreview = function(testId) {
		hideExtras();
		/** @type {string}*/
		var explanationHtml = cursoconducir.indexpage.template
				.explanation({
					title : 'Test Especiales',
					explanation : 'Las preguntas de los test especiales han sido seleccionadas entre todas las preguntas de'
							+ 'trafico por su dificultad . En un test normal de 30 preguntas de la dgt encontrara unas media de 5 preguntas'
							+ 'especiales como estas.'
				});
		$('#courceExplanationContainer').html(explanationHtml);

		$('#testContainer').empty();
		questionClient.get([testId], 
				/** @type {cursoconducir.Question.onSuccess}*/
				function(tests) {
					if (tests == undefined) {
						return;
					}
					testPreviewModule.show(tests[0],doAnswer);
					showNavigation(tests[0]);
				});
	};

	/**
	 * @private
	 * @param {?cursoconducir.Question} activeTest
	 * @param {number} answerIndex
	 */
	var doAnswer = function(activeTest, answerIndex) {
		$('#courceExplanationContainer').empty();
		$('#nextTestLinkContainer').addClass('hide');
		hideExtras();
		testPreviewModule.answer(answerIndex);
//		showGoToNextButton(activeTest, answerIndex);
		showNavigation(activeTest);
	};

	/**
	 * @private
	 */
	var hideExtras = function() {
		container.find('#headerHintContainer').addClass('hide');
		container.find('#addThisContainer').addClass('hide');
		container.find('#threeTutorialsContainer').addClass('hide');
		container.find('#nextTestLinkContainer').removeClass('hide');
		container.find('#courceExplanationContainer').removeClass('hide');
		testPreviewModule.hideGoToNextButton();
	};
	
	/**
	 * @private
	 * @param {?cursoconducir.Question} activeTest
	 */
	var showNavigation = function(activeTest) {
		container.find('#testNavigationContainer').empty();
		/** @type {?cursoconducir.InitialIndex.convertedModel}*/
		var convertedModel = convertModel(activeTest);
		/** @type {string}*/
		var templateHtml = cursoconducir.indexpage.template
				.navigation(convertedModel);
		container.find('#testNavigationContainer').html(templateHtml);
	};
	
	/**
	 * @private
	 * @param {?cursoconducir.Question} activeTest
	 */
	var showGoToNextButton = function(activeTest) {
		var convertedModel = convertModel(activeTest);
		var goToNextUrl = "#preview?test=" + convertedModel.nextTestId
				+ "&hide";
		testPreviewModule.showGoToNextButton(goToNextUrl);
	};

	/**
	 * @private
	 * @param {?cursoconducir.Question} activeTest
	 * @return {?cursoconducir.InitialIndex.convertedModel}
	 */
	var convertModel = function(activeTest) {
		/** @type {?cursoconducir.InitialIndex.convertedModel}*/
		var truncatedModel = {
			allTests : /** @type {Array.<cursoconducir.Question>}*/null,
			activeTest : activeTest,
			nextTestId: null,
			hasNext: false
		};
		/** @type {Array.<cursoconducir.Question>}*/
		var testArray = /** @type {Array.<cursoconducir.Question>}*/[];

//		if (allTests && allTests.length > 0) {
//			/** @type {number}*/
//			var activeTestIndex = cursoconducir.utils.findObjectIndexById(
//					allTests, activeTest.id);
//			if (allTests.length - 1 > activeTestIndex) {
//				truncatedModel.nextTestId = allTests[activeTestIndex + 1].id;
//				truncatedModel.hasNext = true;
//			}
//			for ( var i = 0; i < allTests.length
//					&& i < TEST_NAVIGATION_LENGTH; i++) {
//				var test = cursoconducir.utils.decode(allTests[i]);
//				if (test.id == activeTest.id) {
//					test.active = true;
//				}
//				testArray[i] = test;
//			}
//		}
		truncatedModel.allTests = testArray;

		return truncatedModel;
	};
};

/**
 * @typedef {{allTests:Array.<?cursoconducir.Question>, activeTest:?cursoconducir.Question, nextTestId:?string, hasNext:boolean}}
 */
cursoconducir.InitialIndex.convertedModel;
