function AllTestsModule() {
    /** public */
    this.show = function(model, template, container) {
        template.mustache(model).appendTo(container);
    };
}