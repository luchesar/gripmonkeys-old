package org.bitbucket.cursodeconducir.services.entity;

import junit.framework.TestCase;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;

public class CourseTest extends TestCase {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    private int l1 = 1;
    private int l2 = 2;
    private int l3 = 3;
    
    @Before
    public void setUp() throws Exception {
        helper.setUp();
    }

    @After
    public void tearDown() throws Exception {
        helper.tearDown();
    }
    
    @Test
	public void testEqualsAndHashCode() throws Exception {
    	Course cource = new Course("title", "title image", "description", Lists.newArrayList(l1,
                l2, l3));

        assertEquals(cource, cource);

        Course same = new Course(cource.getTitle(), cource.getTitleImage(),
                cource.getDescription(), cource.getLessonIds());
        assertEquals(cource, same);
        assertEquals(cource.hashCode(), same.hashCode());

        Course differentTitle = new Course("differentTitle", cource.getTitleImage(),
                cource.getDescription(), cource.getLessonIds());
        assertFalse(cource.equals(differentTitle));
        assertFalse(cource.hashCode() == differentTitle.hashCode());

        Course differentTitleImage = new Course(cource.getTitle(), "differentTitleImage",
                cource.getDescription(), cource.getLessonIds());
        assertFalse(cource.equals(differentTitleImage));
        assertFalse(cource.hashCode() == differentTitleImage.hashCode());

        Course differentDescription = new Course(cource.getTitle(), cource.getTitleImage(),
                "different description", cource.getLessonIds());
        assertFalse(cource.equals(differentDescription));
        assertFalse(cource.hashCode() == differentDescription.hashCode());
        
        Course differentQuestions = new Course(cource.getTitle(), cource.getTitleImage(),
                cource.getDescription(), Lists.newArrayList(l3, l2, l1));
        assertFalse(cource.equals(differentQuestions));
        assertFalse(cource.hashCode() == differentQuestions.hashCode());
	}
    
    @Test
    public void testFillInKeys() throws Exception {
        Course lesson = new Course();
        lesson.setLessonIds(Lists.newArrayList(l1, l2, l3));


        assertEquals(Lists.newArrayList(l1, l2, l3), lesson.getLessonIds());

        lesson = new Course("title", "image", "description", Lists.newArrayList(l1, l2, l3));

        assertEquals(Lists.newArrayList(l1, l2, l3), lesson.getLessonIds());
        
        lesson = new Course("title", "image", "description", null);
        assertNull(lesson.getLessonIds());
    }
}
