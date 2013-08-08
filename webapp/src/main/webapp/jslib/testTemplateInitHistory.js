cursoconducir.History = new goog.History();
goog.exportProperty(cursoconducir, "History", cursoconducir.History);
goog.events.listen(cursoconducir.History, goog.history.EventType.NAVIGATE,
		function(e) {
			cursoconducir.onHashChange(e);
		});
cursoconducir.History.setEnabled(true);
/**
 * @public
 * @param {?goog.events.BrowserEvent}
 *            e
 */
cursoconducir.onHashChange = function(e) {
};