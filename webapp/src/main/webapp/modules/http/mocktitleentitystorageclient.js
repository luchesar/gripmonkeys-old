goog.provide('cursoconducir.MockTitledEntityStorageClient');
goog.provide('cursoconducir.titledentityassert');

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
 * @public
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
	var that = this;
	$(questions).each(function() {
		if (!this.id) {
			this.id = Math.random();
		}
		var foundEntity = cursoconducir.utils.findObjectById(that.allEntities_, this.id);
		if (foundEntity) {
			goog.array.remove(that.allEntities_, this);
		} 
		goog.array.insert(that.allEntities_, this);
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

/**
 * @public
 * @param {jQuery} container
 * @param {cursoconducir.TitledEntity} entity
 * @param {boolean=} selected
 */
cursoconducir.titledentityassert.assertEntityPresent = function(container, entity, selected) {
	var entityTitle = container.find("a[id='entityTitleLink" + entity.id + "']");
	assertNotNullNorUndefined(entityTitle);
	assertEquals(entity.title, entityTitle.text().trim());
	assertTrue(entityTitle.attr('href') == undefined);
	
	if (entity.published) {
		var publishedImage = container.find('img[src="/images/published.png"][id="publishedIndication' + entity.id + '"]');	
		assertNotNullNorUndefined(publishedImage[0]);
	} else {
		var unpublishedImage = container.find('img[src="/images/unpublished.png"][id="publishedIndication' + entity.id + '"]');
		assertNotNullNorUndefined(unpublishedImage[0]);
	}
	
	var imageLink = container.find('a[id="testImageLink' + entity.id + '"]');
	assertNotNullNorUndefined(imageLink[0]);
	
	var image = container.find('img[src="/image?key=' + entity.image + '&s=80&falback=/images/80x50.gif"]');
	assertNotNullNorUndefined(image[0]);

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
cursoconducir.titledentityassert.assertQuestionBefore = function(container, entity1, entity2) {
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


