goog.provide('cursoconducir.index.LessonList');

goog.require('cursoconducir.lessonlist.template');
goog.require('jquery');
goog.require('goog.array');

/**
 * @constructor
 * @param {Object}
 *            container
 */
cursoconducir.index.LessonList = function(container) {
	this.show = function(allLessons) {
		var allLessonsHtml = cursoconducir.lessonlist.template.lessonList({
			allLessons : allLessons
		});
		container.empty();
		container.append(allLessonsHtml);
		var lessonListContainer = container.find('#lessonListContainer');
		return lessonListContainer;
	};
};