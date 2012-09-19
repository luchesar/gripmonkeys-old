goog.provide('cursoconducir.MockXmlHttpRequest');
goog.require('goog.structs.Map');
goog.require('goog.array');

/**
 * @public
 * @constructor
 * @extends {XMLHttpRequest}
 */
cursoconducir.MockXmlHttpRequest = function() {
};

goog.inherits(cursoconducir.MockXmlHttpRequest, XMLHttpRequest);

/**
 * @public
 * @type {Object}
 * @override
 */
cursoconducir.MockXmlHttpRequest.prototype.upload = new cursoconducir.MockXmlHttpRequest();

/**
 * @private
 * @type {goog.structs.Map}
 */
cursoconducir.MockXmlHttpRequest.prototype.listeners = new goog.structs.Map();

/**
 * @public
 * @type {goog.structs.Map}
 */
cursoconducir.MockXmlHttpRequest.prototype.bools = new goog.structs.Map();

/**
 * @public
 * @type {goog.structs.Map}
 */
cursoconducir.MockXmlHttpRequest.prototype.openedcalls = new goog.structs.Map();

/**
 * @public
 * @type {goog.structs.Map}
 */
cursoconducir.MockXmlHttpRequest.prototype.requestHeaders = new goog.structs.Map();

/**
 * @public
 * @type {Array.<FormData>}
 */
cursoconducir.MockXmlHttpRequest.prototype.sentFormDatas = [];

/**
 * @public
 */
cursoconducir.MockXmlHttpRequest.prototype.status;

/**
 * @public
 * @param {string} eventType
 * @param {Function} eventListener
 * @param {boolean} b
 */
cursoconducir.MockXmlHttpRequest.prototype.addEventListener = function(eventType, eventListener, b) {
	this.listeners.set(eventType, eventListener);
	this.bools.set(eventType, b);
};

/**
 * @public
 * @override
 * @param {string} key
 * @param {string} value
 */
cursoconducir.MockXmlHttpRequest.prototype.setRequestHeader = function(key, value) {
	this.requestHeaders.set(key, value);
};

/**
 * @public
 * @override
 * @param {FormData} fd
 */
cursoconducir.MockXmlHttpRequest.prototype.send = function(fd) {
	goog.array.insert(this.sentFormDatas, fd);
};

/**
 * @public
 * @override
 * @param {string} method
 * @param {string} url
 */
cursoconducir.MockXmlHttpRequest.prototype.open = function(method, url) {
	this.openedcalls.set(method, url);
};

/**
 * @public
 */
cursoconducir.MockXmlHttpRequest.prototype.clear = function() {
	this.listeners.clear();
	this.bools.clear();
	this.openedcalls.clear();
	goog.array.clear(this.sentFormDatas);
};

/**
 * @public
 * @return {boolean}
 */
cursoconducir.MockXmlHttpRequest.prototype.doLoad = function(event) {
	var loadListener = this.listeners.get('load');
	if (goog.isDefAndNotNull(loadListener)) {
		loadListener(event);
		return true;
	}
	return false;
};

/**
 * @public
 * @return {boolean}
 */
cursoconducir.MockXmlHttpRequest.prototype.doError = function(event) {
	var listener = listeners.get('error');
	if (goog.isDefAndNotNull(listener)) {
		listener(event);
		return true;
	}
	return false;
};

/**
 * @public
 * @return {boolean}
 */
cursoconducir.MockXmlHttpRequest.prototype.doAbort = function(event) {
	var listener = listeners.get('abort');
	if (goog.isDefAndNotNull(listener)) {
		listener(event);
		return true;
	}
	return false;
};

/**
 * @public
 * @return {boolean}
 */
cursoconducir.MockXmlHttpRequest.prototype.doUploadProgress = function(event) {
	var listener = this.upload.listeners.get('progress');
	if (goog.isDefAndNotNull(listener)) {
		listener(event);
		return true;
	}
	return false;
};


