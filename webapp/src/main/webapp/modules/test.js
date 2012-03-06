goog.provide('cursoconducir.TestModule');

goog.require('cursoconducir.template.test');
goog.require('cursoconducir.utils');
goog.require('jquery.wysiwyg');
goog.require('bootstrap.modal');
goog.require('portableJson');

cursoconducir.TestModule = function(container) {
    /** @private constant */
    var controls = { controls : { separator00 : { visible : false },
        separator01 : { visible : false }, separator02 : { visible : false },
        separator03 : { visible : false }, undo : { visible : false },
        redo : { visible : false }, separator04 : { visible : false },
        insertHorizontalRule : { visible : false },
        separator07 : { visible : false }, cut : { visible : false },
        copy : { visible : false }, paste : { visible : false },
        insertImage : { visible : false }, insertTable : { visible : false },
        createLink : { visible : false }, code : { visible : false } } };

    var currentTest;
    var modalContainer;
    var imageElement;
    var currectTestImage;
    var imageFileName;
    var imageFileSize;
    var imageFileType;
    var imageUploadProgress;
    var doneButton;
    var cancelButton;
    var fileToUpload;
    var imageKey;
    var uploadImageModalContainer;

    /**
     * @public
     * @param Test
     *            test
     * @return void
     */
    this.show = function(model) { 
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

    var resetFileToUploadContainer = function() {
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
            imageElement.attr('src', currectTestImage.attr('src'));
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

    /** @public */
    this.isValid = function() {
        return true;
    };

    /** @private */
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
                        text : '', sel : false } ], explanation : '' };
    };

    /** @public */
    this.getTest = function() {
        var currentTestId = undefined;
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
            explanation : $("textarea[name=testExplanation]").val() };

        var selectionOption = $("#correctAnswerIndex :selected");
        var selectedIndex = selectionOption.attr('value');
        selectedIndex = selectedIndex ? selectedIndex : 0;
        testTemplate.possibleAnswers[selectedIndex].sel = true;
        return testTemplate;
    };

    /**
     * @private
     * @param textArea :
     *            HtmlElement
     */
    var createEmptyHtmlEditor = function(textArea) {
        // textArea.wysiwyg(controls);
        // textArea.wysiwyg('setContent', '');
        // textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };

    var editImage = function() { 
        resetFileToUploadContainer();
        currectTestImage.attr('src', imageElement.attr('src'));
        modalContainer
                .modal({ keyboard : true, backdrop : false, show : true });
    };

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

    function uploadFile() {
        var fd = new FormData();
        var firstFileToUpload = fileToUpload[0].files[0];
        fd.append("fileToUpload", firstFileToUpload);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", "/image");
        xhr.send(fd);
    }

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            imageUploadProgress.html(percentComplete.toString() + '%');
        } else {
            imageUploadProgress.html('unable to compute');
        }
    }

    function uploadComplete(evt) {
        imageKey = evt.target.getResponseHeader('key');
        var imageUrl = '/image?key=' + imageKey
                + '&falback=/images/330x230.gif';
        
        currectTestImage.attr('src', imageUrl);
//        currectTestImage.attr('src', 'http://www.antarcticconnection.com/Antarctic/travel/trips/2011/landscape212.jpg');
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.");
    }

    function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
    }
};
