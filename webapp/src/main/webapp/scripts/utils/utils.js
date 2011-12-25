var code = function(template) {
    var possibleAnswers = [];
    var correctAnswerIndex = 0;
    for ( var i = 0; i < template.possibleAnswers.length; i++) {
        possibleAnswers[i] = template.possibleAnswers[i].text;
        if (template.possibleAnswers[i].sel) {
            correctAnswerIndex = i;
        }
    }
    return { id : template.id, title : template.title, image : template.image,
        description : template.description, possibleAnswers : possibleAnswers,
        correctAnswerIndex : correctAnswerIndex,
        explanation : template.explanation };
};

var decode = function(jsonObject) {
    var possibleAnswers = [];
    for ( var i = 0; i < jsonObject.possibleAnswers.length; i++) {
        possibleAnswers[i] = { title : getTestLetter(i), index : i,
            text : jsonObject.possibleAnswers[i],
            sel : i == jsonObject.correctAnswerIndex ? true : false };
    }
    return { id : jsonObject.id, title : jsonObject.title,
        image : jsonObject.image, description : jsonObject.description,
        possibleAnswers : possibleAnswers, explanation : jsonObject.explanation };
};

var indexes = { '0' : 'A', '1' : 'B', '2' : 'C' };
/** public */
var getTestLetter = function(index) {
    return indexes[index];
};

var findOrFetchTest = function(model, testId, callback, hideFeedback,
        showFeedback) {
    if (model.allTests) {
        var testIndex = findTestIndexById(testId);
        if (testIndex > -1) {
            callback(model.allTests[testIndex]);
            return;
        }
    }
    if (hideFeedback) {
        hideFeedback();
    }
    $.ajax({
        type : "GET",
        url : '/test-storage?key=' + testId,
        data : {},
        dataType : 'json',
        success : function(test, textStatus, jqXHR) {
            if (test && test.length > 0) {
                callback(decode(test[0]));
            } else {
                if (showFeedback) {
                    showFeedback('No test found with id ' + testId);
                }
            }
        },
        error : function(xhr, ajaxOptions, thrownError) {
            if (showFeedback) {
                showFeedback('Cannot fetch a test. Server returned error \''
                        + xhr.status + ' ' + thrownError + '\'');
            }
        }, complete : callback() });
};

var findTestIndexById = function(model, testId) {
    if (model.allTests == undefined || model.allTests == null) {
        return -1;
    }
    var allTestsLength = model.allTests.length;
    for ( var i = 0; i < allTestsLength; i++) {
        if (model.allTests[i].id == testId) {
            return i;
        }
    }
    return -1;
};
