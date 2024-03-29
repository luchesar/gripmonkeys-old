goog.provide('cursoconducir.utils');

goog.require('goog.array');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.QuestionClient');
goog.require('cursoconducir.admin.tests.Model');

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
	if (!goog.isDefAndNotNull(jsonObject)) {
		return undefined;
	}
	if (jsonObject.decode === true) {
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

/**
 * @public
 * @param {string|number} index
 * @return {string|number}
 */
cursoconducir.utils.getTestLetter = function(index) {
	return cursoconducir.utils.indexes[index];
};

/**
 * @public
 * @param {Object} model
 * @param {string} testId
 * @param {function(?cursoconducir.Question)} callback
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
	new cursoconducir.QuestionClient().get([ testId ],
	/** @type {cursoconducir.Question.onSuccess} */
	function(test, textStatus, jqXHR) {
		
		if (goog.isArray(test) && test.length > 0) {
			callback(cursoconducir.utils.decode(test[0]));
		} else if(!goog.isArray(test)) {
			callback(cursoconducir.utils.decode(test));
		} else {
			if (showFeedback) {
				showFeedback('No test found with id ' + testId);
			}
		}
	},/** @type {cursoconducir.TitledEntity.onError} */
	function(xhr, ajaxOptions, thrownError) {
		if (showFeedback) {
			showFeedback('Cannot fetch a test. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}
	});
};

/**
 * @public
 * @param {cursoconducir.admin.tests.Model} model
 * @param {Array.<string>} testIds
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
 * @param {cursoconducir.admin.lessons.Model} model
 * @param {Array.<string>} lessonIds
 * @return {Array.<cursoconducir.Lesson>}
 */
cursoconducir.utils.findLessons = function(model, lessonIds) {
	/** @type {Array.<cursoconducir.Lesson>}*/
	var foundLessons = [];
	for (var i = 0; i < lessonIds.length; i++) {
		var lesson = cursoconducir.utils.findObjectById(model.allLessons, lessonIds[i]);
		goog.array.insert(foundLessons, lesson);
	}
	return foundLessons;
};

/**
 * @public
 * @param {Array.<cursoconducir.Question|cursoconducir.Lesson>} array
 * @param {?string} id
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
 * @param {Array.<cursoconducir.Lesson>} array
 * @param {string} id
 * @return {?cursoconducir.Lesson}
 */
cursoconducir.utils.findObjectById = function(array, id) {
	if (array) {
		/** @type {number}*/
		var index = cursoconducir.utils.findObjectIndexById(array, id);
		if (index > -1) {
			return array[index];
		}
	}
	return null;
};

/**
 * @public
 * @param {Array.<cursoconducir.Question>} array
 * @param {string} id
 * @return {?cursoconducir.Question}
 */
cursoconducir.utils.findQuestionById = function(array, id) {
	if (array) {
		/** @type {number}*/
		var index = cursoconducir.utils.findObjectIndexById(array, id);
		if (index > -1) {
			return array[index];
		}
	}
	return null;
};

/**
 * @public
 * @param {string} key
 * @return {?string}
 */
cursoconducir.utils.queryParam = function(key){
	var locationUri = new goog.Uri(window.location);
	var param =  /** @type {string}*/locationUri.getQueryData().get(key);
	if (!goog.isDefAndNotNull(param)) {
		return new goog.Uri(locationUri.getFragment()).getQueryData().get(key).toString();
	}
	return null;
};
