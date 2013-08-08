goog.provide('cursoconducir.dialogs');

goog.require('cursoconducir.template.dialogs');
goog.require('bootstrap.modal');


/**
 * @typedef {function(string)}
 */
cursoconducir.dialogs.buttonsCb;

/**
 * @typedef {function(boolean)}
 */
cursoconducir.dialogs.confirmCb;

/**
 * @public
 * @param {string} title
 * @param {string} info
 * @return {jQuery} the dialogs container jquery 
 */
cursoconducir.dialogs.info = function(title, info) {
	return cursoconducir.dialogs.buttons("cursoconducir-dialog-info", title,
			"/images/dialogs/info.jpg", info, ["Close"]);
};

/**
 * @public
 * @param {string} title
 * @param {string} info
 * @return {jQuery} the dialogs container jquery 
 */
cursoconducir.dialogs.warn = function(title, info) {
	return cursoconducir.dialogs.buttons("cursoconducir-dialog-warn", title,
			"/images/dialogs/warn.jpg", info, ["Close"]);
};

/**
 * @public
 * @param {string} title
 * @param {string} info
 * @return {jQuery} the dialogs container jquery 
 */
cursoconducir.dialogs.error = function(title, info) {
	return cursoconducir.dialogs.buttons("cursoconducir-dialog-error", title,
			"/images/dialogs/error.jpg", info, ["Close"]);
};

/**
 * @public
 * @param {string} title
 * @param {string} info
 * @param {cursoconducir.dialogs.confirmCb} callBack
 * @return {jQuery} the dialogs container jquery 
 */
cursoconducir.dialogs.confirm = function(title, info, callBack) {
	return cursoconducir.dialogs.buttons("cursoconducir-dialog-confirm", title,
			"/images/dialogs/confirm.jpg", info, ["Yes", "No"],
				/** @type {cursoconducir.dialogs.buttonsCb}*/
				function(buttonText) {
					if ("Yes" === buttonText) {
						callBack(true);
					} else {
						callBack(false);
					}
				}
			);
};

/**
 * @public
 * @param {string} dialogId
 * @param {string} title
 * @param {string} imageUrl
 * @param {string} info
 * @param {Array.<string>} buttons
 * @param {cursoconducir.dialogs.buttonsCb=} callBack
 * @return {jQuery} the dialogs container jquery 
 */
cursoconducir.dialogs.buttons = function(dialogId, title, imageUrl, info, buttons, callBack) {
	var modalContainer = $('#' + dialogId);
	if (!goog.isDefAndNotNull(modalContainer[0])) {
		/** @type {string}*/
		var html = cursoconducir.template.dialogs.buttons({
			dialogId : dialogId,
			title : title,
			image : imageUrl,
			message : info,
			buttons : buttons
		});
		$('body').append(html);
		modalContainer = $('#' + dialogId);
	}
	
	modalContainer.modal({ keyboard : true, backdrop : false, show : true });
	$(buttons).each(function() {
		var buttonJQ = modalContainer.find('#button' + this);
		buttonJQ.click(function() {
			if (goog.isDefAndNotNull(callBack)) {
				callBack(buttonJQ.text());
			}
			modalContainer.hide();
		});
	});
	return modalContainer;
};