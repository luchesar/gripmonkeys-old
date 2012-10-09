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
	mainMenu.showAdminLinks();
	assertAdminLinks(toolbarContainer);
	mainMenu.showIndexLinks();
	assertIndexLinks(toolbarContainer);
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

function assertAdminLinks(toolbarContainer) {
	/** @type {jQuery}*/
	var coursesLink = toolbarContainer.find('a[href="/admin/courses"]');
	assertEquals("Courses", coursesLink.html());
	/** @type {jQuery}*/
	var signInLink = toolbarContainer.find('a[href="/admin/lessons"]');
	assertEquals("Lessons", signInLink.html());
	/** @type {jQuery}*/
	var signInLink = toolbarContainer.find('a[href="/admin/questions"]');
	assertEquals("Questions", signInLink.html());
}