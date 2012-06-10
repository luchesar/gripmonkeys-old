goog.provide('cursoconducir.index.SigninForm');

goog.require('cursoconducir.template.signin');
goog.require('jquery');
goog.require('goog.array');
/**
 * @constructor
 * @param {Object} parentContainer
 */
cursoconducir.index.SigninForm = function(parentContainer) {
	this.show = function() {
		parentContainer.html(cursoconducir.template.signin.template());
		
		return parentContainer.find('#signinForm');
	};
};