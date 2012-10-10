goog.require('goog.testing.jsunit');
goog.require('cursoconducir.PagedEntityList');
goog.require('cursoconducir.MockTitledEntityStorageClient');
goog.require('goog.array');

/** @type {cursoconducir.MockTitledEntityStorageClient}*/
var storage;
/** @type {cursoconducir.PagedEntityList}*/
var pageList;
/** @type {jQuery}*/
var parent;
/** @type {Array.<cursoconducir.TitledEntity>}*/
var e100;
/** @type {Array.<cursoconducir.TitledEntity>}*/
var e4;
/** @type {Array.<cursoconducir.TitledEntity>}*/
var e14;

G_testRunner.setStrict(false);

function setUpPage() {
	$('body').append("<div id='parent'/>");
	
	parent = $('#parent');
	
	storage = new cursoconducir.MockTitledEntityStorageClient();
	pageList = new cursoconducir.PagedEntityList(parent, storage, 4);
};

function setUp() {
	e4 = secE(4);
	e14 = secE(14);
	e100 = secE(1);
};

/*function testShowEmpty() {
	pageList.show();
	fail();
};

function testShowAPage() {
	storage.setEntities(e4);
	pageList.show();
	fail();
};

function testShowThreePages() {
	storage.setEntities(e14);
	pageList.show();
	fail();
};

function testBackForth() {
	fail();
};*/

/**
 * @param {number} num
 * @return {Array.<cursoconducir.TitledEntity>}
 */
function secE(num) {
	var sec = [];
	for (var i =0; i < num; i ++) {
		goog.array.insert(sec, newE(i));
	}
};

/**
 * @param {number} num
 * @return {cursoconducir.TitledEntity}
 */
function newE(num) {
	return {
		"id" : "id" + num,
		"name" : "name" + num,
		"image" : "image" + num,
		"description" : "d" + num
	};
}