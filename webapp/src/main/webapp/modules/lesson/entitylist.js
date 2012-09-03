goog.provide('cursoconducir.EntityList');

goog.require("cursoconducir.TitledEntity");
goog.require('cursoconducir.template.entitylist');
goog.require("goog.array");

/**
 * @typedef {{entities:Array.<cursoconducir.TitledEntity>, emptyLabel:?string}}
 */
cursoconducir.EntityList.model;

/**
 * @constructor
 * @param {jQuery} container
 * @param {string=} emptyLabel
 */
cursoconducir.EntityList = function(container) {
	/** @type {Array.<function(Array.<string>)>}*/
	var callbacks = [];
	
	/** @type {Array.<function(Array.<number>)>}*/
	var linkClickCallbacks = [];
	
	/** 
	 * @public
	 * @param {cursoconducir.EntityList.model} model 
	 */
	this.show = function(model) {
		/** @type {string}*/
		var theHtml = cursoconducir.template.entitylist.content(model);
		container.html(theHtml);
		
		container.find("input[type=checkbox]").each(function() {
			$(this).change(function() {
				var currentSellection = getLessonSelection();
				for (var i = 0; i < callbacks.length; i ++) {
					callbacks[i](currentSellection);
				}
			});
		});
		
		container.find("a").each(function() {
			$(this).click(function() {
				/** @type {number}*/
				var clickId = /** @type {number}*/this.id.substring(15, this.id.length);
				for (var i = 0; i < linkClickCallbacks.length; i ++) {
					linkClickCallbacks[i](clickId);
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
	
	/** 
	 * @public
	 * @param {function(Array.<number>)} callback
	 */
	this.addLinkCallback = function(callback) {
		goog.array.insert(linkClickCallbacks, callback);
	};
};