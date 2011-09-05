package org.bitbucket.cursodeconducir.services.fileupload;

import static junit.framework.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class UploadTest {
    private Upload upload;


    @Before
    public void setUp() throws Exception {
        upload = new Upload();
    }
    
    @Test
    public void testUploadSingleFile() throws Exception {
        upload.doPost(req, res);
    }
    
    @Test
    public void testUploadMultipleFiles() throws Exception {
        fail();
    }
    
    
    public void testUploadBrokenStream() throws Exception {
        fail();
    }
}
