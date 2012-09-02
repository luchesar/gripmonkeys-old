goog.provide('cursoconducir.Question');

goog.require('goog.array');
goog.require('goog.json');

goog.require('cursoconducir.TitledEntityStorageClient');

/** @typedef {{id:?string, title:string, image:string,description:string, possibleAnswers:Array.<string>}}*/
cursoconducir.Question;
cursoconducir.Question = {};

/** @typedef {function(Array.<cursoconducir.Question>, string=,Object=)}*/
cursoconducir.Question.onSuccess;

/**
 * @private
 * @type {cursoconducir.TitledEntityStorageClient}
 */
cursoconducir.Question.storageClient = new cursoconducir.TitledEntityStorageClient('question-storage');

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
 * Gets all the question object from the server
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Question.getAll = function(success, error, complete) {
	cursoconducir.Question.storageClient.getAll(success, error, complete);
};

/**
 * Gets a page of questions from the server
 * @param {number} offset
 * @param {number} length
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Question.getPaged = function(offset, length, success, error, complete) {
	cursoconducir.Question.storageClient.getPaged(offset, length, success, error, complete);
};

/**
 * Gets question object from the server with the corresponding IDs
 * @param {Array.<String>} ids
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Question.get = function(ids, success, error, complete) {
	cursoconducir.Question.storageClient.get(ids, success, error, complete);
};

/**
 * Stores question objects on the server
 * @param {Array.<cursoconducir.Question>} questions
 * @param {cursoconducir.Question.onSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Question.store = function(questions, success, error, complete) {
	cursoconducir.Question.storageClient.store(questions, success, error, complete);
};

/**
 * Deletes question object from the server with the corresponding IDs
 * @param {Array.<string>} questionIds
 * @param {cursoconducir.TitledEntity.onDelSuccess} success
 * @param {cursoconducir.TitledEntity.onError=} error
 * @param {cursoconducir.TitledEntity.onComplate=} complete
 */
cursoconducir.Question.del = function(questionIds, success, error, complete) {
	cursoconducir.Question.storageClient.del(questionIds, success, error, complete);
};
