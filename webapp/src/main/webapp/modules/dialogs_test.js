goog.require('goog.testing.jsunit');
goog.require('cursoconducir.dialogs');

/** @type {jQuery}*/
var parentContainer;
/** @type {jQuery}*/
var dialogContainer;
/** @type {jQuery}*/
var dialogsButtons;
/** @type {jQuery}*/
var modalHeader;
/** @type {jQuery}*/
var modalFooter;
/** @type {jQuery}*/
var imageLink;
/** @type {jQuery}*/
var dialogImage;
/** @type {jQuery}*/
var message;
/** @type {Object.<string, jQuery>}*/
var buttons;

function setUp() {
	$('#parentContainer').remove();
	$('[id="cursoconducir-dialogs-buttons"]').remove();
	$('body').append("<div id='parentContainer'/>");
	parentContainer = $('#parentContainer');
}

function testInfo() {
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var dc = cursoconducir.dialogs.info("infoDialogTitle", messageHtml);
	// TODO assert visible
	init(dc.attr('id'), ['Close']);
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/images/dialogs/info.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	assertEquals(1, dc.find('.btn').length);
	buttons['Close'].click();
	// TODO assert not visible
}

function testWarn() {
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var dc = cursoconducir.dialogs.warn("infoDialogTitle", messageHtml);
	// TODO assert visible
	init(dc.attr('id'), ['Close']);
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/images/dialogs/warn.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	assertEquals(1, dc.find('.btn').length);
	buttons['Close'].click();
	// TODO assert not visible
}

function testError() {
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var dc = cursoconducir.dialogs.error("infoDialogTitle", messageHtml);
	// TODO assert visible
	init(dc.attr('id'), ['Close']);
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/images/dialogs/error.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	assertEquals(1, dc.find('.btn').length);
	buttons['Close'].click();
	// TODO assert not visible
}

function testConfirmOk() {
	var confirmed = undefined;
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var dc = cursoconducir.dialogs.confirm("infoDialogTitle", messageHtml, function(buttonPressed) {
		confirmed = buttonPressed;
	});
	// TODO assert visible
	init(dc.attr('id'), ['Yes', 'No']);
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/images/dialogs/confirm.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	assertEquals(2, dc.find('.btn').length);
	buttons['Yes'].click();
	// TODO assert not visible
	assertTrue(confirmed);
}

function testConfirmNotOk() {
	var confirmed = undefined;
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var dc = cursoconducir.dialogs.confirm("infoDialogTitle", messageHtml, function(buttonPressed) {
		confirmed = buttonPressed;
	});
	// TODO assert visible
	init(dc.attr('id'), ['Yes', 'No']);
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/images/dialogs/confirm.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	assertEquals(2, dc.find('.btn').length);
	buttons['No'].click();
	// TODO assert not visible
	assertFalse(confirmed);
}

function testButtons() {
	doTest(["a", "b", "c"], 0);
	doTest(["a", "b", "c"], 1);
	doTest(["a", "b", "c"], 2);
}

function doTest(buttonNames, clickOnButtonIndex) {
	var dialogId = "testButtonsDialogId";
	var messageHtml = "<div id=\"buttonsContent\">buttonsContent</div>";
	var pressedButton = null;
	
	var rDialogContainer = cursoconducir.dialogs.buttons(
			dialogId, "buttonsTitle", "/image.jpg",messageHtml, buttonNames, 
			function(buttonPressed) {
				pressedButton = buttonPressed;
			});
	// TODO: assert visible
	init(dialogId, buttonNames);
	assertEquals(1, dialogContainer.length);
	assertEquals(dialogContainer.html(), rDialogContainer.html());
	assertEquals("buttonsTitle", modalHeader.text());
	assertTrue(goog.isDefAndNotNull(imageLink));
	assertUndefined(imageLink.attr('href'));
	assertEquals("/image.jpg", dialogImage.attr('src'));
	assertEquals(messageHtml, message.html());
	for (var i = 0; i < buttonNames.length; i++) {
		assertEquals(buttonNames[i], buttons[buttonNames[i]].text());
	}
	
	buttons[buttonNames[clickOnButtonIndex]].click();
	
	assertEquals(buttonNames[clickOnButtonIndex], pressedButton);
	// TODO: assert not visible
}

/**
 * @param {string} dialogId
 * @param {Array.<string>} buttons
 */
function init(dialogId, buttonNames) {
	dialogContainer = $('[id="' + dialogId + '"]');
	modalHeader = dialogContainer.find('.modal-header').find('h3');
	modalFooter = dialogContainer.find('.modal-footer');
	imageLink = dialogContainer.find('#imageLink');
	dialogImage = dialogContainer.find('#dialog-image');
	message = dialogContainer.find('#message'); 
	buttons = {};
	$(buttonNames).each(function() {
		buttons[this] = modalFooter.find('#button' + this); 
	});
};
