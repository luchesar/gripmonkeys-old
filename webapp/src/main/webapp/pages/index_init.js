goog.provide('cursoconducir.index_init');

goog.require('cursoconducir.IndexPage');
goog.require('cursoconducir.MainMenu');
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
/** @type {jQuery}*/
var mainMenuContainer;
/** @type {cursoconducir.MainMenu}*/
var mainMenu;


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
	mainMenuContainer = $('#mainMenuContainer');
	mainMenu = new cursoconducir.MainMenu(mainMenuContainer);
	/** @type {jQuery}*/
	var indexContainer = $('#indexContainer');
	
	if (locationUri.getPath().indexOf('/admin/questions') == 0) {
		mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.QUESTIONS);
		loadPage(cursoconducir.moduleconstants.ADMIN_MODULE, function() {
			adminQuestion = new cursoconducir.admin.TestsPage(indexContainer);
			adminQuestion.start();
		});
	} else if (locationUri.getPath().indexOf('/admin/lessons') == 0) {
		mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.LESSONS);
		loadPage(cursoconducir.moduleconstants.ADMIN_MODULE, function() {
			adminLessons = new cursoconducir.admin.LessonPage(indexContainer);
			adminLessons.start();
		});
		
	} else if (locationUri.getPath().indexOf('/admin/courses') == 0) {
		mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.COURSES);
		loadPage(cursoconducir.moduleconstants.ADMIN_MODULE, function() {
			adminCourses = new cursoconducir.admin.CoursesPage(indexContainer);
			adminCourses.start();
		});
		
	} else {
		mainMenu.showIndexLinks();
		loadPage(cursoconducir.moduleconstants.INDEX_MODULE, function() {
			index = new cursoconducir.IndexPage(indexContainer);
			index.start();
		});
	} 
};

$(function() {
	cursoconducir.index_init.onPageLoad(new goog.Uri(window.location));
});
