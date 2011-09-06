package org.bitbucket.cursodeconducir.fileupload;

import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.services.fileupload.Upload;
import org.junit.Before;
import org.junit.Test;

import com.ontologypartners.mocks.servlet.MockHttpServletRequest;
import com.ontologypartners.mocks.servlet.MockHttpServletResponse;

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
    }
    
    @Test
    public void testUploadMultipleFiles() throws Exception {
    }
    
    
    public void testUploadBrokenStream() throws Exception {
    }
}
