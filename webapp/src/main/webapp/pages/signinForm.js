goog.provide('cursoconducir.SigninForm');

goog.require('cursoconducir.template.signin');
goog.require('goog.array');
/**
 * @constructor
 * @param {jQuery} parentContainer
 */
cursoconducir.SigninForm = function(parentContainer) {
	/**
	 * @public 
	 * @returns {jQuery}
	 */
	this.show = function() {
		parentContainer.html(cursoconducir.template.signin.template());
		
		return parentContainer.find('#signinForm');
	};
};