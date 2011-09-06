package org.bitbucket.cursodeconducir.services.fileupload;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

@SuppressWarnings("serial")
public class BlobServe extends HttpServlet {
    public static final String BLOB_KEY = "blob-key";
    public static final String BLOB_CONTEXT_KEY = "blob";

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        BlobKey blobKey = new BlobKey(req.getParameter(BLOB_KEY));
        blobstoreService.serve(blobKey, res);
    }
}