goog.provide('cursoconducir.Question');

/**
 * A Question.
 * 
 * @constructor
 * @param {string} id
 * @param {string} title
 * @param {string} imageKey
 * @param {string} description
 * @param {Array.<string>} possibleAnswers
 * @param {string} explanation
 */
cursoconducir.Question = function(id, title, imageKey, description,
        possibleAnswers, explanation) {
    /** @define {string} */
    var id = id;
    /** @define {string} */
    var title = title;
    /** @define {string} */
    var image = imageKey;
    /** @define {string} */
    var description = description;
    /** @define {Array.<Object.<string, number,string, boolean>} */
    var possibleAnswers = possibleAnswers;
    /** @define {string} */
    var explanation = explanation;
};

/**
 * Creates a new Question object from a js object
 * @param {Object.<string, string, string, string, Array.<Object.<string, number,string, boolean>, string>} q
 */
cursoconducir.Question.create = function(q) {
    return new cursoconducir.Question(q.id, q.title, q.image, q.description, q.possibleAnswers, q.explanation);
};