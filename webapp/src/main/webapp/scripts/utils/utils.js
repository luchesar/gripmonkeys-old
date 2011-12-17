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

var indexes = {'0': 'A', '1': 'B', '2':'C'};
/** public */
var getTestLetter = function(index) {
    return indexes[index];
};
