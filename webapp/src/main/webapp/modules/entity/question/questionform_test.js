goog.require('cursoconducir.QuestionForm');
goog.require('cursoconducir.allquestions');
goog.require('cursoconducir.utils');

var testContainer;
var questionForm;

var question1;
var question2;

var title;
var image;
var description;
var answer0;
var answer1;
var answer2;
var explanation;
var published;
var selectionOption;
var selectedIndex;

var setUp = function() {
	$('body').append("<div id='testContainer'/>");
	
	question1 = createTestQuestion(1, 1, false);
	question2 = createTestQuestion(2, 1, false);
	
	testContainer = $('#testContainer');
	testContainer.empty();
	questionForm = new cursoconducir.QuestionForm(testContainer);
};

function testShow() {
	var decodedQuestion = cursoconducir.utils.decode(question2);
	questionForm.show({allTests:[question1, question2], activeTest: decodedQuestion});
	
	init();
	
	assertEquals(question2.title, title.val());
	assertEquals('/image?key='+question2.image+'&falback=/images/330x230.gif', image.attr('src'));
	assertEquals(question2.description, description.val());
	
	assertEquals(question2.possibleAnswers[0], answer0.val());
	assertEquals(question2.possibleAnswers[1], answer1.val());
	assertEquals(question2.possibleAnswers[2], answer2.val());
	
	assertEquals(question2.explanation, explanation.val());
	assertEquals(question2.published.toString(), published.val());
	
	assertEquals(question2.correctAnswerIndex.toString(), selectedIndex);
}

function testGetQuestion() {
	var decodedQuestion = cursoconducir.utils.decode(question1);
	questionForm.show({allTests:[question1, question2], activeTest: decodedQuestion});
	
	init();
	
	title.val('new title');
	description.val('new description');
	answer0.val('new answer 0');
	answer1.val('new answer 1');
	answer2.val('new answer 2');
//	image.attr('src', '/image?key=newImageKey&falback=/images/330x230.gif');
	var cao = testContainer.find("#correctAnswerIndex")
	cao.find('option').removeAttr('selected');
	cao.find('option[value="2"]').attr('selected', '');
	
	var t = cursoconducir.utils.code(questionForm.getTest());
	
	assertEquals('new title', t.title);
//	assertEquals('newImageKey', t.image);
	assertEquals('new description', t.description);
	assertEquals('new answer 0', t.possibleAnswers[0]);
	assertEquals('new answer 1', t.possibleAnswers[1]);
	assertEquals('new answer 2', t.possibleAnswers[2]);
	assertEquals('false', t.published);
	assertEquals(2, t.correctAnswerIndex);
}

function init() {
	title = testContainer.find("input[type=text][name=testTitle]");
	image = testContainer.find("#testImage");
	description = testContainer.find("textarea[name=testDescription]");
	answer0 = testContainer.find("textarea[name=answer0]");
	answer1 = testContainer.find("textarea[name=answer1]");
	answer2 = testContainer.find("textarea[name=answer2]");
	explanation = testContainer.find("textarea[name=testExplanation]");
	published = testContainer.find("input[type=hidden][name=testPublished]");
	selectionOption = testContainer.find("#correctAnswerIndex :selected");
	
	selectedIndex = selectionOption.attr('value').toString();
    selectedIndex = selectedIndex ? selectedIndex : 0;
}

function createTestQuestion(index, correctAnswerIndex, published) {
	return {
		id : "test" + index,
		title : "test" + index,
		image : "http://imageKey" + index,
		description : "test1Description" + index,
		possibleAnswers : [ "answer" + index + "1text", 
		                    "answer" + index + "2text", 
		                    "answer" + index + "3text"],
		explanation : "explanation" + index,
		published : published,
		correctAnswerIndex: correctAnswerIndex
	};
};