goog.provide('cursoconducir.admin.TestsPage');
goog.provide('cursoconducir.admin.tests');
goog.provide('cursoconducir.admin.tests.Model');

goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestModule');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.TestPreviewModule');
goog.require('goog.net.Cookies');
goog.require('cursoconducir.template.tests.buttons');
goog.require('goog.json');
goog.require('cursoconducir.Question');
goog.require('goog.events.EventType');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');

/**
 * @public
 */
cursoconducir.admin.tests.init = function() {
	/** @type {cursoconducir.admin.TestsPage} */
	var testPage;
	$(function() {
		/** @type {jQuery} */
		var contanier = $('#container');
		testPage = new cursoconducir.admin.TestsPage(contanier);
		testPage.start();
	});
};

/**
 * @public
 * @constructor
 * @param {jQuery} testsContainer
 */

cursoconducir.admin.TestsPage = function(testsContainer) {
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var CREATE = '#create';
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var CANCEL = '#cancel';
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var UPDATE = '#update';
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var TEST_KEY = 'test';
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var EDIT = '#edit';
	/**
	 * @private
	 * @type {string}
	 * @const
	 */
	var PREVIEW = '#preview';

	/** @private*/ 
	var model = {
		/** @type {Array.<cursoconducir.Question>} */
		allTests : null,
		/** @type {cursoconducir.Question} */
		activeTest : null
	};

	/**
	 * @private
	 * @type {cursoconducir.TestModule}
	 */
	var testModule = new cursoconducir.TestModule(testsContainer);
	/**
	 * @private
	 * @type {cursoconducir.AllTestsModule}
	 */
	var allTestsModule = new cursoconducir.AllTestsModule(testsContainer);

	/**
	 * @private
	 * @param {Array.<string>} selection
	 */
	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			/** @type {Array.<cursoconducir.Question>} */
			var selectedTests = cursoconducir.utils.findTests(model.allTests, selection);
			/** @type {?boolean} */
			var allPublished = null;
			for ( var i = 0; i < selectedTests.length; i++) {
				if (i == 0) {
					allPublished = selectedTests[i].published;
				}
				if (allPublished != selectedTests[i].published) {
					allPublished = null;
					break;
				}
			}
			if (allPublished === true) {
				updateButtons(cursoconducir.template.tests.buttons.initialSelectionUnpublish);
			} else if (allPublished === false) {
				updateButtons(cursoconducir.template.tests.buttons.initialSelectionPublish);
			} else {
				updateButtons(cursoconducir.template.tests.buttons.initialSelectionDifferentPublish);
			}

		} else {
			updateButtons(cursoconducir.template.tests.buttons.initial);
		}
	};
	allTestsModule.addSelectionChangeCallback(selectionChangedCallback);

	/**
	 * @private
	 * @type {cursoconducir.TestPreviewModule}
	 */
	var testPreviewModule = new cursoconducir.TestPreviewModule(testsContainer);

	/**
	 * @public
	 * @type {cursoconducir.TestPreviewModule}
	 */
	this.testPreview = testPreviewModule;

	/**
	 * 
	 */
	var postToServerDefaultSuccess = function(savetQuestions, textStatus, jqXHR) {
		$(savetQuestions).each(
				function() {
					/** @type {number} */
					var testIndex = cursoconducir.utils.findObjectIndexById(
							model.allTests, this.id);
					if (!model.allTests) {
						model.allTests = [];
					}
					if (testIndex < 0) {
						testIndex = model.allTests.length;
					}
					model.allTests[testIndex] = cursoconducir.utils
							.decode(this);
				});

		window.location.hash = '#';
	};

	/** private */
	var updateCurrentEditedTest = function() {
		if (!testModule.isValid()) {
			return;
		}
		/** @type {cursoconducir.Question} */
		var templateTest = testModule.getTest();
		postToServer(templateTest, postToServerDefaultSuccess);
	};

	/** private */
	var updateCurrentPreviewedTest = function() {
		postToServer(model.activeTest, postToServerDefaultSuccess);
	};

	/**
	 * @private
	 * @param {string=} hash
	 */
	var doHashChanged = function(hash) {
		hideFeedback();
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#' || hash == CANCEL) {
			model.activeTest = null;
			initAllTests(function() {
				allTestsModule.show(model);
				updateButtons(cursoconducir.template.tests.buttons.initial);
				$("#footer").addClass("loaded");
			});
		} else if (hash == CREATE) {
			model.activeTest = testModule.createEmptyTest();
			testModule.show(model);
			updateButtons(cursoconducir.template.tests.buttons.edit);
		} else if (hash.indexOf(UPDATE) == 0) {
			var testId = cursoconducir.utils.queryParam(TEST_KEY);
			if ((model && model.activeTest && model.activeTest.id == testId)
					|| testId == undefined || testId == "") {
				testModule.show(model);
				updateButtons(cursoconducir.template.tests.buttons.edit);
			} else {
				cursoconducir.utils.findOrFetchTest(model, testId, function(
						test) {
					model.activeTest = test;
					testModule.show(model);
					updateButtons(cursoconducir.template.tests.buttons.edit);
				}, hideFeedback, showFeedback);
			}
		} else if (hash.indexOf(PREVIEW) == 0) {
			var testId = cursoconducir.utils.queryParam(TEST_KEY);
			if ((model && model.activeTest && model.activeTest.id == testId)
					|| testId == undefined || testId == "") {
				previewTest(testModule.getTest());
				$("#footer").addClass("loaded");
			} else {
				cursoconducir.utils.findOrFetchTest(model, testId, function(
						test) {
					previewTest(test);
					$("#footer").addClass("loaded");
				}, hideFeedback, showFeedback);
			}
		}
	};

	/**
	 * @private
	 * @param {boolean} published
	 */
	var doPublish = function(published) {
		var selectedTestsIds = allTestsModule.getSelection();
		var selectedTests = [];
		$(selectedTestsIds).each(
				function() {
					var selectedTest = cursoconducir.utils.findObjectById(
							model.allTests, this);
					selectedTest = cursoconducir.utils.decode(selectedTest);
					selectedTest.published = published;
					goog.array.insert(selectedTests, cursoconducir.utils
							.code(selectedTest));
				});

		cursoconducir.Question
				.store(
						selectedTests,
						function() {
							allTestsModule.show(model);
							updateButtons(cursoconducir.template.tests.buttons.initial);
						},
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('Cannot publish or unpublish questions. Server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
						});
	};

	var previewTest = function(test) {
		model.activeTest = test;
		testPreviewModule.show(model, function(activeTest, markedIndex) {
			testPreviewModule.answer(markedIndex);
		});
		updateButtons(cursoconducir.template.tests.buttons.preview);
	};

	var initAllTests = function(onComplate) {
		if (model.allTests != null) {
			onComplate();
			return;
		}
		hideFeedback();
		cursoconducir.Question.getAll(function(data, textStatus, jqXHR) {
			model.allTests = [];
			for ( var i = 0; i < data.length; i++) {
				model.allTests[i] = cursoconducir.utils.decode(data[i]);
			}
		}, function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot fetch all test. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		}, onComplate);
	};

	/**
	 * @private
	 * @param {cursoconducir.Question} templateTest
	 * @param {function(Array.<cursoconducir.Question>, string=,Object=)} onSuccess
	 */
	var postToServer = function(templateTest, onSuccess) {
		hideFeedback();
		var test = cursoconducir.utils.code(templateTest);

		cursoconducir.Question.store(
						[ test ],
						onSuccess,
						/**
						 * @type {function(jQuery.event,jQuery.jqXHR,Object.<string,*>,*)}
						 */
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the test did not get saved because server returned error \''
									+ xhr.data + ' ' + thrownError + '\'');
						});
	};

	/**
	 * @private
	 */
	var doDelete = function() {
		hideFeedback();
		/** @type {Array.<string>} */
		var selectedTestsIds = allTestsModule.getSelection();
		/** @type {string} */
		var selectedTests = '';
		for ( var i = 0; i < selectedTestsIds.length; i++) {
			/** @type {cursoconducir.Question} */
			var selectedTest = cursoconducir.utils.findQuestionById(
					model.allTests, selectedTestsIds[i]);
			selectedTests += selectedTest.title + ", ";
		}
		if (confirmDelete(selectedTests)) {
			cursoconducir.Question.del(selectedTestsIds,
							function(wasDeleted, textStatus, jqXHR) {
								if (wasDeleted) {
									for ( var i = 0; i < selectedTestsIds.length; i++) {
										/** @type {number} */
										var spliceIndex = cursoconducir.utils
												.findObjectIndexById(model.allTests,
														selectedTestsIds[i]);
										model.allTests.splice(spliceIndex, 1);
									}
								}
							},
							/**
							 * @type {function(jQuery.event,jQuery.jqXHR,Object.<string,
							 *       *>,*)}
							 */
							function(xhr, ajaxOptions, thrownError) {
								showFeedback('Cannot delete a test. Server returned error \''
										+ xhr.data + ' ' + thrownError + '\'');
							},
							/**
							 * @type {function(jQuery.event,XMLHttpRequest,Object.<string,
							 *       *>)}
							 */
							function() {
								testsContainer.empty();
								allTestsModule.show(model);
								updateButtons(cursoconducir.template.tests.buttons.initial);
							});
		}
	};

	/**
	 * @private
	 * @param {Array.<cursoconducir.Question>|string} selectedTests
	 */
	var confirmDelete = function(selectedTests) {
		return window.confirm("Are you sure you want to delete '"
				+ selectedTests + "' ?");
	};

	/** @private */
	var updateButtons = function(template) {
		var pageButtons = $('.pageButtons');
		var templateHtml = template(model);
		pageButtons.html(templateHtml);

		$('#deleteButton').click(function() {
			doDelete();
		});
		$('#publishButton').click(function() {
			doPublish(true);
		});
		$('#unpublishButton').click(function() {
			doPublish(false);
		});
		$('#saveEditedButton').click(function() {
			updateCurrentEditedTest();
		});
		$('#savePreviewedButton').click(function() {
			updateCurrentPreviewedTest();
		});
	};

	/**
	 * @private
	 * @param {string} errorMessage
	 */
	var showFeedback = function(errorMessage) {
		/** @type {jQuery}*/
		var feedback = $('.feedback');
		/** @type {string}*/
		var templateHtml = cursoconducir.template.tests.buttons.feedback({
			errorMessage : errorMessage
		});
		feedback.html(templateHtml);
		feedback.removeClass('hide');
	};

	/** @private */
	var hideFeedback = function() {
		var feedback = $('.feedback');
		feedback.empty();
		feedback.addClass('hide');
	};

	/** @public */
	this.start = function() {
		goog.events.listen(window, goog.events.EventType.HASHCHANGE,
				function(e) {
					doHashChanged();
				});
		doHashChanged();
	};

	this.answer = function(answerIndex) {
		testPreviewModule.answer(answerIndex);
	};
};