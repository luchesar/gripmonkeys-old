goog.require('cursoconducir.ImageUpload');
goog.require('cursoconducir.MockXmlHttpRequest');
goog.require('cursoconducir.MockFile');

goog.require('goog.string');
goog.require('goog.testing');
goog.require('goog.array');

/** @type {jQuery}*/
var parentContainer;
/** @type {jQuery}*/
var testImage;

/** @type {cursoconducir.ImageUpload}*/
var iu;

/** @type {goog.testing.PropertyReplacer}*/
var stubs = new goog.testing.PropertyReplacer();
/** @type {Array.<File>}*/
var uploadedFiles = [];
/** @type {cursoconducir.MockXmlHttpRequest}*/
var mockXHR;

/** @type {jQuery}*/
var imageModal;
/** @type {jQuery}*/
var modalImage;
/** @type {jQuery}*/
var fileToUpload;
/** @type {jQuery}*/
var fileSize;
/** @type {jQuery}*/
var fileName;
/** @type {jQuery}*/
var fileType;
/** @type {jQuery}*/
var progressNumber;
/** @type {jQuery}*/
var doneButton;
/** @type {jQuery}*/
var cancelButton;
/** @type {jQuery}*/
var closeButton;

/** @type {cursoconducir.MockFile}*/
var file1;
/** @type {cursoconducir.MockFile}*/
var file2;

function setUpPage() {
	$('body').append("<div id='parentContainer'/>");
	$('body').append("<img src='original/src' id='testImage'/>");
}

function setUp() {
    file1 = new cursoconducir.MockFile('file1.txt', '.txt', 123456);
	file2 = new cursoconducir.MockFile('file2.js', '.js', 765432);

	parentContainer = $('#parentContainer');
	testImage = $('#testImage');
	 
	mockXHR = new cursoconducir.MockXmlHttpRequest();
	parentContainer.empty();
	testImage.attr('src', 'original/src');
	mockXHR.clear();
	iu = new cursoconducir.ImageUpload(parentContainer);
}

function tearDown()  {
	$('[id="upload-image-modal"]').remove();
}

function testEditInitial() {
	iu.edit(testImage);
	resetElements();
	assertEquals(1, imageModal.length);
	
	assertEquals(testImage.attr('src'), modalImage.attr('src'));
	assertEquals('', fileSize.html());
	assertEquals('', fileName.html());
	assertEquals('', fileType.html());
	assertEquals('', progressNumber.html());
}

function testEditTwice() {
	iu.edit(testImage);
	resetElements();
	assertEquals(1, imageModal.length);
	
	var iu1 = new cursoconducir.ImageUpload(parentContainer);
	iu1.edit(testImage);
	resetElements();
	assertEquals(1, imageModal.length);
}

function testEditSellection() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	resetElements();
	assertEquals('Name: '+ file1.name, fileName.html());
	assertEquals('Type: '+ file1.type, fileType.html());
	assertEquals('Size: 120.56KB', fileSize.html());
	
}

function testEditProgress() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var event = {};
	event.lengthComputable = true;
	event.loaded = 313;
	event.total = 1000;
	mockXHR.doUploadProgress(event);
	
	resetElements();
	assertEquals('Name: '+ file1.name, fileName.html());
	assertEquals('Type: '+ file1.type, fileType.html());
	assertEquals('Size: 120.56KB', fileSize.html());
	assertEquals('31%', progressNumber.html());
	
	event.loaded = 656;
	mockXHR.doUploadProgress(event);
	assertEquals('Name: '+ file1.name, fileName.html());
	assertEquals('Type: '+ file1.type, fileType.html());
	assertEquals('Size: 120.56KB', fileSize.html());
	assertEquals('66%', progressNumber.html());
}

function testEditProgressUncomputable() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var event = {};
	event.lengthComputable = false;
	event.loaded = 313;
	event.total = 1000;
	mockXHR.doUploadProgress(event);
	
	resetElements();
	assertEquals('Name: '+ file1.name, fileName.html());
	assertEquals('Type: '+ file1.type, fileType.html());
	assertEquals('Size: 120.56KB', fileSize.html());
	
	assertEquals('unable to compute', progressNumber.html());
}
	

function testEditLoad() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var imageKey = "theImageKey";
	
	mockXHR.doLoad(getEventWithKey(imageKey));
	resetElements();
	
	assertEquals("no-cache", mockXHR.requestHeaders.get("Cache-Control"));
	assertEquals("XMLHttpRequest", mockXHR.requestHeaders.get("X-Requested-With"));
	
	assertEquals('/image?key=' + imageKey + '&falback=/images/330x230.gif', 
			modalImage.attr('src'));
}

function getEventWithKey(imageKey) {
	var event = {};
	event.target = {};
	stubs.set(event.target, 'getResponseHeader', function(key) { 
				if ('key' == key) {
					return imageKey;
				}
			}) ;
	return event;
}

/*function testEditError() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	mockXHR.doError(event);
}

function testEditAbort() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	mockXHR.doAbort(event);
}

function testCancel() {
	var originalSrc = testImage.attr('src');
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var imageKey = "imageKey";
	mockXHR.doLoad(getEventWithKey(imageKey));
	resetElements();
	cancelButton.click();
	
	assertEquals(originalSrc, testImage.attr('src'));
}*/

function testClose() {
	var originalSrc = testImage.attr('src');
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var imageKey = "imageKey";
	mockXHR.doLoad(getEventWithKey(imageKey));
	resetElements();
	closeButton.click();
	
	assertEquals(originalSrc, testImage.attr('src'));	
}

function testDone() {
	iu.edit(testImage);
	stubs.set(iu, 'fileToUpload', [{files:[file1, file2]}]);
	iu.doFileChange(mockXHR);
	
	var imageKey = "imageKey";
	mockXHR.doLoad(getEventWithKey(imageKey));
	resetElements();
	doneButton.click();
	
	var downloadedImageUrl = '/image?key=' + imageKey + '&falback=/images/330x230.gif';
	assertEquals(downloadedImageUrl, testImage.attr('src'));
}

function resetElements() {
	imageModal = $('[id="upload-image-modal"]');
	
    modalImage = imageModal.find('#modalImage');
	fileToUpload = imageModal.find('#fileToUpload');
	
	fileSize = imageModal.find('#fileSize');
	fileName = imageModal.find('#fileName');
	fileType = imageModal.find('#fileType');
	progressNumber = imageModal.find('#progressNumber');
	
	doneButton = imageModal.find('#doneButton');
	cancelButton = imageModal.find('#imageUploadmodalCancelButton');
	closeButton = imageModal.find('a[class="close"]');
}