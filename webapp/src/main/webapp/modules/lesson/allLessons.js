goog.provide('cursoconducir.AllLessons');

goog.require("cursoconducir.Lesson");
goog.require('cursoconducir.template.allLessons');
goog.require("goog.soy");
goog.require("goog.array");

/**
 * @constructor
 * @param {Object} container
 */
cursoconducir.AllLessons = function(container) {
	var callbacks = [];
	
	/** 
	 * @public
	 * @param {Object} model 
	 */
	this.show = function(model) {
		var theHtml = cursoconducir.template.allLessons.template(model);
		container.html(theHtml);
		
		$("input[type=checkbox]").each(function() {
			$(this).change(function() {
				var currentSellection = getLessonSelection();
				for (var i = 0; i < callbacks.length; i ++) {
					callbacks[i](currentSellection);
				}
			});
		});
	};

	/** 
	 * @public
	 * @return {Array.<string>}
	 */
	this.getSelection = function() {
		return getLessonSelection();
	};
	
	/** 
	 * @private
	 * @return {Array.<string>}
	 */
	var getLessonSelection = function() {
		var selection = [];
		$("input[type=checkbox]").each(function() {
			if (this.checked) {
				goog.array.insert(selection, this.name);
			}
		});
		return selection;
	};

	/** 
	 * @public
	 * @param {function(Array.<string>)} callback
	 */
	this.addSelectionChangeCallback = function(callback) {
		goog.array.insert(callbacks, callback);
	};
};