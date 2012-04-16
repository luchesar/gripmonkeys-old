goog.provide('cursoconducir.AllTestsModule');

goog.require('cursoconducir.template.allTests');
goog.require("goog.soy");
goog.require("goog.array");

/**
 * @constructor
 * @param {Object}
 *            container
 */
cursoconducir.AllTestsModule = function(container) {
	var callbacks = [];

	/** public */
	this.show = function(model) {
		var theHtml = cursoconducir.template.allTests.template(model);
		container.html(theHtml);

		container.find("input[type=checkbox]").change(function() {
			var currentSellection = getQuestionsSelection();
			for ( var i = 0; i < callbacks.length; i++) {
				callbacks[i](currentSellection);
			}
		});
	};

	this.getSelection = function() {
		return getQuestionsSelection();
	};

	var getQuestionsSelection = function() {
		var selection = [];
		container.find("input[type=checkbox]").each(function() {
			if (this.checked) {
				goog.array.insert(selection, this.name);
			}
		});
		return selection;
	};

	this.addSelectionChangeCallback = function(callback) {
		goog.array.insert(callbacks, callback);
	};

	/**
	 * @public
	 * @returns {Array.<string>}
	 */
	this.getQuestionIds = function() {
		var selection = [];
		container.find("input[type=checkbox]").each(function() {
			goog.array.insert(selection, this.name);
		});
		return selection;
	}
};