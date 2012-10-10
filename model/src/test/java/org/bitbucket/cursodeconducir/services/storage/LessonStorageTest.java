package org.bitbucket.cursodeconducir.services.storage;

import static junit.framework.Assert.*;

import java.util.Iterator;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.junit.After;
import org.junit.Before;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class LessonStorageTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    protected QuestionStorage questionStorage;
    protected LessonStorage storage;

    private Integer q1 = 1;
    private Integer q2 = 2;
    private Integer q3 = 3;

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        questionStorage = new QuestionStorage();
        storage = new LessonStorage();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @org.junit.Test
    public void testStore() throws Exception {
        Lesson lesson1 = new Lesson("title", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson storedLesson = putAndGet(lesson1);

        assertNotSame(lesson1, storedLesson);
        assertEquals(lesson1, storedLesson);

        assertEquals(Lists.newArrayList(lesson1), storage.getAll());
    }

    @org.junit.Test
    public void testStoreBatch() throws Exception {
        Lesson lesson1 = new Lesson("title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson lesson2 = new Lesson("title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson lesson3 = new Lesson("title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson lesson4 = new Lesson("title4", "image", "description", Lists.newArrayList(q1, q2, q3));

        Set<Lesson> result = storage.put(lesson1, lesson2, lesson3, lesson4);
        Iterator<Lesson> iterator = result.iterator();
        assertEquals(lesson1, iterator.next());
        assertEquals(lesson2, iterator.next());
        assertEquals(lesson3, iterator.next());
        assertEquals(lesson4, iterator.next());
    }

    public void testStoreSameTitle() throws Exception {
        Lesson test1 = new Lesson("title", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("title", "image", "description", Lists.newArrayList(q1, q2, q3));

        try {
            storage.put(test1, test2);
            fail("Should not be able to store a test with the same title");
        } catch (ServiceException e) {
            assertEquals(Lists.newArrayList(test1), storage.getAll());
        }

        try {
            storage.put(test2);
            fail("Should not be able to store a test with the same title");
        } catch (ServiceException e) {
            assertEquals(Lists.newArrayList(test1), storage.getAll());
        }
    }

    @org.junit.Test
    public void testUpdate() throws Exception {
        Lesson test1 = new Lesson("title", "image", "description", Lists.newArrayList(q1, q2, q3));

        test1 = storage.put(test1).iterator().next();
        test1.setTitleImage("new Image");
        storage.put(test1);

        assertEquals(Sets.newHashSet(test1), storage.get(test1.getId()));
        assertEquals(Lists.newArrayList(test1), storage.getAll());
    }

    @org.junit.Test
    public void testStoreAndGetMultiple() throws Exception {
        Lesson test1 = new Lesson("test1", "image1", "description1", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("test2", "image1", "description1", Lists.newArrayList(q1, q2, q3));

        storage.put(test1, test2);
        assertEquals(Lists.newArrayList(test1, test2), storage.getAll());

        storage.delete(test1.getId());
        assertEquals(Lists.newArrayList(test2), storage.getAll());
        storage.delete(test2.getId());
        assertEquals(Lists.newArrayList(), storage.getAll());
    }

    @org.junit.Test
    public void testFindByTitle() throws Exception {
        Lesson test1 = new Lesson("test1", "image1", "description1", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("test2", "image1", "description1", Lists.newArrayList(q1, q2, q3));

        storage.put(test1, test2);

        assertEquals(test1, storage.find(test1.getTitle()));
        assertEquals(test2, storage.find(test2.getTitle()));

        assertNull(storage.find("missing title"));
    }

    @org.junit.Test
    public void testFindMultipleByTitle() throws Exception {
        Lesson test1 = new Lesson("title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("title4", "image", "description", Lists.newArrayList(q1, q2, q3));

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
        Lesson test1 = new Lesson("test1", "image1", "description1", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("test2", "image1", "description1", Lists.newArrayList(q1, q2, q3));

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
        Lesson test1 = new Lesson("A_title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("Z_title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("a_title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("z_title4", "image", "description", Lists.newArrayList(q1, q2, q3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll(0, 4));
        assertEquals(Lists.newArrayList(test2, test3, test4), storage.getAll(1, 3));
        assertEquals(Lists.newArrayList(test2, test3), storage.getAll(1, 2));
        assertEquals(Lists.newArrayList(test3), storage.getAll(2, 1));
    }

    @org.junit.Test
    public void testGetAllSorted() throws Exception {
        Lesson test1 = new Lesson("A_title1", "image", "description",Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("Z_title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("a_title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("z_title4", "image", "description", Lists.newArrayList(q1, q2, q3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll());
    }
    
    public void _testGetAllSortedNumbers() throws Exception {
        Lesson test1 = new Lesson("1.", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("10.", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("11.", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("100.", "image", "description",Lists.newArrayList(q1, q2, q3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll());
    }

    /*@org.junit.Test
    public void testGetAllPublished() throws Exception {
        Lesson test1 = new Lesson("A_title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("Z_title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("a_title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("z_title4", "image", "description", Lists.newArrayList(q1, q2, q3));
        
        test1.setPublished(true);
        test2.setPublished(true);
        test3.setPublished(false);
        test4.setPublished(false);
        
        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2), storage.getAll(true));
        assertEquals(Lists.newArrayList(test3, test4), storage.getAll(false));
    }*/

    @org.junit.Test
    public void testBatchGet() throws Exception {
        Lesson test1 = new Lesson("title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test2 = new Lesson("title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test3 = new Lesson("title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Lesson test4 = new Lesson("title4", "image", "description", Lists.newArrayList(q1, q2, q3));

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
    
    protected Lesson putAndGet(Lesson saveMe) throws Exception {
        Set<Lesson> put = storage.put(saveMe);
        return storage.get(put.iterator().next().getId()).iterator().next();
    }
}
