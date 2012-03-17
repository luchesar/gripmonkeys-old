package org.bitbucket.cursodeconducir.services.entity;

import static junit.framework.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;

public class LessonTest {
    private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
            new LocalDatastoreServiceTestConfig(), new LocalMemcacheServiceTestConfig(),
            new LocalTaskQueueTestConfig());

    private int q1 = 1;
    private int q2 = 2;
    private int q3 = 3;

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
        Lesson lesson = new Lesson("title", "title image", "description", Lists.newArrayList(q1,
                q2, q3));

        assertEquals(lesson, lesson);

        Lesson same = new Lesson(lesson.getTitle(), lesson.getTitleImage(),
                lesson.getDescription(), lesson.getQuestionKeys());
        assertEquals(lesson, same);
        assertEquals(lesson.hashCode(), same.hashCode());

        Lesson differentTitle = new Lesson("differentTitle", lesson.getTitleImage(),
                lesson.getDescription(), lesson.getQuestionKeys());
        assertFalse(lesson.equals(differentTitle));
        assertFalse(lesson.hashCode() == differentTitle.hashCode());

        Lesson differentTitleImage = new Lesson(lesson.getTitle(), "differentTitleImage",
                lesson.getDescription(), lesson.getQuestionKeys());
        assertFalse(lesson.equals(differentTitleImage));
        assertFalse(lesson.hashCode() == differentTitleImage.hashCode());

        Lesson differentDescription = new Lesson(lesson.getTitle(), lesson.getTitleImage(),
                "different description", lesson.getQuestionKeys());
        assertFalse(lesson.equals(differentDescription));
        assertFalse(lesson.hashCode() == differentDescription.hashCode());
        
        Lesson differentQuestions = new Lesson(lesson.getTitle(), lesson.getTitleImage(),
                lesson.getDescription(), Lists.newArrayList(q3, q2, q1));
        assertFalse(lesson.equals(differentQuestions));
        assertFalse(lesson.hashCode() == differentQuestions.hashCode());
    }

    @Test
    public void testFillInKeys() throws Exception {
        Lesson lesson = new Lesson();
        lesson.setQuestionKeys(Lists.newArrayList(q1, q2, q3));


        assertEquals(Lists.newArrayList(q1, q2, q3), lesson.getQuestionKeys());

        lesson = new Lesson("title", "image", "description", Lists.newArrayList(q1, q2, q3));

        assertEquals(Lists.newArrayList(q1, q2, q3), lesson.getQuestionKeys());
        
        lesson = new Lesson("title", "image", "description", null);
        assertNull(lesson.getQuestionKeys());
    }
}
