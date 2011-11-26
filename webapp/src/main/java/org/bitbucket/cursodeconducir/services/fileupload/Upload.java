package org.bitbucket.cursodeconducir.services.fileupload;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.storage.TestStorage;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.gson.Gson;

@SuppressWarnings("serial")
public class Upload extends HttpServlet {
    private static final String UPLOAD_PATH = "/upload";
    private static final String UPLOAD_PATH_KEY = "uploadCallback";

    public void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException,
            IOException {
        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        Map<String, BlobKey> blobs = blobstoreService.getUploadedBlobs(req);
        
        res.setHeader(UPLOAD_PATH_KEY, blobstoreService.createUploadUrl(UPLOAD_PATH));
        for (Map.Entry<String, BlobKey> blob : blobs.entrySet()) {
            res.setHeader(blob.getKey(), blob.getValue().getKeyString());
        }
        
    }
}
