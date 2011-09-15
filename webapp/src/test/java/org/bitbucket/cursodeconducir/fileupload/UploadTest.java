package org.bitbucket.cursodeconducir.fileupload;

import static junit.framework.Assert.*;

import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.fileupload.Upload;
import org.junit.Before;
import org.junit.Test;

import org.bitbucket.cursodeconducir.mocks.MockHttpServletRequest;
import org.bitbucket.cursodeconducir.mocks.MockHttpServletResponse;

public class UploadTest {
    private Upload upload;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @Before
    public void setUp() throws Exception {
        upload = new Upload();
        request = new MockHttpServletRequest();
        request.setProtocol("HTTP/1.1");
        response = new MockHttpServletResponse();
    }
    
    @Test
    public void testUploadSingleFile() throws Exception {
        request.setMethod("PUT");
        request.setPathInfo("/upload/");
        request.setContentType("text/plain");
        request.setParameter("fileName", "file1");
        request.setContent("file content");
        upload.doPost(request, response);
        
        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
    }
    
    @Test
    public void testUploadMultipleFiles() throws Exception {
        fail();
    }
    
    
    public void testUploadBrokenStream() throws Exception {
        fail();
    }
    
    public void testDelete() throws Exception {
        fail();
    }
}
