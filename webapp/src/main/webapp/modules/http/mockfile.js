goog.provide('cursoconducir.MockFile');

/**
 * @public
 * @constructor
 * @param {string} name
 * @param {string} type
 * @param {number} size
 */
cursoconducir.MockFile = function(name, type, size) {
	this.name = name;
	this.type = type;
	this.size = size;
};

/**
 * @public
 * @type {string}
 */
cursoconducir.MockFile.prototype.name;

/**
 * @public
 * @type {string}
 */
cursoconducir.MockFile.prototype.type;

/**
 * @public
 * @type {number}
 */
cursoconducir.MockFile.prototype.size;