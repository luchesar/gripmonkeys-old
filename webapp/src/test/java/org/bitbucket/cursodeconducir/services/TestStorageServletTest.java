package org.bitbucket.cursodeconducir.services;

import static junit.framework.Assert.*;

import java.util.Iterator;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.entity.Test;
import org.bitbucket.cursodeconducir.services.storage.TestStorage;
import org.junit.After;
import org.junit.Before;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class TestStorageServletTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    protected TestStorage storage;
    protected TestStorageServlet servlet;

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        servlet = new TestStorageServlet();
        storage = servlet.getStorage();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @org.junit.Test
    public void testStore() throws Exception {
        Test test1 = new Test("title", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        
    }

    @org.junit.Test
    public void testStoreBatch() throws Exception {
        Test test1 = new Test("title1", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("title2", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test3 = new Test("title3", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test4 = new Test("title4", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
    }

    public void testStoreSameTitle() throws Exception {
    }

    @org.junit.Test
    public void testUpdate() throws Exception {
        Test test1 = new Test("title", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        test1 = storage.put(test1).iterator().next();
        test1.setTitleImage("new Image");
        storage.put(test1);

        assertEquals(Sets.newHashSet(test1), storage.get(test1.getId()));
        assertEquals(Lists.newArrayList(test1), storage.getAll());
    }

    @org.junit.Test
    public void testStoreAndGetMultiple() throws Exception {
        Test test1 = new Test("test1", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("test2", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2);
        assertEquals(Lists.newArrayList(test1, test2), storage.getAll());

        storage.delete(test1.getId());
        assertEquals(Lists.newArrayList(test2), storage.getAll());
        storage.delete(test2.getId());
        assertEquals(Lists.newArrayList(), storage.getAll());
    }

    @org.junit.Test
    public void testFindByTitle() throws Exception {
        Test test1 = new Test("test1", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("test2", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2);

        assertEquals(test1, storage.find(test1.getTitle()));
        assertEquals(test2, storage.find(test2.getTitle()));

        assertNull(storage.find("missing title"));
    }

    @org.junit.Test
    public void testFindMultipleByTitle() throws Exception {
        Test test1 = new Test("title1", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("title2", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test3 = new Test("title3", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test4 = new Test("title4", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2, test3, test4);

        assertEquals(Lists.newArrayList(test2, test4),
                storage.find(test2.getTitle(), test4.getTitle()));
        assertEquals(Lists.newArrayList(test1, test3),
                storage.find(test1.getTitle(), test3.getTitle()));
        assertEquals(Lists.newArrayList(), storage.find("missing title", "missingTitle2"));
    }

    @org.junit.Test
    public void testFindMissingTitle() throws Exception {
        assertNull(storage.find("missing title"));
    }

    @org.junit.Test
    public void testDeleteBatch() throws Exception {
        Test test1 = new Test("test1", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("test2", "image1", "description1", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2);
        assertEquals(Lists.newArrayList(test1, test2), storage.getAll());

        storage.delete(test1.getId(), test2.getId());
        assertEquals(Lists.newArrayList(), storage.getAll());
    }

    @org.junit.Test
    public void testDeleteMissingId() throws Exception {
        storage.delete(1000);
        storage.delete(1001);
    }

    @org.junit.Test
    public void testGetAllOffsetLimit() throws Exception {
        Test test1 = new Test("title1", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("title2", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test3 = new Test("title3", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test4 = new Test("title4", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2, test3, test4);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll(0, 4));
        assertEquals(Lists.newArrayList(test2, test3, test4), storage.getAll(1, 3));
        assertEquals(Lists.newArrayList(test2, test3), storage.getAll(1, 2));
        assertEquals(Lists.newArrayList(test3), storage.getAll(2, 1));
    }

    @org.junit.Test
    public void testBatchGet() throws Exception {
        Test test1 = new Test("title1", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test2 = new Test("title2", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test3 = new Test("title3", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));
        Test test4 = new Test("title4", "image", "description", Lists.newArrayList("question1",
                "question2"), 0, "explanation", Lists.newArrayList("image1", "image2"));

        storage.put(test1, test2, test3, test4);
        assertEquals(
                Lists.newArrayList(test1, test2, test3, test4),
                Lists.newArrayList(storage.get(test1.getId(), test2.getId(), test3.getId(),
                        test4.getId())));
        assertEquals(
                Lists.newArrayList(test4, test2, test3, test1),
                Lists.newArrayList(storage.get(test4.getId(), test2.getId(), test3.getId(),
                        test1.getId())));
        assertEquals(Lists.newArrayList(test2, test3, test4),
                Lists.newArrayList(storage.get(test2.getId(), test3.getId(), test4.getId())));
        assertEquals(Lists.newArrayList(test3, test4),
                Lists.newArrayList(storage.get(test3.getId(), test4.getId())));
    }
}
