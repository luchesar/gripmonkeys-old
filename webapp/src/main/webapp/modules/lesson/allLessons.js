goog.provide('cursoconducir.AllLessons');

goog.require("cursoconducir.Lesson");
goog.require('cursoconducir.template.allLessons');
goog.require("goog.soy");
goog.require("goog.array");
goog.require('cursoconducir.EntityList');
goog.require('cursoconducir.PagedEntityList');

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.AllLessons = function(container) {
	var callbacks = [];
	
	/** 
	 * @public
	 * @param {{allLessons:Array.<cursoconducir.Lesson>}} model 
	 */
	this.show = function(model) {
		/** @type {string}*/
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
				goog.array.insert(selection, this.name.toString());
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