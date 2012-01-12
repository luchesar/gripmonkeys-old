goog.provide('cursoconducir.AllTestsModule');

goog.require("jquery.mustache");

cursoconducir.AllTestsModule = function() {
    /** public */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
    };
};