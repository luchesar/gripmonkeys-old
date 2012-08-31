goog.require('cursoconducir.IndexPage');
goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');
goog.require('goog.Uri');

goog.require('cursoconducir.moduleconstants');

goog.require('cursoconducir.admin.LessonsPage');
goog.require('cursoconducir.admin.TestsPage');

/** @type {goog.module.ModuleManager}*/
var moduleManager = goog.module.ModuleManager.getInstance();
/** @type {goog.module.ModuleLoader}*/
var moduleLoader = new goog.module.ModuleLoader();

moduleLoader.setDebugMode(true);

moduleManager.setLoader(moduleLoader);
moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);

/** @type {goog.Uri}*/
var locationUri = new goog.Uri(window.location);
/** @type {cursoconducir.IndexPage}*/
var index = null;
/** @type {cursoconducir.admin.TestsPage}*/
var adminQuestion = null;
/** @type {cursoconducir.admin.LessonPage}*/
var adminLessons = null;


moduleManager.setLoaded(cursoconducir.moduleconstants.INDEX_MODULE);

/**
 * @private
 * @param {string} moduleId
 * @param {function()} onLoaded
 */
var loadPage = function(moduleId, onLoaded) {
	if (moduleManager.getModuleInfo(moduleId).isLoaded()) {
		onLoaded();
	} else {
		moduleManager.execOnLoad(moduleId, onLoaded);
	}
};

$(function() {
	/** @type {jQuery}*/
	var indexContainer = $('#indexContainer');
	
	if (locationUri.getPath().indexOf('/admin/questions') == 0) {
		loadPage(cursoconducir.moduleconstants.ADMIN_QUESTIONS_MODULE, function() {
			adminQuestion = new cursoconducir.admin.TestsPage(indexContainer);
			adminQuestion.start();
		});
	} else if (locationUri.getPath().indexOf('/admin/lessons') == 0) {
		loadPage(cursoconducir.moduleconstants.ADMIN_LESSONS_MODULE, function() {
			adminLessons = new cursoconducir.admin.LessonPage(indexContainer);
			adminLessons.start();
		});
		
	} else {
		loadPage(cursoconducir.moduleconstants.INDEX_MODULE, function() {
			index = new cursoconducir.IndexPage(indexContainer);
			index.start();
		});
	} 

});
