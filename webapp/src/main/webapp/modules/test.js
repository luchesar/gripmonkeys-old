function TestModule() {
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
    var doneButton;
    var cancelButton;
    var imageKey;

    /**
     * @public
     * @param Test
     *            test
     * @return void
     */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
        currentTest = model.activeTest;
        if (currentTest == undefined) {
            return;
        }
        createEmptyHtmlEditor($('#testDescription'));

        modalContainer = $('#upload-image-modal');
        imageElement = $('#testImage');
        doneButton = $('#doneButton');
        cancelButton = $('#modalCancelButton');
        imageKey = model.activeTest.image;

        imageElement.click(function() {
            editImage();
        });
        doneButton.click(function() {
            $('#testImage').attr('src', $('#currentTestImage').attr('src'));
            modalContainer.hide();
        });
        cancelButton.click(function() {
            modalContainer.hide();
        });

        $('#fileToUpload').change(function() {
            fileSelected();
            uploadFile();
        });
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
                    { title : getTestLetter(0), index : 0, text : '', sel : true },
                    { title : getTestLetter(1), index : 1, text : '', sel : false },
                    { title : getTestLetter(2), index : 2, text : '', sel : false } ],
            explanation : '' };
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
                    { title : getTestLetter(0), index : 0,
                        text : $("textarea[name=answer0]").val(), sel : false },
                    { title : getTestLetter(1), index : 1,
                        text : $("textarea[name=answer1]").val(), sel : false },
                    { title : getTestLetter(2), index : 2,
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
//        textArea.wysiwyg(controls);
//        textArea.wysiwyg('setContent', '');
//        textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };

    var editImage = function() {
        $('#fileName').empty();
        $('#fileSize').empty();
        $('#fileType').empty();
        $('#progressNumber').empty();
        $('#currentTestImage').attr('src', $('#testImage').attr('src'));
        modalContainer
                .modal({ keyboard : true, backdrop : false, show : true });
    };

    function fileSelected() {
        var file = $('#fileToUpload')[0].files[0];
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

            $('#fileName').html('Name: ' + file.name);
            $('#fileSize').html('Size: ' + fileSize);
            $('#fileType').html('Type: ' + file.type);
        }
    }

    function uploadFile() {
        var fd = new FormData();
        fd.append("fileToUpload", $('#fileToUpload')[0].files[0]);
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
            $('#progressNumber').html(percentComplete.toString() + '%');
        } else {
            $('#progressNumber').html('unable to compute');
        }
    }

    function uploadComplete(evt) {
        imageKey = evt.target.getResponseHeader('key');
        var imageUrl = '/image?key=' + imageKey + '&falback=/images/330x230.gif';
        $('#currentTestImage').attr('src', imageUrl);
    }

    function uploadFailed(evt) {
        alert("There was an error attempting to upload the file.");
    }

    function uploadCanceled(evt) {
        alert("The upload has been canceled by the user or the browser dropped the connection.");
    }
}
