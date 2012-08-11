goog.provide('cursoconducir.TestPreviewModule');

goog.require('cursoconducir.template.testPreview');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.admin.tests.Model');

/**
 * @public
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.TestPreviewModule = function(container) {
	/** @type {boolean}*/
	var done = false;
	/** @type {?number}*/
	var markedIndex = null;
	/** @type {jQuery}*/
	var testContainer = null;
	/** @type {cursoconducir.Question}*/
	var activeTest = null;

	/**
	 * @public 
	 * @param {cursoconducir.admin.tests.Model} model
	 * @param {function(cursoconducir.Question, number)} answerClickCallback
	 */
	this.show = function(model, answerClickCallback) {
		var templateHtml = cursoconducir.template.testPreview.template(model);
		container.html(templateHtml);
		done = false;
		return init(model, answerClickCallback);
	};

	/** @public 
	 * @param {cursoconducir.admin.tests.Model} model
	 * @param {function(cursoconducir.Question, number)=} answerClickCallback*/
	this.add = function(model, answerClickCallback) {
		var templateHtml = cursoconducir.template.testPreview.template(model);
		container.append(templateHtml);
		done = false;
		return init(model, answerClickCallback);
	};

	/** @public 
	 * @param {Object} model
	 * @param {function(cursoconducir.Question, number)=} answerClickCallback*/
	var init = function(model, answerClickCallback) {
		activeTest = model.activeTest;
		testContainer = container.find('#questionPreviewContainer'
				+ activeTest.id);
		testContainer.find('a[possibleAnswer="true"]').click(
				function(event) {
					var index = testContainer.find(event.currentTarget).attr(
							'possibleAnswerIndex');
					if (answerClickCallback) {
						answerClickCallback(activeTest, parseInt(index, 10));
					} else {
						mark(parseInt(index, 10));
					}
				});
		return testContainer;
	};

	/** public 
	 * @param {string} url*/
	this.showGoToNextButton = function(url) {
		testContainer.find('#goToNextButtonContainer').removeClass('hide');
		testContainer.find('#goToNextButton').attr('href', url);
	};

	/** public */
	this.hideGoToNextButton = function() {
		testContainer.find('#goToNextButtonContainer').addClass('hide');
		testContainer.find('#goToNextButton').attr('href', undefined);
	};

	/** public
	 * @param {number} answerIndex */
	this.answer = function(answerIndex) {
		if (done) {
			return;
		}
		testContainer.find('#doTestHintContainer').addClass('hide');
		for ( var i = 0; i < activeTest.possibleAnswers.length; i++) {
			if (activeTest.possibleAnswers[i].sel === true) {
				if (answerIndex === i) {
					testContainer.find('#correctAnswerContainer').removeClass('hide');
					testContainer.find('#answerLink' + answerIndex).addClass('success');
				} else {
					testContainer.find('#wrongAnswerContainer').removeClass('hide');
					testContainer.find('#answerLink' + answerIndex).addClass('danger');
				}
				testContainer.find('#answerLink' + i).addClass('success');
			}
		}

		testContainer.find('#explanationContainer').addClass('span16');
		done = true;
	};

	/**
	 * @private
	 * @param {?number} markIndex
	 */
	var mark = function(markIndex) {
		markedIndex = markIndex;
		for ( var i = 0; i < activeTest.possibleAnswers.length; i++) {
			if (markIndex === i) {
				testContainer.find('#answerLink' + markIndex).addClass('info');
			} else {
				testContainer.find('#answerLink' + i).removeClass('info');
			}
		}
	};
	/**
	 * @private
	 * @type {function(?number)} 
	 */
	this.mark = mark;

	/**
	 * @public
	 * @return {?number}
	 */
	this.getMarkedIndex = function() {
		return markedIndex;
	};
	
	/**
	 * @public
	 */
	this.reset = function() {
		done = false;
	};
	
	/**
	 * @public
	 * @return {string}
	 */
	this.getTitle = function() {
		if (activeTest) {
			return activeTest.title;
		}
		return "";
	};
};