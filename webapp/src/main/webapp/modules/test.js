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

    /**
     * @public
     * @param Test test
     * @return void
     */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
        createEmptyHtmlEditor($('#testDescription'));
    };
    
    /** @public */
    this.isValid = function() {
        return true;
    };
    
    /** @public */
    this.getTest = function() {
        var test = { title : $("input[type=text][name=testTitle]").val(),
            image : '', description : $("textarea[name=testDescription]").val() };
        return test;
    };
    
    /** @private 
     * @param textArea : HtmlElement
     */
    var createEmptyHtmlEditor = function(textArea) {
        textArea.wysiwyg(controls);
        textArea.wysiwyg('setContent', '');
        textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };
}
