goog.provide('cursoconducir.utils');

goog.require('goog.array');
goog.require('cursoconducir.Question');

/**
 * @public
 */
cursoconducir.utils.code = function(template) {
	var possibleAnswers = [];
	var correctAnswerIndex = 0;
	for ( var i = 0; i < template.possibleAnswers.length; i++) {
		possibleAnswers[i] = template.possibleAnswers[i].text;
		if (template.possibleAnswers[i].sel) {
			correctAnswerIndex = i;
		}
	}
	return {
		id : template.id,
		title : template.title,
		image : template.image,
		description : template.description,
		possibleAnswers : possibleAnswers,
		correctAnswerIndex : correctAnswerIndex,
		explanation : template.explanation,
		published : template.published
	};
};

/**
 * @public
 */
cursoconducir.utils.decode = function(jsonObject) {
	if (jsonObject.decode) {
		return jsonObject;
	}
	var possibleAnswers = [];
	for ( var i = 0; i < jsonObject.possibleAnswers.length; i++) {
		possibleAnswers[i] = {
			title : cursoconducir.utils.getTestLetter(i),
			index : i,
			text : jsonObject.possibleAnswers[i],
			sel : i == jsonObject.correctAnswerIndex ? true : false
		};
	}
	return {
		id : jsonObject.id,
		title : jsonObject.title,
		image : jsonObject.image,
		description : jsonObject.description,
		possibleAnswers : possibleAnswers,
		explanation : jsonObject.explanation,
		correctAnswerIndex : jsonObject.correctAnswerIndex,
		published : jsonObject.published,
		decode : true
	};
};

/**
 * @public
 */
cursoconducir.utils.indexes = {
	'0' : 'A',
	'1' : 'B',
	'2' : 'C'
};

/** public */
cursoconducir.utils.getTestLetter = function(index) {
	return cursoconducir.utils.indexes[index];
};

/**
 * @public
 * @param {Object} model
 * @param {string} testId
 * @param {function(Object)} callback
 * @param {function()=} hideFeedback
 * @param {function(string)=} showFeedback
 */
cursoconducir.utils.findOrFetchTest = function(model, testId, callback,
		hideFeedback, showFeedback) {
	var foundTest = cursoconducir.utils.findObjectById(model.allTests, testId);
	foundTest = cursoconducir.utils.decode(foundTest);
	if (foundTest) {
		callback(foundTest);
		return;
	}
	if (hideFeedback) {
		hideFeedback();
	}
	cursoconducir.Question.get([ testId ], function(test, textStatus, jqXHR) {
		if (test && test.length > 0) {
			callback(cursoconducir.utils.decode(test[0]));
		} else {
			if (showFeedback) {
				showFeedback('No test found with id ' + testId);
			}
		}
	}, function(xhr, ajaxOptions, thrownError) {
		if (showFeedback) {
			showFeedback('Cannot fetch a test. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}
	});
};

/**
 * @public
 * @param {Array.<cursoconducir.Question>} model
 * @param {string} id
 * @return {Array.<cursoconducir.Question>}
 */
cursoconducir.utils.findTests = function(model, testIds) {
	/** @type {Array.<cursoconducir.Question>}*/
	var foundTests = [];
	for (var i = 0; i < testIds.length; i++) {
		var test = cursoconducir.utils.findObjectById(model.allTests, testIds[i]);
		goog.array.insert(foundTests, cursoconducir.utils.decode(test));
	}
	return foundTests;
};

/**
 * @public
 * @param {Array.<cursoconducir.Question|cursoconducir.Lesson>} array
 * @param {string} id
 * @return {number}
 */
cursoconducir.utils.findObjectIndexById = function(array, id) {
	if (array == undefined || array == null) {
		return -1;
	}
	var allTestsLength = array.length;
	for ( var i = 0; i < allTestsLength; i++) {
		if (array[i].id == id) {
			return i;
		}
	}
	return -1;
};

/**
 * @public
 * @param {Array.<cursoconducir.Question|cursoconducir.Lesson>} array
 * @param {string} id
 * @return {cursoconducir.Question|cursoconducir.Lesson}
 */
cursoconducir.utils.findObjectById = function(array, id) {
	if (array) {
		var index = cursoconducir.utils.findObjectIndexById(array, id);
		if (index > -1) {
			return array[index];
		}
	}
};
