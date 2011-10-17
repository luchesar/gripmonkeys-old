function TestModule(model, template, container) {
    this.model = model;
    this.template = template;
    this.container = container;
    
    this.controls = { controls : { separator00 : { visible : false },
        separator01 : { visible : false }, separator02 : { visible : false },
        separator03 : { visible : false }, undo : { visible : false },
        redo : { visible : false }, separator04 : { visible : false },
        insertHorizontalRule : { visible : false },
        separator07 : { visible : false }, cut : { visible : false },
        copy : { visible : false }, paste : { visible : false },
        insertImage : { visible : false }, insertTable : { visible : false },
        createLink : { visible : false }, code : { visible : false } } };

    this.createEmptyHtmlEditor = function(textArea) {
        textArea.wysiwyg(this.controls);
        textArea.wysiwyg('setContent', '');
        textArea.wysiwyg({ iFrameClass : "testDescription-input" });
    };
    
    this.update = function(test) {
        this.model.activeTest = test;
        this.updateContainer();
    };
    
    this.cancel = function(test) {
        this.model.activeTest = null;
        this.updateContainer();
    };
    
    this.updateContainer = function() {
        this.container.empty();
        this.template.mustache(model).appendTo(this.container);
        this.createEmptyHtmlEditor($('#testDescription'));
    };
    
    this.onHashChange = function() {
        if (window.location.hash == '#create') {
            this.update('empty test');
        } else if (window.location.hash == '#cancel') {
            this.update('');
        } else if (window.location.hash == '#save') {
            
        }  
    };
}
