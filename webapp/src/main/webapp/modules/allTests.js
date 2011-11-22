function AllTestsModule(model, template, container) {
    /** public */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
    };
}