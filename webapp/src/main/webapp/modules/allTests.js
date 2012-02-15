goog.provide('cursoconducir.AllTestsModule');

goog.require('cursoconducir.template.allTests');
goog.require("jquery.mustache");
goog.require("goog.soy");

cursoconducir.AllTestsModule = function(container) {
    /** public */
    this.show = function(model) {
        var theHtml = cursoconducir.template.allTests.template(model);
        container.html(theHtml);
    };
};