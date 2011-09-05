package org.bitbucket.cursodeconducir.services.testobject.impl;

import java.util.Arrays;
import java.util.Collections;

import static junit.framework.Assert.*;

import org.junit.Test;

import com.google.appengine.repackaged.com.google.common.collect.Lists;

public class TestObjectImplTest {
    @Test
    public void testEqualsAndHashCode() throws Exception {
        TestObjectImpl one = new TestObjectImpl("test1",
                "This is test one", Arrays.asList("answer1", "answer2",
                        "answer3"), 2);

        assertFalse(one.equals(null));
        assertFalse(one.equals(""));
        assertFalse(one.equals(new Object()));
        assertEquals(one, one);
        assertTrue(one.hashCode() == one.hashCode());

        TestObjectImpl same = new TestObjectImpl(one.getTitle(),
                one.getTestBody(), one.getPossibleAnswers(),
                one.getCorrectAnswerIndex());

        assertEquals(one, same);
        assertTrue(one.hashCode() == same.hashCode());

        TestObjectImpl different = new TestObjectImpl("diferentTitle",
                one.getTestBody(), one.getPossibleAnswers(),
                one.getCorrectAnswerIndex());
        assertFalse(one.equals(different));
        assertFalse(one.hashCode() == different.hashCode());

        different = new TestObjectImpl(one.getTitle(),
                "Different body", one.getPossibleAnswers(),
                one.getCorrectAnswerIndex());
        assertFalse(one.equals(different));
        assertFalse(one.hashCode() == different.hashCode());

        different = new TestObjectImpl(one.getTitle(),
                one.getTestBody(), Lists.newArrayList("", "", "", ""),
                one.getCorrectAnswerIndex());
        assertFalse(one.equals(different));
        assertFalse(one.hashCode() == different.hashCode());

        different = new TestObjectImpl(one.getTitle(),
                one.getTestBody(), one.getPossibleAnswers(), 0);
        assertFalse(one.equals(different));
        assertFalse(one.hashCode() == different.hashCode());
    }

    @Test
    public void testCorrectAndwerIndexOutOfBounds() throws Exception {
        try {
            new TestObjectImpl("test1", "This is test one",
                    Arrays.asList("answer1", "answer2", "answer3"), -1);
            fail("Should not be able to add correct answer index out of bounds");
        } catch (IllegalArgumentException e) {
            // Should not be able to add correct answer index out of bounds
        }

        try {
            new TestObjectImpl("test1", "This is test one",
                    Collections.<String> emptyList(), 0);
            fail("Should not be able to add correct answer index out of bounds");
        } catch (IllegalArgumentException e) {
            // Should not be able to add correct answer index out of bounds
        }
        
        try {
            new TestObjectImpl("test1", "This is test one",
                    Arrays.asList("answer1", "answer2", "answer3"), 3);
            fail("Should not be able to add correct answer index out of bounds");
        } catch (IllegalArgumentException e) {
            // Should not be able to add correct answer index out of bounds
        }
    }
}
