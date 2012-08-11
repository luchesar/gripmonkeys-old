goog.provide('cursoconducir.index.ShowLesson');

goog.require('cursoconducir.indexpage.template');
goog.require('cursoconducir.TestPreviewModule');
goog.require('goog.array');
goog.require('cursoconducir.showlesson.template');
/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.index.ShowLesson = function(container) {
	/** @type {jQuery}*/
	var topContainer = null;
	/** @type {jQuery}*/
	var explanationContainer = null;
	/** @type {jQuery}*/
	var questionsContainer = null;
	/** @type {jQuery}*/
	var buttonsConatiner = null;
	/** @type {Array.<cursoconducir.TestPreviewModule>}*/
	var testPreviewModules = /** @type {Array.<cursoconducir.TestPreviewModule>}*/[];
	
	this.show = function(lesson, questions) {
		/** @type {string}*/
		var templateHtml = cursoconducir.showlesson.template.showLesson({lesson:lesson});
		container.html(templateHtml);
		
		topContainer = container.find('#lesson' + lesson.id);
		explanationContainer = topContainer.find('#explanationContainer');
		questionsContainer = topContainer.find('#questionsContainer');
		buttonsConatiner = topContainer.find('#buttonsConatiner');
		
		/** @type {jQuery}*/
		var submitAnswersButton = buttonsConatiner.find('#submitAnswersButton');
		submitAnswersButton.click(function() {
			/** @type {boolean}*/
			var isFilledIn = false;
			goog.array.forEach(testPreviewModules, function(testPreviewModule) {
				if (!goog.isNull(testPreviewModule.getMarkedIndex())) {
					isFilledIn = true;
				} else {
					isFilledIn = false;
				}
			}); 
			if (!isFilledIn) {
				window.alert("Conteste todas las preguntas por favor.");
			} else {
				goog.array.forEach(testPreviewModules, function(testPreviewModule) {
					testPreviewModule.answer(testPreviewModule.getMarkedIndex());
				}); 
			};
		});
		
		/** @type {string}*/
		var explanationHtml = cursoconducir.indexpage.template.explanation(lesson);
		explanationContainer.html(explanationHtml);
		
		goog.array.forEach(questions, function(question, index) {
			/** @type {cursoconducir.TestPreviewModule}*/
			var testPreviewModule = new cursoconducir.TestPreviewModule(questionsContainer);
			goog.array.insert(testPreviewModules, testPreviewModule);
			var	convertedQuestion = cursoconducir.utils.decode(question);
			testPreviewModule.add({allTests:null, activeTest:convertedQuestion, title: index + 1});
		});
		
	};
};