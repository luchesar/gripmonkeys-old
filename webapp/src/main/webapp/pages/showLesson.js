goog.provide('cursoconducir.index.ShowLesson');

goog.require('cursoconducir.indexpage.template');
goog.require('jquery');
goog.require('cursoconducir.TestPreviewModule');
goog.require('goog.array');
/**
 * @constructor
 * @param {Object} container
 */
cursoconducir.index.ShowLesson = function(container) {
	this.show = function(lesson, questions) {
		var explanationHtml = cursoconducir.indexpage.template.explanation(lesson);
		container.empty();
		container.append(explanationHtml);
		
		goog.array.forEach(questions, function(question, index) {
			var testPreviewModule = new cursoconducir.TestPreviewModule(container);
			var	convertedQuestion = cursoconducir.utils.decode(question);
			testPreviewModule.add({activeTest:convertedQuestion, title: index + 1});
		});
		
	};
};