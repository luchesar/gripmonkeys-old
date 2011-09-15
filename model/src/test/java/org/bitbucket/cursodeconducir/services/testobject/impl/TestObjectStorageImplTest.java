package org.bitbucket.cursodeconducir.services.testobject.impl;

import static com.google.appengine.api.datastore.FetchOptions.Builder.*;
import static junit.framework.Assert.*;

import java.util.Arrays;

import org.bitbucket.cursodeconducir.services.testobject.TestObjectStorage;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.repackaged.com.google.common.collect.Sets;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.googlecode.objectify.ObjectifyFactory;

public class TestObjectStorageImplTest {
    protected ObjectifyFactory fact;
    
    /** */
    private final LocalServiceTestHelper helper =
                    new LocalServiceTestHelper(
                                    new LocalDatastoreServiceTestConfig(),
                                    new LocalMemcacheServiceTestConfig(),
                                    new LocalTaskQueueTestConfig());
    
    private final TestObjectStorage storage = new TestObjectStorageImpl();
    private DatastoreService ds;

    @Before
    public void setUp() {
        helper.setUp();
        ds = DatastoreServiceFactory.getDatastoreService();
    }

    @After
    public void tearDown() {
        helper.tearDown();
    }

    @Test
    public void testStoreLoadDelete() throws Exception {
        assertEntityCount(0, 0);
        TestObjectImpl testObject1 = new TestObjectImpl("tite", "This is test one", Arrays.asList(
                "answer1", "answer2", "answer3"), 2);
        TestObjectImpl testObject2 = new TestObjectImpl("tite2", "This is test two", Arrays.asList(
                "answer21", "answer22", "answer23"), 2);

        storage.store(testObject1);
//        assertEntityCount(1, 3);
        storage.store(testObject2);
//        assertEntityCount(2, 6);

        assertEquals(testObject1, storage.load(testObject1.getTitle()));
        assertEquals(testObject2, storage.load(testObject2.getTitle()));

        storage.delete(testObject2.getTitle());
        assertEntityCount(1, 3);
        assertEquals(testObject1, storage.load(testObject1.getTitle()));
        storage.delete(testObject1.getTitle());
        assertEntityCount(0, 0);
    }

    @Test
    public void testStoreNullAndEmptyTitle() throws Exception {
        try {
            storage.store(new TestObjectImpl(null, "This is test one", Arrays.asList("answer1",
                    "answer2", "answer3"), 2));
            fail("Should not be able to create TestObject with null title");
        } catch (IllegalArgumentException e) {
            // works well
        }
        try {
            storage.store(new TestObjectImpl("", "This is test one", Arrays.asList("answer1",
                    "answer2", "answer3"), 2));
            fail("Should not be able to create TestObject with empty title");
        } catch (IllegalArgumentException e) {
            // works well
        }
    }

    @Test
    public void testStoreAgain() throws Exception {
        TestObjectImpl testObject = new TestObjectImpl("tite", "This is test one", Arrays.asList(
                "answer1", "answer2", "answer3"), 2);

        storage.store(testObject);
        assertEntityCount(1, 3);
        storage.store(testObject);
        assertEntityCount(1, 3);

        assertEquals(testObject, storage.load(testObject.getTitle()));

        TestObjectImpl testObjectUpdate = new TestObjectImpl("tite", "This is updated testObject",
                Arrays.asList("answer1update", "answer2update"), 1);

        storage.store(testObjectUpdate);
        assertEntityCount(1, 2);
        assertEquals(testObjectUpdate, storage.load(testObject.getTitle()));
    }

    @Test
    public void testLoadMissing() throws Exception {
        assertNull(storage.load("missing test title"));
    }

    @Test
    public void testDeleteMissing() throws Exception {
        assertFalse(storage.delete("missing test title"));
    }

    @Test
    public void testListTestTitles() throws Exception {
        TestObjectImpl testObject1 = new TestObjectImpl("tite", "This is test one", Arrays.asList(
                "answer1", "answer2", "answer3"), 2);
        TestObjectImpl testObject2 = new TestObjectImpl("tite2", "This is test two", Arrays.asList(
                "answer21", "answer22", "answer23"), 2);
        TestObjectImpl testObject3 = new TestObjectImpl("tite3", "This is test three",
                Arrays.asList("answer31", "answer32", "answer33"), 2);

        storage.store(testObject1);
        assertEquals(Sets.newHashSet(testObject1.getTitle()), storage.getTestTitles());
        storage.store(testObject2);
        assertEquals(Sets.newHashSet(testObject1.getTitle(), testObject2.getTitle()),
                storage.getTestTitles());
        storage.store(testObject3);

        assertEquals(
                Sets.newHashSet(testObject1.getTitle(), testObject2.getTitle(),
                        testObject3.getTitle()), storage.getTestTitles());
    }

    private void assertEntityCount(int testsCount, int possibleAnswerCount) {
        assertEquals(testsCount, ds.prepare(new Query(TestObjectStorage.ENTITY_NAME))
                .countEntities(withLimit(testsCount + 1)));

        assertEquals(
                possibleAnswerCount,
                ds.prepare(new Query(TestObjectStorage.PROP_POSSIBLE_ANSWER)).countEntities(
                        withLimit(possibleAnswerCount + 1)));
    }
}