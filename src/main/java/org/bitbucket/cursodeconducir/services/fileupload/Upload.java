package org.bitbucket.cursodeconducir.services.fileupload;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

@SuppressWarnings("serial")
public class Upload extends HttpServlet {
    private static final String FILE_PROP = "myFile";
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException,
            IOException {

        Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
        BlobKey blobKey = blobs.get(FILE_PROP);

        if (blobKey == null) {
            res.sendRedirect("/");
        } else {
            res.sendRedirect("" + BlobServe.BLOB_CONTEXT_KEY +"?" + BlobServe.BLOB_KEY
                    + blobKey.getKeyString());
        }
    }
}