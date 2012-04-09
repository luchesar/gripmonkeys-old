goog.provide('cursoconducir.admin.TestsPage');
goog.provide('cursoconducir.admin.tests');

goog.require('hashchange');
goog.require('jquery.querystring');
goog.require('cursoconducir.utils');
goog.require('cursoconducir.TestModule');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.TestPreviewModule');
goog.require('goog.net.Cookies');
goog.require('cursoconducir.template.tests.buttons');
goog.require('goog.json');
goog.require('cursoconducir.Question');

cursoconducir.admin.tests.init = function() {
	var testPage;
	$(function() {
		var contanier = $('#container');
		testPage = new cursoconducir.admin.TestsPage(contanier);
		testPage.start();
		window._cursoConducirPage = testPage;
	});
};

cursoconducir.admin.TestsPage = function(testsContainer, previewTestTemplate) {
	/** @private */
	var CREATE = '#create';
	/** @private */
	var CANCEL = '#cancel';
	/** @private */
	var UPDATE = '#update';
	/** @private */
	var TEST_KEY = 'test';
	/** @private */
	var EDIT = '#edit';
	/** @private */
	var PREVIEW = '#preview';

	/** @private */
	var model = {
		allTests : null,
		activeTest : null
	};

	/** @private */
	var testModule = new cursoconducir.TestModule(testsContainer);
	/** @private */
	var allTestsModule = new cursoconducir.AllTestsModule(testsContainer);

	var selectionChangedCallback = function(selection) {
		if (!goog.array.isEmpty(selection)) {
			var selectedTests = cursoconducir.utils.findTests(model, selection);
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

	/** @private */
	var testPreviewModule = new cursoconducir.TestPreviewModule(testsContainer);

	this.testPreview = testPreviewModule;
	
	var postToServerDefaultSuccess = function(savetQuestions, textStatus, jqXHR) {
		$(savetQuestions).each(function() {
			var testIndex = cursoconducir.utils.findTestIndexById(model, this.id);
	        if (!model.allTests) {
	            model.allTests = [];
	        }
	        if (testIndex < 0) {
	            testIndex = model.allTests.length;
	        }
	        model.allTests[testIndex] = cursoconducir.utils.decode(this);
		});
        
        window.location.hash = '#';
    };


	/** private */
	var updateCurrentEditedTest = function() {
		if (!testModule.isValid()) {
			return;
		}
		var templateTest = testModule.getTest();
		postToServer(templateTest, postToServerDefaultSuccess);
	};

	/** private */
	var updateCurrentPreviewedTest = function() {
		postToServer(model.activeTest, postToServerDefaultSuccess);
	};
	
	/** @private */
	var doHashChanged = function(hash) {
		hideFeedback();
		if (!hash) {
			hash = window.location.hash;
		}
		if (hash == '' || hash == '#' || hash == CANCEL) {
			model.activeTest = null;
			if (initAllTests(function() {
				allTestsModule.show(model);
				updateButtons(cursoconducir.template.tests.buttons.initial);
				$("#footer").addClass("loaded");
			}));
		} else if (hash == CREATE) {
			model.activeTest = testModule.createEmptyTest();
			testModule.show(model);
			updateButtons(cursoconducir.template.tests.buttons.edit);
		} else if (hash.indexOf(UPDATE) == 0) {
			var testId = $.getQueryString(TEST_KEY);
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
			var testId = $.getQueryString(TEST_KEY);
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

	var doPublish = function(published) {
		var selectedTestsIds = allTestsModule.getSelection();
		var selectedTests = [];
		$(selectedTestsIds).each(function(){
			var selectedTest = cursoconducir.utils.findTestById(model, this);
			selectedTest.published = published;
			goog.array.insert(selectedTests, cursoconducir.utils.code(selectedTest));
		});
		
		cursoconducir.Question.store(selectedTests, function() {
			allTestsModule.show(model);
			updateButtons(cursoconducir.template.tests.buttons.initial);
		}, function(xhr, ajaxOptions, thrownError) {
			showFeedback('Cannot publish or unpublish questions. Server returned error \''
					+ xhr.status + ' ' + thrownError + '\'');
		});
	};

	var previewTest = function(test) {
		model.activeTest = test;
		testPreviewModule.show(model);
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

	/** @private */
	var postToServer = function(templateTest, onSuccess) {
		hideFeedback();
		var test = cursoconducir.utils.code(templateTest);

		cursoconducir.Question
				.store(
						[ test ],
						onSuccess,
						function(xhr, ajaxOptions, thrownError) {
							showFeedback('the test did not get saved because server returned error \''
									+ xhr.status + ' ' + thrownError + '\'');
						});
	};

	var doDelete = function() {
		hideFeedback();
		var selectedTestsIds = allTestsModule.getSelection();
		var selectedTests = '';
		for ( var i = 0; i < selectedTestsIds.length; i++) {
			var selectedTest = cursoconducir.utils.findTestById(model,
					selectedTestsIds[i]);
			selectedTests += selectedTest.title + ", ";
		}
		if (confirmDelete(selectedTests)) {
			cursoconducir.Question.del(selectedTestsIds, function(wasDeleted,
					textStatus, jqXHR) {
				if (wasDeleted) {
					for ( var i = 0; i < selectedTestsIds.length; i++) {
						var spliceIndex = cursoconducir.utils
								.findTestIndexById(model, selectedTestsIds[i]);
						model.allTests.splice(spliceIndex, 1);
					}
				}
			},
			function(xhr, ajaxOptions, thrownError) {
				showFeedback('Cannot delete a test. Server returned error \''
						+ xhr.status + ' ' + thrownError + '\'');
			},
			function() {
				testsContainer.empty();
				allTestsModule.show(model);
				updateButtons(cursoconducir.template.tests.buttons.initial);
			});
		}
	};

	/** @private */
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

	/** @private */
	var showFeedback = function(errorMessage) {
		var feedback = $('.feedback');
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
		$(window).hashchange(function() {
			doHashChanged();
		});
		$(window).hashchange();
	};

	this.editImage = function(imageElement) {
		testModule.editImage(imageElement);
	};

	this.answer = function(answerIndex) {
		testPreviewModule.answer(model.activeTest, answerIndex);
	};
}