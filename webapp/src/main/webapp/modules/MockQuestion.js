goog.provide('cursoconducir.MockQuestion');
goog.provide('cursoconducir.allquestions');

goog.require('cursoconducir.Question');
goog.require('goog.array');
goog.require('goog.testing.PropertyReplacer');

/**
 * @public
 * @constructor
 * @param {Array.<cursoconducir.Question>} allQuestions
 */
cursoconducir.MockQuestion = function(allQuestions) {
	/**
	 * @private
	 * @type {Array.<cursocqonducir.Question>}
	 */
	var questions = allQuestions;

	/**
	 * @private
	 * @type {goog.testing.PropertyReplacer}
	 */
	var stubs = new goog.testing.PropertyReplacer();

	/**
	 * @public
	 */
	this.setUp = function() {
		stubs.set(cursoconducir.Question, "getAll", function(success, error,
				complete) {
			success(questions);
			if (complete) {
				complete();
			}
		});

		stubs.set(cursoconducir.Question, "get", function(ids, success, error,
				complete) {
			/** @type {Array.<cursoconducir.Question>} */
			var foundLessons = [];
			$(questions).each(function() {
				if (goog.array.contains(ids, this.id)) {
					goog.array.insert(foundLessons, this);
				}
			});
			success(foundLessons);
			if (complete) {
				complete();
			}
		});

		stubs.set(cursoconducir.Question, "store", function(questions, success,
				error, complete) {
			$(questions).each(function() {
				goog.array.insert(questions, this);
			});
			success();
			if (complete) {
				complete();
			}
		});

		stubs.set(cursoconducir.Question, "del", function(ids, success, error,
				complete) {
			/** @type {Array.<cursoconducir.Question>} */
			var newLessons = [];
			$(questions).each(function() {
				if (!goog.array.contains(ids, this.id)) {
					goog.array.insert(newLessons, this);
				}
			});
			questions = newLessons;
			success();
			if (complete) {
				complete();
			}
		});
	};

	/**
	 * @public
	 */
	this.tearDown = function() {
		stubs.reset();
	};
};

cursoconducir.allquestions.assertQuestionPresent = function(container,
		question, isSelected) {
	assertNotNullNorUndefined(container.find("a[href='" + question.image
			+ "']"));
	var testTitle = container.find("a[href='#update?test=" + question.id
			+ "']");
	assertNotNullNorUndefined(testTitle);
	assertEquals(question.title, testTitle.text().trim());

	assertNotNullNorUndefined(container.find(
			"div:contains('" + question.description + "')").text());

	assertUndefined(container.find("a[href='#delete?test=" + question.id
			+ "']")[0]);
	assertUndefined(container.find("a[href='#publish?test=" + question.id
			+ "']")[0]);

	var checkBox = container.find("input[type='checkbox'][name='"
			+ question.id + "']");
	assertNotNullNorUndefined(checkBox[0]);
	assertEquals(isSelected, checkBox.attr('checked'));

	var publishedIndication = container
			.find("img[src='/images/published.png'][id='publishedIndication"
					+ question.id + "']");
	if (question.published) {
		assertNotNullNorUndefined(publishedIndication[0]);
	} else {
		assertUndefined(publishedIndication[0]);
	}
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

var assertQuestionBefore = function(container, question1, question2) {
	var checkBox1 = container.find("input[type='checkbox'][name='" + question1.id + "']");
	var checkBox2 = container.find("input[type='checkbox'][name='" + question2.id + "']");
	
	var question1Container = checkBox1.parents('#testInAList');
	var question2Container = checkBox2.parents('#testInAList');
	assertNotNullNorUndefined(question1Container[0]);
	assertNotNullNorUndefined(question2Container[0]);

	assertEquals(question1Container.parent().html(), question2Container.parent().html());

	var children=question1Container.parent().children();
	assertTrue(children.index(question1Container) < children.index(question2Container));
};


/**
 * @public
 */
cursoconducir.allquestions.assertQuestionBefore = assertQuestionBefore;

