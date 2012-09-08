goog.provide('cursoconducir.TestModule');

goog.require('cursoconducir.template.test');
goog.require('cursoconducir.utils');
goog.require('bootstrap.modal');
goog.require('cursoconducir.Question');
goog.require('cursoconducir.admin.tests.Model');

goog.require('cursoconducir.ImageUpload');

/**
 * @constructor
 * @param {jQuery} container
 */
cursoconducir.TestModule = function(container) {
	/**
	 * @private
	 * @type {?cursoconducir.Question}
	 */
	var currentTest;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var modalContainer;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var imageElement;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var currectTestImage;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var imageFileName;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var imageFileSize;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var imageFileType;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var imageUploadProgress;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var doneButton;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var cancelButton;
	/**
	 * @private
	 * @type {jQuery}
	 */
	var fileToUpload;
	/**
	 * @private
	 * @type {string}
	 */
    var imageKey;
    /**
	 * @private
	 * @type {jQuery}
	 */
    var uploadImageModalContainer;

    /**
	 * @public
	 * @param {cursoconducir.admin.tests.Model} model
	 */
    this.show = function(model) { 
    	/** @type {string}*/
        var templateHtml = cursoconducir.template.test.template(model);
        container.html(templateHtml);
        currentTest = model.activeTest;
        if (currentTest == undefined) {
            return;
        }
        createEmptyHtmlEditor($('#testDescription'));

        imageElement = $('#testImage');
        uploadImageModalContainer = $('#uploadImageModalContainer');
        imageKey = model.activeTest.image;
        
        imageElement.click(function() {
            editImage();
        });
    };

    /**
     * @private
     */
    var resetFileToUploadContainer = function() {
    	/** @type {string}*/
        var uploadImageModalHtml = cursoconducir.template.test.uploadImageModal();
        uploadImageModalContainer.html(uploadImageModalHtml);
        currectTestImage = $('#currentTestImage');
        doneButton = $('#doneButton');
        cancelButton = $('#imageUploadmodalCancelButton');
        fileToUpload = $('#fileToUpload');
        modalContainer = $('#upload-image-modal');
        imageFileName = $('#fileName');
        imageFileSize = $('#fileSize');
        imageFileType = $('#fileType');
        imageUploadProgress = $('#progressNumber');
        doneButton.click(function() {
            imageElement.attr('src', currectTestImage.attr('src').toString());
            modalContainer.hide();
        });
        cancelButton.click(function() {
            modalContainer.hide();
        });

        fileToUpload.change(function() {
            fileSelected();
            uploadFile();
        });
        $('#uploadForm')[0].reset();
    };

    /**
	 * @public
	 * @return {boolean}
	 */
	this.isValid = function() {
		return true;
	};

    /** @public */
    this.createEmptyTest = function() {
        return {
            title : '',
            image : null,
            description : '',
            possibleAnswers : [
                    { title : cursoconducir.utils.getTestLetter(0), index : 0,
                        text : '', sel : true },
                    { title : cursoconducir.utils.getTestLetter(1), index : 1,
                        text : '', sel : false },
                    { title : cursoconducir.utils.getTestLetter(2), index : 2,
                        text : '', sel : false } ], explanation : '',
            published: true };
    };

    /** @public */
    this.getTest = function() {
    	/** @type {?string}*/
        var currentTestId = null;
        if (currentTest) {
            currentTestId = currentTest.id;
        }
        var testTemplate = {
            id : currentTestId,
            title : $("input[type=text][name=testTitle]").val(),
            image : imageKey,
            description : $("textarea[name=testDescription]").val(),
            possibleAnswers : [
                    { title : cursoconducir.utils.getTestLetter(0), index : 0,
                        text : $("textarea[name=answer0]").val(), sel : false },
                    { title : cursoconducir.utils.getTestLetter(1), index : 1,
                        text : $("textarea[name=answer1]").val(), sel : false },
                    { title : cursoconducir.utils.getTestLetter(2), index : 2,
                        text : $("textarea[name=answer2]").val(), sel : false } ],
            explanation : $("textarea[name=testExplanation]").val(),
            published: $("input[type=hidden][name=testPublished]").attr("value")};

        /** @type {jQuery}*/
        var selectionOption = $("#correctAnswerIndex :selected");
        /** @type {string|number}*/
        var selectedIndex = selectionOption.attr('value').toString();
        selectedIndex = selectedIndex ? selectedIndex : 0;
        testTemplate.possibleAnswers[selectedIndex].sel = true;
        return testTemplate;
    };

    /**
     * @private
     * @param {jQuery} textArea
     */
    var createEmptyHtmlEditor = function(textArea) {
        // textArea.wysiwyg(controls);
        // textArea.wysiwyg('setContent', '');
        // textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };

    /**
     * @private
     */
    var editImage = function() { 
        resetFileToUploadContainer();
        currectTestImage.attr('src', imageElement.attr('src').toString());
        modalContainer
                .modal({ keyboard : true, backdrop : false, show : true });
    };

    /**
     * @private
     */
    function fileSelected() {
        var file = fileToUpload[0].files[0];
        if (file) {
            var fileSize = 0;
            if (file.size > 1024 * 1024)
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100)
                        .toString()
                        + 'MB';
            else
                fileSize = (Math.round(file.size * 100 / 1024) / 100)
                        .toString()
                        + 'KB';

            imageFileName.html('Name: ' + file.name);
            imageFileSize.html('Size: ' + fileSize);
            imageFileType.html('Type: ' + file.type);
        }
    }

    /**
     * @private
     */
    function uploadFile() {
    	/** @type {FormData}*/
        var fd = new FormData();
        /** @type {File}*/
        var firstFileToUpload = fileToUpload[0].files[0];
        fd.append("fileToUpload", firstFileToUpload);
        /** @type {XMLHttpRequest}*/
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/image");
        xhr.send(fd);
    }

    /**
     * @private
     */
    function uploadProgress(evt) {
        if (evt.lengthComputable) {
        	/** @type {number}*/
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            imageUploadProgress.html(percentComplete.toString() + '%');
        } else {
            imageUploadProgress.html('unable to compute');
        }
    }

    /**
     * @private
     */
    function uploadComplete(evt) {
        imageKey = evt.target.getResponseHeader('key');
        /** @type {string}*/
        var imageUrl = '/image?key=' + imageKey
                + '&falback=/images/330x230.gif';
        
        currectTestImage.attr('src', imageUrl);
//        currectTestImage.attr('src', 'http://www.antarcticconnection.com/Antarctic/travel/trips/2011/landscape212.jpg');
    }

    /**
     * @private
     */
    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.");
    }

    /**
     * @private
     */
    function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
    }
};
