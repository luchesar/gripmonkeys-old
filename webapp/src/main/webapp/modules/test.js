function TestModule(model, onUpdate) {
    this.model = model;
    this.onUpdate = onUpdate;
    this.controls = { controls : { separator00 : { visible : false },
        separator01 : { visible : false }, separator02 : { visible : false },
        separator03 : { visible : false }, undo : { visible : false },
        redo : { visible : false }, separator04 : { visible : false },
        insertHorizontalRule : { visible : false },
        separator07 : { visible : false }, cut : { visible : false },
        copy : { visible : false }, paste : { visible : false },
        insertImage : { visible : false }, insertTable : { visible : false },
        createLink : { visible : false }, code : { visible : false } } };

    this.createEmptyHtmlEditor = function(id) {
        $(id).wysiwyg(this.controls);
        $(id).wysiwyg('setContent', '');
        $(id).wysiwyg({ iFrameClass : "testDescription-input" });
    };
    this.createEmptyHtmlEditor('#testDescription');
    
    console.log($('#sdfaftest.submit'));
    console.log($('#test.submit'));
    console.log($('#test.cancel'));
    $('#test.submit').click(function(eventObject) {

    });
    
    $('#sdfaftest.submit').click(function(eventObject) {

    });
    
    $('#test.cancel').click(function(eventObject) {
        console.log('cancel.click');
        this.model.activeTest = '';
        onUpdate();
    });
}
