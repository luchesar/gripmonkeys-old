goog.provide('cursoconducir.index.LessonList');

goog.require('cursoconducir.lessonlist.template');
goog.require('goog.array');

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.index.LessonList = function(container) {
	/**
	 * @public
	 * @param {Array.<cursoconducir.Lesson>} allLessons
	 * @returns {jQuery}
	 */
	this.show = function(allLessons) {
		/** @type {string}*/
		var allLessonsHtml = cursoconducir.lessonlist.template.lessonList({
			allLessons : allLessons
		});
		container.empty();
		container.append(allLessonsHtml);
		/** @type {jQuery}*/
		var lessonListContainer = container.find('#lessonListContainer');
		return lessonListContainer;
	};
};