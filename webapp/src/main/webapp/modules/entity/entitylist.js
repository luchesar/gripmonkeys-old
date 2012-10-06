goog.provide('cursoconducir.EntityList');

goog.require("cursoconducir.TitledEntity");
goog.require('cursoconducir.template.entitylist');
goog.require("goog.array");

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.EntityList = function(container) {
	/** @type {Array.<function(Array.<string>)>}*/
	var callbacks = [];
	
	/** @type {Array.<function(string)>}*/
	var linkClickCallbacks = [];
	
	/** @private
	 * @type {boolean}*/
	this.showImage = true;
	
	/** 
	 * @public
	 * @param {cursoconducir.EntityList.model} model 
	 */
	this.show = function(model) {
		model.showImage = this.showImage;
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
		container.find("[id='entitysInAList']").each(function() {
			$(this).hover(function() {
				$(this).addClass('selected');
			},
			function() {
//				$(this).removeClass('selected');
			});
		});
		container.find("a").each(function() {
			$(this).click(function() {
				/** @type {string}*/
				var clickId = /** @type {string}*/ 	$(this).attr('eId');
				for (var i = 0; i < linkClickCallbacks.length; i ++) {
					linkClickCallbacks[i](clickId);
				}
			});
		});
	};
	
	/** 
	 * @public
	 * @param {boolean} showImage
	 */
	this.setShowImage = function(showImage) {
		this.showImage = showImage;
	};

	/** 
	 * @public
	 * @return {Array.<string>}
	 */
	this.getSelection = function() {
		return getLessonSelection();
	};
	
	/**
	 * @public
	 * @param {Array.<string>} selection
	 */
	this.setSelection = function(selection) {
		container.find("input[type=checkbox]").removeAttr('checked');
		$(selection).each(function() {
			container.find("input[type=checkbox][name="+this+"]").attr('checked', 'true');
		});
	};
	
	/** 
	 * @private
	 * @return {Array.<string>}
	 */
	var getLessonSelection = function() {
		/** @type {Array.<string>}*/
		var selection = [];
		container.find("input[type=checkbox]").each(function() {
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
	 * @param {function(Array.<string>)} callback
	 */
	this.addLinkCallback = function(callback) {
		goog.array.insert(linkClickCallbacks, callback);
	};
	
	/**
	 * @public
	 * @returns {Array.<string>}
	 */
	this.getEntityIds = function() {
		/** @type {Array.<string>}*/
		var allIds = [];
		container.find("input[type=checkbox]").each(function() {
			goog.array.insert(allIds, this.name);
		});
		return allIds;
	};
};

/**
 * @typedef {{entities:Array.<cursoconducir.TitledEntity>, emptyLabel:?string}}
 */
cursoconducir.EntityList.model;