goog.provide('cursoconducir.MockTitledEntityStorageClient');

goog.require('cursoconducir.TitledEntityStorageClient');

/**
 * @public
 * @constructor 
 * @extends {cursoconducir.TitledEntityStorageClient}
 * @param {Array.<cursoconducir.TitledEntity>} allEntities
 */
cursoconducir.MockTitledEntityStorageClient = function(allEntities) {
	if (goog.isDefAndNotNull(allEntities)) {
		this.allEntities_ = allEntities;
	} else {
		this.allEntities_ = [];
	}
};

goog.inherits(cursoconducir.MockTitledEntityStorageClient, cursoconducir.TitledEntityStorageClient);

/**
 * @private
 * @type {Array.<cursoconducir.TitledEntity>}
 */
cursoconducir.MockTitledEntityStorageClient.prototype.allEntities_;

/**
 * @public
 * @param {Array.<cursoconducir.TitledEntity>} allEntities
 */
cursoconducir.MockTitledEntityStorageClient.prototype.setEntities = function(allEntities) {
	this.allEntities_ = allEntities;
};

/**
 * @inheritDoc
 */ 
cursoconducir.MockTitledEntityStorageClient.prototype.getAll = function(success, error, complete) {
	success(this.allEntities_);
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.getPaged = function(offset, length, success, error, complete) {
	/**@type {Array.<cursoconducir.TitledEntity>}*/ var  paged = [];
	for (var i = offset; i < Math.min(this.allEntities_.length,offset + length); i++) {
		goog.array.insert(paged, this.allEntities_[i]);
	}
	success(paged);
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.get = function(ids, success, error, complete) {
	/**@type {Array.<cursoconducir.TitledEntity>}*/ var  foundLessons = [];
	$(this.allEntities_).each(function() {
		if (goog.array.contains(ids, this.id)) {
			goog.array.insert(foundLessons, this);
		}
	});
	success(foundLessons);
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.count = function(publishedOnly, success, error, complete) {
	/** @type {number}*/
	var count = this.allEntities_.length;
	if (publishedOnly) {
		count = 0;
		$(this.allEntities_).each(function() {
			if (this.isPublished) {
				count ++;
			}
		});
	}
	
	success(count);
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.store = function(questions, success, error, complete) {
	$(this.allEntities_).each(function() {
		if (!this.id) {
			this.id = Math.random();
		}
		var foundEntity = cursoconducir.utils.findObjectById(this.allEntities_, this.id);
		if (foundEntity) {
			goog.array.remove(this.allEntities_, this);
		} 
		goog.array.insert(this.allEntities_, this);
	});
	success(this.allEntities_);
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.del = function(questionIds, success, error, complete) {
	/**@type {Array.<cursoconducir.TitledEntity>}*/ var  newEntities = [];
	$(this.allEntities_).each(function() {
		if (!goog.array.contains(ids, this.id)) {
			goog.array.insert(newEntities, this);
		}
	});
	lessons = newEntities;
	success();
	complete();
};
