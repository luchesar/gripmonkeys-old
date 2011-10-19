function AllTestsModule(model, template, container) {
    this.model = model;
    this.template = template;
    this.container = container;
    
    this.onHashChange = function() {
//        if (window.location.hash == CREATE) {
//        } else if (window.location.hash == UPDATE) {
//        } else if (window.location.hash == CANCEL) {
//        }
    };
    this.template.mustache(this.model).appendTo(this.container);
}