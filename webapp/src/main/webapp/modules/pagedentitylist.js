goog.provide('cursoconducir.PagedEntityList');

goog.require('cursoconducir.template.pagedentitylist');
goog.require('cursoconducir.TitledEntityStorageClient');
goog.require('goog.array');

/**
 * @public
 * @constructor
 * @param {cursoconducir.TitledEntityStorageClient} storage
 * @param {jQuery} parent
 * @param {number=} pageSize
 * @param {jQuery=} feedbackContainer
 */
cursoconducir.PagedEntityList = function(parent, storage, pageSize, feedbackContainer) {
	this.parent_ = parent;
	this.storage_ = storage;
	if (goog.isDefAndNotNull(pageSize)) {
		this.model_.pageSize = pageSize;
	}
	this.model_.id = goog.getUid(this).toString();
};

/**
 * @typedef {{id:string, pageSize:number, currentPage:number, pages:Array.<cursoconducir.PagedEntityList.model.page>}}
 */
cursoconducir.PagedEntityList.model = {};

/**
 * @typedef {{active:boolean, title:string}}
 */
cursoconducir.PagedEntityList.model.page ;

/**
 * @private
 * @type {cursoconducir.PagedEntityList.model}
 */
cursoconducir.PagedEntityList.prototype.model_ = {id:'', currentPage:0, pageSize:20, pages:[]};

/**
 * @private
 * @type {jQuery}
 */
cursoconducir.PagedEntityList.prototype.parent_;

/**
 * @private
 * @type {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.PagedEntityList.prototype.storage_;

/**
 * @public
 */
cursoconducir.PagedEntityList.prototype.show = function() {
	var model = this.model_;
	var storage = this.storage_;
	var that = this;
	this.storage_.count(false, 
			/** @type {cursoconducir.TitledEntity.onCountSuccess}*/
			function(count){
				/** @type {number}*/
				var numPages = count / model.pageSize;
				model.pages = [];
				numPages = Math.min(numPages, 10);
				for (/** @type {number}*/var i = 0; i < numPages; i++) {
					/** @type {boolean}*/
					var isActive = model.currentPage == i;
					goog.array.insert(model.pages, {active: isActive, name:/** @type {string}*/i});
				}
				/** @type {string}*/
			    var templateHtml = cursoconducir.template.pagedentitylist.content(model);
			    that.parent_.html(templateHtml);
					
				storage.getPaged(model.currentPage * model.pageSize,
					   model.currentPage, 
					   /** @type {cursoconducir.TitledEntity.onSuccess}*/
					   function(entities) {
							
					   }, undefined);
				
			}, undefined);
};