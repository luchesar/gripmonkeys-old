function TestModule(model, template, container) {
    var CREATE = '#create';
    var UPDATE = '#update';
    var CANCEL = '#cancel';
    var SAVE = '#save';

    this.model = model;
    this.template = template;
    this.container = container;
    this.action;

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

    this.create = function(test) {
        this.model.activeTest = test;
        this.updateContainer();
        this.action = UPDATE;
    };

    this.cancel = function() {
        this.model.activeTest = null;
        this.updateContainer();
    };

    this.updateContainer = function() {
        this.container.empty();
        this.template.mustache(this.model).appendTo(this.container);
        this.createEmptyHtmlEditor($('#testDescription'));
    };

    this.getTestFromFields = function() {
        var test = { title : $("input[type=text][name=testTitle]").val(),
            image : '', description : $("texarea[name=testDescription]").val() };
    };

    this.update = function() {
        if (this.action == CREATE) {
            var test = this.getTestFromFields();
        }
    };

    this.onHashChange = function() {
        if (window.location.hash == CREATE) {
            this.create({ title : '', image : '', description : '' });
            this.action = window.location.hash;
        } else if (window.location.hash == UPDATE) {
            this.update(this.model.allTests.get());
            this.action = window.location.hash;
        } else if (window.location.hash == CANCEL) {
            this.cancel();
        }
    };
}
