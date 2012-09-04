goog.provide('cursoconducir.Question');
goog.provide('cursoconducir.QuestionClient');

goog.require('goog.array');
goog.require('goog.json');

goog.require('cursoconducir.TitledEntityStorageClient');

/** @typedef {{id:?string, title:string, image:string,description:string, published:?boolean, possibleAnswers:Array.<string>}}*/
cursoconducir.Question = {};

/** @typedef {function(Array.<cursoconducir.Question>, string=,jQuery.jqXHR=)}*/
cursoconducir.Question.onSuccess;

/**
 * @public
 * @param {?string} id
 * @param {string} title
 * @param {string} image
 * @param {string} description
 * @param {Array.<string>} possibleAnswers
 * return {cursoconducir.Question}
 */
cursoconducir.Question.create = function(id, title, image, description, possibleAnswers) {
	return {
		id : id,
		title : title,	
		image : image,
		description : description,
		possibleAnswers : possibleAnswers
	};
};

/**
 * @public
 * @constructor
 * @extends {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.QuestionClient = function() {
	cursoconducir.TitledEntityStorageClient.call(this, 'question-storage');
};

goog.inherits(cursoconducir.QuestionClient, cursoconducir.TitledEntityStorageClient);

/**
 * @public
 * @override
 * Gets all the Question object from the server
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.QuestionClient.prototype.getAll = function(success, error, complete) {
	goog.base(this, 'getAll', success, error, complete);
};