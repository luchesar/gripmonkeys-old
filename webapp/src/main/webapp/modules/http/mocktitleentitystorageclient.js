goog.provide('cursoconducir.MockTitledEntityStorageClient');
goog.provide('cursoconducir.titledentityassert');

goog.require('cursoconducir.TitledEntityStorageClient');
goog.require('cursoconducir.MockXmlHttpRequest');
goog.require('goog.string');

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
 * @public
 * @type {Array.<cursoconducir.TitledEntity>}
 */
cursoconducir.MockTitledEntityStorageClient.prototype.allEntities_;

/**
 * @public
 * @type {{status:string, error:string}}
 */
cursoconducir.MockTitledEntityStorageClient.prototype.error = null;

/**
 * @public
 * @param {Array.<cursoconducir.TitledEntity>} allEntities
 */
cursoconducir.MockTitledEntityStorageClient.prototype.setEntities = function(allEntities) {
	this.allEntities_ = allEntities;
};

/**
 * @public
 * @param {{status:string, error:string}} error
 */
cursoconducir.MockTitledEntityStorageClient.prototype.setError = function(error) {
	this.error = error;
};

/**
 * @inheritDoc
 */ 
cursoconducir.MockTitledEntityStorageClient.prototype.getAll = function(success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
		success(this.allEntities_);
	} else {
		this.doError(error);
	}
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.getPaged = function(offset, length, success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
		/**@type {Array.<cursoconducir.TitledEntity>}*/ var  paged = [];
		for (var i = offset; i < Math.min(this.allEntities_.length,offset + length); i++) {
			goog.array.insert(paged, this.allEntities_[i]);
		}
		success(paged);
	} else {
		this.doError(error);
	}
	
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.get = function(ids, success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
		/**@type {Array.<cursoconducir.TitledEntity>}*/ var  foundLessons = [];
		$(this.allEntities_).each(function() {
			if (goog.array.contains(ids, this.id)) {
				goog.array.insert(foundLessons, this);
			}
		});
		success(foundLessons);
	} else {
		this.doError(error);
	}
	
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.count = function(publishedOnly, success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
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
	} else {
		this.doError(error);
	}
	
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.store = function(questions, success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
		var that = this;
		$(questions).each(function() {
			if (!this.id) {
				this.id = Math.random();
			}
			var foundEntityIndex = cursoconducir.utils.findObjectIndexById(that.allEntities_, this.id);
			if (foundEntityIndex > -1) {
				that.allEntities_[foundEntityIndex] = this;
			} else { 
				goog.array.insert(that.allEntities_, this);
			}
		});
		success(this.allEntities_);
	} else {
		this.doError(error);
	}
	
	if (complete) {
		complete();
	}
};

/**
 * @inheritDoc
 */
cursoconducir.MockTitledEntityStorageClient.prototype.del = function(questionIds, success, error, complete) {
	if (!goog.isDefAndNotNull(this.error)) {
		/**@type {Array.<cursoconducir.TitledEntity>}*/ var  newEntities = [];
		$(this.allEntities_).each(function() {
			if (!goog.array.contains(ids, this.id)) {
				goog.array.insert(newEntities, this);
			}
		});
		lessons = newEntities;
		success();
	} else {
		this.doError(error);
	}
	
	complete();
};
/**
 * @private
 */
cursoconducir.MockTitledEntityStorageClient.prototype.doError = function(error) {
	if (error) {
		var xhr = new cursoconducir.MockXmlHttpRequest();
		xhr.status = this.error.status;
		error(xhr, null, this.error.error);
	}
	this.error = null;
};


/**
 * @public
 * @param {jQuery} container
 * @param {cursoconducir.TitledEntity} entity
 * @param {boolean=} selected
 * @param {boolean=} checkImage
 */
cursoconducir.titledentityassert.assertEntityPresent = function(container, entity, selected, checkImage) {
	var entityTitle = container.find("a[id='entityTitleLink" + entity.id + "']");
	assertNotNullNorUndefined(entityTitle);
	assertEquals(entity.title, goog.string.trim(entityTitle.text()));
	assertTrue(entityTitle.attr('href') == undefined);
	
	if (entity.published) {
		var publishedImage = container.find('img[src="/images/published.png"][id="publishedIndication' + entity.id + '"]');	
		assertNotNullNorUndefined(publishedImage[0]);
	} else {
		var unpublishedImage = container.find('img[src="/images/unpublished.png"][id="publishedIndication' + entity.id + '"]');
		assertNotNullNorUndefined(unpublishedImage[0]);
	}
	
	var imageLink = container.find('a[id="testImageLink' + entity.id + '"]');
	var image = container.find('img[src="/image?key=' + entity.image + '&s=80&falback=/images/80x50.gif"]');
	if (!goog.isDefAndNotNull(checkImage) || checkImage) {
		assertTrue(goog.isDefAndNotNull(imageLink[0]));
		assertTrue(goog.isDefAndNotNull(image[0]));
	} else {
		assertFalse(goog.isDefAndNotNull(imageLink[0]));
		assertFalse(goog.isDefAndNotNull(image[0]));
	}

	assertNotNullNorUndefined(container.find("div:contains('" + entity.description + "')")
			.text());

	var checkBox = container.find("input[type='checkbox'][name='" + entity.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
	if (goog.isDefAndNotNull(selected)) {
		if (!selected) {
			assertEquals(undefined, checkBox.attr('checked'));
		}
	}
};

/**
 * @public
 * @param {jQuery} container
 * @param {cursoconducir.TitledEntity} entity1
 * @param {cursoconducir.TitledEntity} entity2
 */
cursoconducir.titledentityassert.assertEntityBefore = function(container, entity1, entity2) {
	var checkBox1 = container.find("input[type='checkbox'][name='" + entity1.id + "']");
	var checkBox2 = container.find("input[type='checkbox'][name='" + entity2.id + "']");
	
	var question1Container = checkBox1.parents('#entitysInAList');
	var question2Container = checkBox2.parents('#entitysInAList');
	assertNotNullNorUndefined(question1Container[0]);
	assertNotNullNorUndefined(question2Container[0]);

	assertEquals(question1Container.parent().html(), question2Container.parent().html());

	var children=question1Container.parent().children();
	assertTrue(children.index(question1Container) < children.index(question2Container));
};


