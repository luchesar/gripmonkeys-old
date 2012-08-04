package org.bitbucket.cursodeconducir.services.fileupload;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.files.AppEngineFile;
import com.google.appengine.api.files.FileService;
import com.google.appengine.api.files.FileServiceFactory;
import com.google.appengine.api.files.FileWriteChannel;
import com.google.appengine.api.files.FinalizationException;
import com.google.appengine.api.files.LockException;
import com.google.appengine.api.images.Image;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.Transform;

@SuppressWarnings("serial") 
public class ImageServlet extends HttpServlet {
    private static final String IMAGE_KEY = "key";
    private static final String FALBACK_URL_KEY = "falback";
    private static final String SIZE_KEY = "s";

    private static final ImagesService imagesService = ImagesServiceFactory.getImagesService();
    private static final FileService fileService = FileServiceFactory.getFileService();
    private static final float IMAGE_WIDTH = 320f;
    private static final float IMAGE_HEIGHT = 420f;

    @Override
    protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        String imageBlobKey = aReq.getParameter(IMAGE_KEY);
        String size = aReq.getParameter(SIZE_KEY);
        BlobKey blobKey = new BlobKey(imageBlobKey);

        try {
            if (size != null) {
                aResp.sendRedirect(imagesService.getServingUrl(blobKey, Integer.parseInt(size),
                        false));
            } else {
                aResp.sendRedirect(imagesService.getServingUrl(blobKey));
            }
        } catch (IllegalArgumentException e) {
            String falbackUrl = aReq.getParameter(FALBACK_URL_KEY);
            if (falbackUrl != null) {
                aResp.sendRedirect(falbackUrl);
            }
        }
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException,
            IOException {
        try {
            if (ServletFileUpload.isMultipartContent(req)) {
                ServletFileUpload uploader = new ServletFileUpload();
                FileItemIterator items = uploader.getItemIterator(req);

                while (items.hasNext()) {
                    FileItemStream next = items.next();
                    if (!next.isFormField()) {
                        InputStream stream = next.openStream();
                        try {
                            extractImage(res, next, stream);
                        } finally {
                            IOUtils.closeQuietly(stream);
                        }
                    }
                }

            } else {
                throw new ServletException("The request is not multipart request");
            }
        } catch (FileUploadException e) {
            throw new ServletException(e);
        }
    }

    private void extractImage(HttpServletResponse res, FileItemStream next, InputStream stream)
            throws IOException, FileNotFoundException, FinalizationException, LockException {
        byte[] byteArray = IOUtils.toByteArray(stream);
        Image image = ImagesServiceFactory.makeImage(byteArray);
        float width = image.getWidth();
        float height = image.getHeight();

        float widthRatio = IMAGE_WIDTH / width;
        float heightRatio = IMAGE_HEIGHT / height;
        if (widthRatio > 1 && heightRatio > 1) {
            writeImage(image, next.getFieldName(), res);
            return;
        }
        float ratio = Math.min(widthRatio, heightRatio);
        int resizeWidth = Math.round(width * ratio);
        int resizeHeight = Math.round(height * ratio);

        Transform resize = ImagesServiceFactory.makeResize(resizeWidth, resizeHeight);
        Image resizedImage = imagesService.applyTransform(resize, image);

        writeImage(resizedImage, next.getFieldName(), res);
    }

    private BlobKey writeImage(Image image, String imageName, HttpServletResponse res)
            throws IOException, FileNotFoundException, FinalizationException, LockException {
        AppEngineFile file = fileService.createNewBlobFile("image/" + image.getFormat().name());
        FileWriteChannel writeChannel = fileService.openWriteChannel(file, true);
        writeChannel.write(ByteBuffer.wrap(image.getImageData()));
        writeChannel.closeFinally();

        BlobKey blobKey = fileService.getBlobKey(file);
        res.setHeader(imageName, blobKey.getKeyString());
        res.setHeader(IMAGE_KEY, blobKey.getKeyString());
        return blobKey;
    }
}
