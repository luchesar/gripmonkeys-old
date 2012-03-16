goog.require('goog.testing.jsunit');
goog.require('cursoconducir.AllTestsModule');
goog.require('cursoconducir.Question');

goog.require('jquery');

var allTestsModule;
var testContainer;

var setUp = function() {
    $('body').append("<div id='testContainer'/>");
    init();
};

var init = function() {
    testContainer = $('#testContainer');
    testContainer.empty();
    allTestsModule = new cursoconducir.AllTestsModule(testContainer);
};

var testShowEmptyModel = function() {
    allTestsModule
            .show({ allTests : [], activeTest : null, answerIndex : null });
    var allTestsContainer = $('#allTestsContainer');
    assertNotNull(allTestsContainer);

    assertEquals("No tests yet", allTestsContainer.text());
};

var testShowSomeTests = function() {
    var question1 = {
        id : "test1",
        title : "test1",
        image : "http://imageKey",
        description : "test1Description",
        possibleAnswers : [
                { title : "answer1", index : 0, text : "answer1text",
                    sel : false },
                { title : "answer2", index : 0, text : "answer2text",
                    sel : false } ], explanation : "explanation" };
    var question2 = {
        id : "test2",
        title : "test2",
        image : "http://imageKey2",
        description : "test1Description2",
        possibleAnswers : [
                { title : "answer21", index : 0, text : "answer21text",
                    sel : false },
                { title : "answer22", index : 0, text : "answer22text",
                    sel : false } ], explanation : "explanation2" };

    allTestsModule
            .show({ allTests : [question1, question2], activeTest : null, answerIndex : null });
    var allTestsContainer = $('#allTestsContainer');
    assertNotNull(allTestsContainer);
    
    assertTestPresent(question1);
    assertTestPresent(question2);
};

var assertTestPresent = function(question) {
    assertNotNull($("a[href='"+ question.image+"']"));
    var testTitle = $("a[href='#update?test="+question.id+"']");
    assertNotNull(testTitle);
    assertEquals(question.title, testTitle.text().trim());
    
    assertNotNull($($("div:contains('"+question.description+"')")).text());
    
    var testDelete = $("a[href='#delete?test="+question.id+"']");
    assertNotNull(testDelete);
    assertEquals('Delete', testDelete.text());
    
    var changeTestPublishment = $("a[href='#publish?test="+question.id+"']");
    assertNotNull(changeTestPublishment);
    assertEquals('Publish', changeTestPublishment.text());
}
