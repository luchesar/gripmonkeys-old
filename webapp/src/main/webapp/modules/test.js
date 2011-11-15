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

    /**
     * @public
     * @param Test
     *            test
     * @return void
     */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
        currentTest = model.activeTest;
        // createEmptyHtmlEditor($('#testDescription'));
    };

    /** @public */
    this.isValid = function() {
        return true;
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
            image : $("#testImage").attr("src"),
            description : $("textarea[name=testDescription]").val(),
            possibleAnswers : [
                    { title : 'Answer 1', index : 0,
                        text : $("textarea[name=answer0]").val(),
                        sel : false },
                    { title : 'Answer 2', index : 1,
                        text : $("textarea[name=answer1]").val(),
                        sel : false },
                    { title : 'Answer 3', index : 2,
                        text : $("textarea[name=answer2]").val(),
                        sel : false } ],
            explanation : $("textarea[name=testExplanation]").val() };

        var selectionOption=$("#correctAnswerIndex :selected");
        var selectedIndex = selectionOption.attr('value');
        testTemplate.possibleAnswers[selectedIndex].sel = true;
        return testTemplate;
    };

    /**
     * @private
     * @param textArea :
     *            HtmlElement
     */
    var createEmptyHtmlEditor = function(textArea) {
        textArea.wysiwyg(controls);
        textArea.wysiwyg('setContent', '');
        textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };
}
