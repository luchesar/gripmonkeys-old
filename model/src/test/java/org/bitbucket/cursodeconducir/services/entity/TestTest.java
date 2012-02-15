package org.bitbucket.cursodeconducir.services.entity;

import static junit.framework.Assert.*;

import com.google.common.collect.Lists;

public class TestTest {
    @org.junit.Test
    public void testEqualsAndHashcode() throws Exception {
        Test test = new Test("title", "title image", "description", Lists.newArrayList("answer1",
                "answer2"), 1, "Explanation", Lists.newArrayList("image1", "image2"));

        assertEquals(test, test);

        Test same = new Test(test.getTitle(), test.getTitleImage(), test.getDescription(),
                test.getPossibleAnswers(), test.getCorrectAnswerIndex(), test.getExplanation(),
                test.getImages());
        assertEquals(test, same);
        assertEquals(test.hashCode(), same.hashCode());

        Test differentTitle = new Test("differentTitle", test.getTitleImage(),
                test.getDescription(), test.getPossibleAnswers(), test.getCorrectAnswerIndex(),
                test.getExplanation(), test.getImages());
        assertFalse(test.equals(differentTitle));
        assertFalse(test.hashCode() == differentTitle.hashCode());

        Test differentTitleImage = new Test(test.getTitle(), "differentTitleImage",
                test.getDescription(), test.getPossibleAnswers(), test.getCorrectAnswerIndex(),
                test.getExplanation(), test.getImages());
        assertFalse(test.equals(differentTitleImage));
        assertFalse(test.hashCode() == differentTitleImage.hashCode());

        Test differentDescription = new Test(test.getTitle(), test.getTitleImage(),
                "different description", test.getPossibleAnswers(), test.getCorrectAnswerIndex(),
                test.getExplanation(), test.getImages());
        assertFalse(test.equals(differentDescription));
        assertFalse(test.hashCode() == differentDescription.hashCode());

        Test differentAnswers = new Test(test.getTitle(), test.getTitleImage(),
                test.getDescription(),
                Lists.newArrayList("different answer1", "different answer2"),
                test.getCorrectAnswerIndex(), test.getExplanation(), test.getImages());
        assertFalse(test.equals(differentAnswers));
        assertFalse(test.hashCode() == differentAnswers.hashCode());

        Test differentAnswerIndex = new Test(test.getTitle(), test.getTitleImage(), test.getDescription(),
                test.getPossibleAnswers(), 0, test.getExplanation(),
                test.getImages());
        assertFalse(test.equals(differentAnswerIndex));
        assertFalse(test.hashCode() == differentAnswerIndex.hashCode());

        Test differentExplanation = new Test(test.getTitle(), test.getTitleImage(), test.getDescription(),
                test.getPossibleAnswers(), test.getCorrectAnswerIndex(),"different explanation",
                test.getImages());
        assertFalse(test.equals(differentExplanation));
        assertFalse(test.hashCode() == differentExplanation.hashCode());
        
        Test differentImages = new Test(test.getTitle(), test.getTitleImage(), test.getDescription(),
                test.getPossibleAnswers(), test.getCorrectAnswerIndex(), test.getExplanation(),
                Lists.newArrayList("image23", "image8776"));
        assertFalse(test.equals(differentImages));
        assertFalse(test.hashCode() == differentImages.hashCode());
        
        Test differentIsPublished = new Test(test.getTitle(), test.getTitleImage(), test.getDescription(),
                test.getPossibleAnswers(), test.getCorrectAnswerIndex(), test.getExplanation(),
                test.getImages());
        differentIsPublished.setPublished(true);
        assertFalse(test.equals(differentIsPublished));
        assertFalse(test.hashCode() == differentIsPublished.hashCode());
    }
}
