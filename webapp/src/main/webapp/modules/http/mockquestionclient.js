goog.provide('cursoconducir.MockQuestionClient');
goog.provide('cursoconducir.allquestions');

goog.require('cursoconducir.Question');
goog.require('goog.array');
goog.require('goog.testing.PropertyReplacer');
goog.require('cursoconducir.MockTitledEntityStorageClient');

/**
 * @public
 * @constructor
 * @param {Array.<cursoconducir.Question>} allQuestions
 */
cursoconducir.MockQuestionClient = function(allQuestions) {
	/**
	 * @private
	 * @type {goog.testing.PropertyReplacer}
	 */
	var stubs = new goog.testing.PropertyReplacer();
	
	/**
	 * @private
	 * @type {cursoconducir.MockTitledEntityStorageClient}
	 */
	var mockClient = new cursoconducir.MockTitledEntityStorageClient(allQuestions);

	/**
	 * @public
	 */
	this.setUp = function() {
		stubs.set(cursoconducir.QuestionClient.prototype, "getAll", mockClient.getAll);
		stubs.set(cursoconducir.QuestionClient.prototype, "get", mockClient.get);
		stubs.set(cursoconducir.QuestionClient.prototype, "store", mockClient.store);
		stubs.set(cursoconducir.QuestionClient.prototype, "del", mockClient.del);
		stubs.set(cursoconducir.QuestionClient.prototype, "count", mockClient.count);
		stubs.set(cursoconducir.QuestionClient.prototype, "getPaged", mockClient.getPaged);
		stubs.set(cursoconducir.QuestionClient.prototype, "allEntities_", mockClient.allEntities_);
	};

	/**
	 * @public
	 */
	this.tearDown = function() {
		stubs.reset();
	};
};

cursoconducir.allquestions.createTestQuestion = function(index) {
	return {
		id : "test" + index,
		title : "test" + index,
		image : "http://imageKey" + index,
		description : "test1Description" + index,
		possibleAnswers : [ {
			title : "answer" + index + "1",
			index : 0,
			text : "answer" + index + "1text",
			sel : false
		}, {
			title : "answer" + index + "2",
			index : 1,
			text : "answer" + index + "2text",
			sel : true
		} ],
		explanation : "explanation" + index,
		published : false
	};
};

