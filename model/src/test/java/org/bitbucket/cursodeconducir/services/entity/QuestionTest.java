package org.bitbucket.cursodeconducir.services.entity;

import static junit.framework.Assert.*;

import com.google.common.collect.Lists;

public class QuestionTest {
    @org.junit.Test
    public void testEqualsAndHashcode() throws Exception {
        Question question = new Question("title", "title image", "description", Lists.newArrayList("answer1",
                "answer2"), 1, "Explanation", Lists.newArrayList("image1", "image2"));

        assertEquals(question, question);

        Question same = new Question(question.getTitle(), question.getTitleImage(), question.getDescription(),
                question.getPossibleAnswers(), question.getCorrectAnswerIndex(), question.getExplanation(),
                question.getImages());
        assertEquals(question, same);
        assertEquals(question.hashCode(), same.hashCode());

        Question differentTitle = new Question("differentTitle", question.getTitleImage(),
                question.getDescription(), question.getPossibleAnswers(), question.getCorrectAnswerIndex(),
                question.getExplanation(), question.getImages());
        assertFalse(question.equals(differentTitle));
        assertFalse(question.hashCode() == differentTitle.hashCode());

        Question differentTitleImage = new Question(question.getTitle(), "differentTitleImage",
                question.getDescription(), question.getPossibleAnswers(), question.getCorrectAnswerIndex(),
                question.getExplanation(), question.getImages());
        assertFalse(question.equals(differentTitleImage));
        assertFalse(question.hashCode() == differentTitleImage.hashCode());

        Question differentDescription = new Question(question.getTitle(), question.getTitleImage(),
                "different description", question.getPossibleAnswers(), question.getCorrectAnswerIndex(),
                question.getExplanation(), question.getImages());
        assertFalse(question.equals(differentDescription));
        assertFalse(question.hashCode() == differentDescription.hashCode());

        Question differentAnswers = new Question(question.getTitle(), question.getTitleImage(),
                question.getDescription(),
                Lists.newArrayList("different answer1", "different answer2"),
                question.getCorrectAnswerIndex(), question.getExplanation(), question.getImages());
        assertFalse(question.equals(differentAnswers));
        assertFalse(question.hashCode() == differentAnswers.hashCode());

        Question differentAnswerIndex = new Question(question.getTitle(), question.getTitleImage(), question.getDescription(),
                question.getPossibleAnswers(), 0, question.getExplanation(),
                question.getImages());
        assertFalse(question.equals(differentAnswerIndex));
        assertFalse(question.hashCode() == differentAnswerIndex.hashCode());

        Question differentExplanation = new Question(question.getTitle(), question.getTitleImage(), question.getDescription(),
                question.getPossibleAnswers(), question.getCorrectAnswerIndex(),"different explanation",
                question.getImages());
        assertFalse(question.equals(differentExplanation));
        assertFalse(question.hashCode() == differentExplanation.hashCode());
        
        Question differentImages = new Question(question.getTitle(), question.getTitleImage(), question.getDescription(),
                question.getPossibleAnswers(), question.getCorrectAnswerIndex(), question.getExplanation(),
                Lists.newArrayList("image23", "image8776"));
        assertFalse(question.equals(differentImages));
        assertFalse(question.hashCode() == differentImages.hashCode());
        
        Question differentIsPublished = new Question(question.getTitle(), question.getTitleImage(), question.getDescription(),
                question.getPossibleAnswers(), question.getCorrectAnswerIndex(), question.getExplanation(),
                question.getImages());
        differentIsPublished.setPublished(true);
        assertFalse(question.equals(differentIsPublished));
        assertFalse(question.hashCode() == differentIsPublished.hashCode());
    }
}
