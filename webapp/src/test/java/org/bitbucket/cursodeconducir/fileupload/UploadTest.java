package org.bitbucket.cursodeconducir.fileupload;

import static junit.framework.Assert.*;

import org.bitbucket.cursodeconducir.services.fileupload.Upload;
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
    }
    
    @Test
    public void testUploadMultipleFiles() throws Exception {
    }
    
    
    public void testUploadBrokenStream() throws Exception {
    }
}
