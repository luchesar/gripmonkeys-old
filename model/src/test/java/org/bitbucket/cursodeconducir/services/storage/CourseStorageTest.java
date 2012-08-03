package org.bitbucket.cursodeconducir.services.storage;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotSame;
import static junit.framework.Assert.assertNull;
import static junit.framework.Assert.fail;

import java.util.Iterator;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.entity.Course;
import org.junit.After;
import org.junit.Before;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

public class CourseStorageTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    protected QuestionStorage questionStorage;
    protected LessonStorage lessonStorage;
    protected CourseStorage storage;

    private Integer l1 = 1;
    private Integer l2 = 2;
    private Integer l3 = 3;

    @Before
    public void setUp() throws Exception {
        helper.setUp();
        questionStorage = new QuestionStorage();
        lessonStorage = new LessonStorage();
        storage = new CourseStorage();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }

    @org.junit.Test
    public void testStore() throws Exception {
        Course lesson1 = new Course("title", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course storedLesson = putAndGet(lesson1);

        assertNotSame(lesson1, storedLesson);
        assertEquals(lesson1, storedLesson);

        assertEquals(Lists.newArrayList(lesson1), storage.getAll());
    }

    @org.junit.Test
    public void testStoreBatch() throws Exception {
        Course lesson1 = new Course("title1", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course lesson2 = new Course("title2", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course lesson3 = new Course("title3", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course lesson4 = new Course("title4", "image", "description", Lists.newArrayList(l1, l2, l3));

        Set<Course> result = storage.put(lesson1, lesson2, lesson3, lesson4);
        Iterator<Course> iterator = result.iterator();
        assertEquals(lesson1, iterator.next());
        assertEquals(lesson2, iterator.next());
        assertEquals(lesson3, iterator.next());
        assertEquals(lesson4, iterator.next());
    }

    public void testStoreSameTitle() throws Exception {
        Course test1 = new Course("title", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("title", "image", "description", Lists.newArrayList(l1, l2, l3));

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
        Course test1 = new Course("title", "image", "description", Lists.newArrayList(l1, l2, l3));

        test1 = storage.put(test1).iterator().next();
        test1.setTitleImage("new Image");
        storage.put(test1);

        assertEquals(Sets.newHashSet(test1), storage.get(test1.getId()));
        assertEquals(Lists.newArrayList(test1), storage.getAll());
    }

    @org.junit.Test
    public void testStoreAndGetMultiple() throws Exception {
        Course test1 = new Course("test1", "image1", "description1", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("test2", "image1", "description1", Lists.newArrayList(l1, l2, l3));

        storage.put(test1, test2);
        assertEquals(Lists.newArrayList(test1, test2), storage.getAll());

        storage.delete(test1.getId());
        assertEquals(Lists.newArrayList(test2), storage.getAll());
        storage.delete(test2.getId());
        assertEquals(Lists.newArrayList(), storage.getAll());
    }

    @org.junit.Test
    public void testFindByTitle() throws Exception {
        Course test1 = new Course("test1", "image1", "description1", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("test2", "image1", "description1", Lists.newArrayList(l1, l2, l3));

        storage.put(test1, test2);

        assertEquals(test1, storage.find(test1.getTitle()));
        assertEquals(test2, storage.find(test2.getTitle()));

        assertNull(storage.find("missing title"));
    }

    @org.junit.Test
    public void testFindMultipleByTitle() throws Exception {
        Course test1 = new Course("title1", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("title2", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test3 = new Course("title3", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test4 = new Course("title4", "image", "description", Lists.newArrayList(l1, l2, l3));

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
        Course test1 = new Course("test1", "image1", "description1", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("test2", "image1", "description1", Lists.newArrayList(l1, l2, l3));

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
        Course test1 = new Course("A_title1", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("Z_title2", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test3 = new Course("a_title3", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test4 = new Course("z_title4", "image", "description", Lists.newArrayList(l1, l2, l3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll(0, 4));
        assertEquals(Lists.newArrayList(test2, test3, test4), storage.getAll(1, 3));
        assertEquals(Lists.newArrayList(test2, test3), storage.getAll(1, 2));
        assertEquals(Lists.newArrayList(test3), storage.getAll(2, 1));
    }

    @org.junit.Test
    public void testGetAllSorted() throws Exception {
        Course test1 = new Course("A_title1", "image", "description",Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("Z_title2", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test3 = new Course("a_title3", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test4 = new Course("z_title4", "image", "description", Lists.newArrayList(l1, l2, l3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll());
    }
    
    public void _testGetAllSortedNumbers() throws Exception {
        Course test1 = new Course("1.", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("10.", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test3 = new Course("11.", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test4 = new Course("100.", "image", "description",Lists.newArrayList(l1, l2, l3));

        storage.put(test4, test1, test3, test2);
        assertEquals(Lists.newArrayList(test1, test2, test3, test4), storage.getAll());
    }

    /*@org.junit.Test
    public void testGetAllPublished() throws Exception {
        Course test1 = new Course("A_title1", "image", "description", Lists.newArrayList(q1, q2, q3));
        Course test2 = new Course("Z_title2", "image", "description", Lists.newArrayList(q1, q2, q3));
        Course test3 = new Course("a_title3", "image", "description", Lists.newArrayList(q1, q2, q3));
        Course test4 = new Course("z_title4", "image", "description", Lists.newArrayList(q1, q2, q3));
        
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
        Course test1 = new Course("title1", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test2 = new Course("title2", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test3 = new Course("title3", "image", "description", Lists.newArrayList(l1, l2, l3));
        Course test4 = new Course("title4", "image", "description", Lists.newArrayList(l1, l2, l3));

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
    
    protected Course putAndGet(Course saveMe) throws Exception {
        Set<Course> put = storage.put(saveMe);
        return storage.get(put.iterator().next().getId()).iterator().next();
    }
}
