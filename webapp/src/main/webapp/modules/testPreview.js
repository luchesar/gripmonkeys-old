goog.provide('cursoconducir.TestPreviewModule');

goog.require('cursoconducir.template.testPreview');

/**
 * @constructor
 * @param {Object} container
 */
cursoconducir.TestPreviewModule = function(container) {
	var done = false;
	var markedIndex = null;
	var testContainer = null;
	var activeTest = null;

	/** public */
	this.show = function(model, answerClickCallback) {
		var templateHtml = cursoconducir.template.testPreview.template(model);
		container.html(templateHtml);
		done = false;
		return init(model, answerClickCallback);
	};

	/** @public 
	 * @param {Object} model
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

	/** public */
	this.showGoToNextButton = function(url) {
		testContainer.find('#goToNextButtonContainer').removeClass('hide');
		testContainer.find('#goToNextButton').attr('href', url);
	};

	/** public */
	this.hideGoToNextButton = function() {
		testContainer.find('#goToNextButtonContainer').addClass('hide');
		testContainer.find('#goToNextButton').attr('href', undefined);
	};

	/** public */
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
	this.mark = mark;

	this.getMarkedIndex = function() {
		return markedIndex;
	};
	
	this.reset = function() {
		done = false;
	};
	
	this.getTitle = function() {
		if (activeTest) {
			return activeTest.title;
		}
		return "";
	};
};