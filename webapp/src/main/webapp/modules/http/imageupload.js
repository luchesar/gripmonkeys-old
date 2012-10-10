goog.provide('cursoconducir.ImageUpload');
goog.require('formdata');
goog.require('cursoconducir.template.imageupload');
goog.require('bootstrap.modal');

/**
 * @public
 * @constructor
 * @param {jQuery} parentContainer
 */
cursoconducir.ImageUpload = function(parentContainer) {
	this.uploadImageModalContainer = parentContainer;
};

/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.modalContainer;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.imageElementToSet;
/**
 * @private
 * @type {function(string)}
 */
cursoconducir.ImageUpload.prototype.uploadedImageIdCallback;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.modalImage;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.imageFileName;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.imageFileSize;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.imageFileType;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.imageUploadProgress;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.doneButton;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.cancelButton;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.fileToUpload;
/**
 * @private
 * @type {string}
 */
cursoconducir.ImageUpload.prototype.imageKey;
/**
 * @private
 * @type {jQuery}
 */
cursoconducir.ImageUpload.prototype.uploadImageModalContainer;

/**
 * @public
 * @param {jQuery} imageElementToSet  the image element that is going to be edited  
 * @param {function(string)=} uploadedImageIdCallback
 */ 
cursoconducir.ImageUpload.prototype.edit = function(imageElementToSet, uploadedImageIdCallback) { 
	this.imageElementToSet = imageElementToSet;
	if (goog.isDefAndNotNull(uploadedImageIdCallback)) {
		this.uploadedImageIdCallback = uploadedImageIdCallback;
	}
    this.resetFileToUploadContainer();
    this.modalImage.attr('src', imageElementToSet.attr('src').toString());
    this.modalContainer.modal({ keyboard : true, backdrop : false, show : true });
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.resetFileToUploadContainer = function() {
	this.modalContainer = $('[id="upload-image-modal"]');
	if (this.modalContainer.length < 1) {
	/** @type {string} */
		var uploadImageModalHtml = cursoconducir.template.imageupload.modal();
		this.uploadImageModalContainer.html(uploadImageModalHtml);
		this.modalContainer = $('[id="upload-image-modal"]');
	}
	
	this.modalImage = this.uploadImageModalContainer.find('#modalImage');
	this.doneButton = this.uploadImageModalContainer.find('#doneButton');
	this.cancelButton = this.uploadImageModalContainer.find('#imageUploadmodalCancelButton');
	this.fileToUpload = this.uploadImageModalContainer.find('#fileToUpload');
	
	this.imageFileName = this.uploadImageModalContainer.find('#fileName');
	this.imageFileSize = this.uploadImageModalContainer.find('#fileSize');
	this.imageFileType = this.uploadImageModalContainer.find('#fileType');
	this.imageUploadProgress = this.uploadImageModalContainer.find('#progressNumber');
	var that = this;
	this.doneButton.click(function() {
		that.imageElementToSet.attr('src', that.modalImage.attr('src').toString());
		that.modalContainer.hide();
	});
	this.cancelButton.click(function() {
		that.modalContainer.hide();
	});

	this.fileToUpload.change(function() {
		that.doFileChange(new XMLHttpRequest());
	});
	$('#uploadForm')[0].reset();
};

/**
 * @private
 * @param {XMLHttpRequest} xhr
 */
cursoconducir.ImageUpload.prototype.doFileChange = function(xhr) {
	this.fileSelected();
	this.uploadFile(xhr);
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.fileSelected = function() {
	/** @type {File}*/
	var file = this.fileToUpload[0].files[0];
	if (goog.isDefAndNotNull(file)) {
		/** @type {number|string}*/
		var fileSize = 0;
		if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

		this.imageFileName.html('Name: ' + file.name);
		this.imageFileSize.html('Size: ' + fileSize);
		this.imageFileType.html('Type: ' + file.type);
	}
};

/**
 * @private
 * @param {XMLHttpRequest} xhr
 */
cursoconducir.ImageUpload.prototype.uploadFile = function(xhr) {
	/** @type {File}*/
	var firstFileToUpload = this.fileToUpload[0].files[0];
	/** @type {FormData} */
	var fd = new FormData();
	fd.append("fileToUpload", firstFileToUpload);
	
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	
	var that = this;
	xhr.upload.addEventListener("progress", function(e){that.uploadProgress(e);}, false);
	xhr.addEventListener("load", function(e){that.uploadComplete(e);}, false);
	xhr.addEventListener("error", function(e){that.uploadFailed(e);}, false);
	xhr.addEventListener("abort", function(e){that.uploadCanceled(e);}, false);
	xhr.open("POST", "/image");
	xhr.send(fd);
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.uploadProgress = function(evt) {
	if (evt.lengthComputable) {
		/** @type {number} */
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		this.imageUploadProgress.html(percentComplete.toString() + '%');
	} else {
		this.imageUploadProgress.html('unable to compute');
	}
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.uploadComplete = function(evt) {
	this.imageKey = evt.target.getResponseHeader('key');
	/** @type {string} */
	var imageUrl = '/image?key=' + this.imageKey + '&falback=/images/330x230.gif';

	this.modalImage.attr('src', imageUrl);
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.uploadFailed = function(evt) {
	alert("There was an error attempting to upload the file.");
};

/**
 * @private
 */
cursoconducir.ImageUpload.prototype.uploadCanceled = function(evt) {
	alert("The upload has been canceled by the user or the browser dropped the connection.");
};
