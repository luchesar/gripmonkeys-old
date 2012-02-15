goog.provide('cursoconducir.AllTestsModule');

goog.require('cursoconducir.allTests');
goog.require("jquery.mustache");
goog.require("goog.soy");

cursoconducir.AllTestsModule = function() {
    /** public */
    this.show = function(model, container) {
        var theHtml = cursoconducir.allTests.template(model);
        container.html(theHtml);
    };
};