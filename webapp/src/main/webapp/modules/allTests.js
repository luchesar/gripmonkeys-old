goog.provide('cursoconducir.AllTestsModule');

goog.require('cursoconducir.template.allTests');
goog.require("goog.soy");
goog.require("goog.array");
goog.require("cursoconducir.admin.tests.Model");

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.AllTestsModule = function(container) {
	/**
	 * @private
	 * @type {Array.<function(Array.<string>)>}
	 */
	var callbacks = /** @type {Array.<function(Array.<string>)>}*/[];

	/**@public 
	 * @param {cursoconducir.admin.tests.Model} model*/
	this.show = function(model) {
		/** @type {string}*/
		var theHtml = cursoconducir.template.allTests.template(model);
		container.html(theHtml);

		container.find("input[type=checkbox]").change(function() {
			/** @type {Array.<string>}*/
			var currentSellection = getQuestionsSelection();
			for ( var i = 0; i < callbacks.length; i++) {
				callbacks[i](currentSellection);
			}
		});
	};

	/**
	 * @public
	 * @returns {Array.<string>}
	 */
	this.getSelection = function() {
		return getQuestionsSelection();
	};
	
	/**
	 * @public
	 * @param {Array.<string>} selection
	 */
	this.setSelection = function(selection) {
		container.find("input[type=checkbox]").attr('checked', 'false');
		$(selection).each(function() {
			container.find("input[type=checkbox][name="+this+"]").attr('checked', 'true');
		});
	};

	/**
	 * @private
	 * @return {Array.<string>}
	 */
	var getQuestionsSelection = function() {
		/** @type {Array.<string>}*/
		var selection = [];
		container.find("input[type=checkbox]").each(function() {
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

	/**
	 * @public
	 * @returns {Array.<string>}
	 */
	this.getQuestionIds = function() {
		/** @type {Array.<string>}*/
		var selection = [];
		container.find("input[type=checkbox]").each(function() {
			goog.array.insert(selection, this.name);
		});
		return selection;
	};
};