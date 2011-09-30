package org.bitbucket.cursodeconducir.fileupload;

import static junit.framework.Assert.*;

import java.io.File;
import java.util.HashMap;

import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.mocks.MockHttpServletRequest;
import org.bitbucket.cursodeconducir.mocks.MockHttpServletResponse;
import org.bitbucket.cursodeconducir.services.fileupload.BlobServe;
import org.bitbucket.cursodeconducir.services.fileupload.Upload;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.repackaged.com.google.common.collect.Maps;
import com.google.appengine.tools.development.testing.LocalBlobstoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;

public class BlobStoreUploadAndServeTest {
    private final LocalServiceTestHelper helper =
        new LocalServiceTestHelper(new LocalBlobstoreServiceTestConfig());
    private BlobServe blobServe;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private BlobstoreService blobstoreService;
    private Upload upload;

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        upload = new Upload();
        blobServe = new BlobServe();
        blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        request = new MockHttpServletRequest();
        request.setProtocol("HTTP/1.1");
        response = new MockHttpServletResponse();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @Test
    public void testUploadDownload() throws Exception {
        String uploadUrl = blobstoreService.createUploadUrl("/upload");
        request.setMethod("POST");
        request.setPathInfo(uploadUrl);
        request.setContent("test content");
        request.setContentType("multipart/form-data");
        HashMap<Object, Object> files = Maps.newHashMap();
        files.put("myFile", "PSSF6c2mfkdAMfdlwqmUTQ");
        request.setAttribute("com.google.appengine.api.blobstore.upload.blobkeys", files);
        
        upload.service(request, response);
        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
    }

    @Test
    public void testServeMissingFile() throws Exception {
        fail();

    }
}
