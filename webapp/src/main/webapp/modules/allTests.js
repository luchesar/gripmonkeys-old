goog.provide('cursoconducir.AllTestsModule');

goog.require('cursoconducir.template.allTests');
goog.require("jquery.mustache");
goog.require("goog.soy");
goog.require("goog.array");

cursoconducir.AllTestsModule = function(container) {
	var callbacks = [];
	
	/** public */
	this.show = function(model) {
		var theHtml = cursoconducir.template.allTests.template(model);
		container.html(theHtml);
		
		$("input[type=checkbox]").each(function() {
			$(this).change(function() {
				var currentSellection = getQuestionsSelection();
				for (var i = 0; i < callbacks.length; i ++) {
					callbacks[i](currentSellection);
				}
			});
		});
	};

	this.getSelection = function() {
		return getQuestionsSelection();
	};
	
	var getQuestionsSelection = function() {
		var selection = [];
		$("input[type=checkbox]").each(function() {
			if (this.checked) {
				goog.array.insert(selection, this.name);
			}
		});
		return selection;
	};

	this.addSelectionChangeCallback = function(callback) {
		goog.array.insert(callbacks, callback);
	};
};