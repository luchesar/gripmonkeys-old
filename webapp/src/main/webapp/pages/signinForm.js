goog.provide('cursoconducir.index.SigninForm');

goog.require('cursoconducir.template.signin');
goog.require('goog.array');
/**
 * @constructor
 * @param {jQuery} parentContainer
 */
cursoconducir.index.SigninForm = function(parentContainer) {
	/**
	 * @public 
	 * @returns {jQuery}
	 */
	this.show = function() {
		parentContainer.html(cursoconducir.template.signin.template());
		
		return parentContainer.find('#signinForm');
	};
};