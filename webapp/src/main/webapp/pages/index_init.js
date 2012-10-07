goog.provide('cursoconducir.index_init');

goog.require('cursoconducir.IndexPage');
goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');
goog.require('goog.Uri');

goog.require('cursoconducir.moduleconstants');

//goog.require('cursoconducir.admin.LessonsPage');
//goog.require('cursoconducir.admin.TestsPage');

/** @type {goog.module.ModuleManager}*/
var moduleManager = goog.module.ModuleManager.getInstance();
/** @type {goog.module.ModuleLoader}*/
var moduleLoader = new goog.module.ModuleLoader();

moduleLoader.setDebugMode(true);

moduleManager.setLoader(moduleLoader);
moduleManager.setAllModuleInfo(goog.global['PLOVR_MODULE_INFO']);
moduleManager.setModuleUris(goog.global['PLOVR_MODULE_URIS']);

/** @type {cursoconducir.IndexPage}*/
var index = null;
/** @type {cursoconducir.admin.TestsPage}*/
var adminQuestion = null;
/** @type {cursoconducir.admin.LessonPage}*/
var adminLessons = null;
/** @type {cursoconducir.admin.CoursesPage}*/
var adminCourses = null;


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

/**
 * @public
 * @param {goog.Uri} locationUri
 */
cursoconducir.index_init.onPageLoad = function(locationUri) {
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
		
	} else if (locationUri.getPath().indexOf('/admin/courses') == 0) {
		loadPage(cursoconducir.moduleconstants.ADMIN_COURSES_MODULE, function() {
			adminCourses = new cursoconducir.admin.CoursesPage(indexContainer);
			adminCourses.start();
		});
		
	} else {
		loadPage(cursoconducir.moduleconstants.INDEX_MODULE, function() {
			index = new cursoconducir.IndexPage(indexContainer);
			index.start();
		});
	} 
};

$(function() {
	cursoconducir.index_init.onPageLoad(new goog.Uri(window.location));
});
