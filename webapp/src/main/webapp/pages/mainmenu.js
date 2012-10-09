goog.provide('cursoconducir.MainMenu');

goog.require('cursoconducir.mainmenu.template');

/**
 * @public
 * @constructor
 * @param {jQuery} parent
 */
cursoconducir.MainMenu = function(parent) {
	this.parent = parent;
	this.show();
};

/**
 * @private
 * @type {jQuery}
 */
cursoconducir.MainMenu.prototype.parent;

/**
 * @private
 * @type {jQuery}
 */
cursoconducir.MainMenu.prototype.menuItems;

/**
 * @private
 */
cursoconducir.MainMenu.prototype.show = function() {
	this.parent.html(cursoconducir.mainmenu.template.menu());
	this.menuItems = this.parent.find('#menuItems');
};

/**
 * @public
 */
cursoconducir.MainMenu.prototype.showIndexLinks = function() {
	this.menuItems.html(cursoconducir.mainmenu.template.indexLinks());
};

/**
 * @public
 */
cursoconducir.MainMenu.prototype.showAdminLinks = function() {
	this.menuItems.html(cursoconducir.mainmenu.template.adminLinks());
};