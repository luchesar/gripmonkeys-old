goog.require('goog.testing.jsunit');
goog.require('cursoconducir.MainMenu');

/** @type {jQuery}*/
var mainMenuContainer;
/** @type {cursoconducir.MainMenu}*/
var mainMenu;

function setUpPage() {
	$('body').append("<div id='mainMenuContainer'/>");
}

function setUp() {
	mainMenuContainer = $('#mainMenuContainer');
	mainMenuContainer.empty();
	mainMenu = new cursoconducir.MainMenu(mainMenuContainer);
}

function testShow() {
	/** @type {jQuery}*/
	var toolbarContainer = assertBasics();
	assertIndexLinks(toolbarContainer);
}

function testLinks() {
	/** @type {jQuery}*/
	var toolbarContainer = assertBasics();
	mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.LESSONS);
	assertAdminLinks(toolbarContainer, cursoconducir.MainMenu.ActiveAdminPage.LESSONS);
	mainMenu.showIndexLinks();
	assertIndexLinks(toolbarContainer);
}

function testActiveLinks() {
	/** @type {jQuery}*/
	var toolbarContainer = assertBasics();
	
	mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.COURSES);
	assertAdminLinks(toolbarContainer, cursoconducir.MainMenu.ActiveAdminPage.COURSES);
	
	mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.LESSONS);
	assertAdminLinks(toolbarContainer, cursoconducir.MainMenu.ActiveAdminPage.LESSONS);
	
	mainMenu.showAdminLinks(cursoconducir.MainMenu.ActiveAdminPage.QUESTIONS);
	assertAdminLinks(toolbarContainer, cursoconducir.MainMenu.ActiveAdminPage.QUESTIONS);
}

/**
 * @returns {jQuery}
 */
function assertBasics() {
	/** @type {jQuery}*/
	var toolbarContainer = mainMenuContainer.find('.topbar');
	assertTrue(goog.isDefAndNotNull(toolbarContainer[0]));
	/** @type {jQuery}*/
	var menuItemsContainer = toolbarContainer.find('[id="menuItems"]');
	assertTrue(goog.isDefAndNotNull(menuItemsContainer[0]));
	
	assertTrue(goog.isDefAndNotNull(toolbarContainer.find('img[src="/images/logo.png"]')));
	
	return toolbarContainer;
}

function assertIndexLinks(toolbarContainer) {
	/** @type {jQuery}*/
	var coursesLink = toolbarContainer.find('a[href="#courses"]');
	assertEquals("Cursos", coursesLink.html());
	/** @type {jQuery}*/
	var signInLink = toolbarContainer.find('a[href="#signin"]');
	assertEquals("Acceder", signInLink.html());
}

/**
 * @param {jQuery} toolbarContainer
 * @param {cursoconducir.MainMenu.ActiveAdminPage} active
 */
function assertAdminLinks(toolbarContainer, active) {
	/** @type {jQuery}*/
	var coursesLink = toolbarContainer.find('a[href="/admin/courses"]');
	assertEquals("Courses", coursesLink.html());
	if (cursoconducir.MainMenu.ActiveAdminPage.COURSES === active) {
		assertTrue(coursesLink.parent().hasClass('active'));
	}
	/** @type {jQuery}*/
	var lessonsLink = toolbarContainer.find('a[href="/admin/lessons"]');
	assertEquals("Lessons", lessonsLink.html());
	if (cursoconducir.MainMenu.ActiveAdminPage.LESSONS === active) {
		assertTrue(lessonsLink.parent().hasClass('active'));
	}
	/** @type {jQuery}*/
	var questionsLink = toolbarContainer.find('a[href="/admin/questions"]');
	assertEquals("Questions", questionsLink.html());
	if (cursoconducir.MainMenu.ActiveAdminPage.QUESTIONS === active) {
		assertTrue(questionsLink.parent().hasClass('active'));
	}
}