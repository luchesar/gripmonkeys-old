package org.bitbucket.cursodeconducir.fileupload;


import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.mocks.MockHttpServletRequest;
import org.bitbucket.cursodeconducir.mocks.MockHttpServletResponse;
import org.bitbucket.cursodeconducir.services.fileupload.BlobServe;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.tools.development.testing.LocalBlobstoreServiceTestConfig;

public class BlobServeTest {
    private LocalBlobstoreServiceTestConfig config = new LocalBlobstoreServiceTestConfig();
    private BlobServe blobServe;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private BlobstoreService blobstoreService;
    
    @Before
    public void setUp() throws Exception {
        config.setUp();
        blobServe = new BlobServe();
         blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        request = new MockHttpServletRequest();
        request.setProtocol("HTTP/1.1");
        response = new MockHttpServletResponse();
    }
    
    @After
    public void tearDown() throws Exception {
        config.tearDown();
    }
    
    @Test
    public void testDownload() throws Exception {
        String uploadUrl = blobstoreService.createUploadUrl("/");
        blobServe.service(request, response);
    }
    
    @Test
    public void testServeMissingFile() throws Exception {
        fail();
        
    }
    
    @Test
    public void testWrongRquest() throws Exception {
        fail();
    }
}
