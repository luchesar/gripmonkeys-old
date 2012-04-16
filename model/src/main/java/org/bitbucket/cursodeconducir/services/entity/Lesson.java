package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.google.common.base.Objects;

public class Lesson extends TitledEntity {
    /**
     * Used only for storage purposes. Do not use for anything instead us the
     * questions!
     */
    private List<Integer> questionIds;

    public Lesson() {
    }

    public Lesson(String aTitle, String aImage, String aDescription, List<Integer> aQuestionIds) {
        super(aTitle, aImage, aDescription);
        questionIds = aQuestionIds;
    }

    public List<Integer> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Integer> aQuestionIds) {
        questionIds = aQuestionIds;
    }

    @Override
    public boolean equals(Object aObj) {
        if (!super.equals(aObj)) {
            return false;
        }
        if (!(aObj instanceof Lesson)) {
            return false;
        }

        Lesson other = (Lesson) aObj;
        return Objects.equal(questionIds, other.questionIds);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(super.hashCode(), questionIds);
    }

    @Override
    public String toString() {
        return "Lesson [getId()="
                + getId() + ", getTitle()=" + getTitle() + ", getTitleImage()=" + getTitleImage()
                + ", getDescription()=" + getDescription() + ", getImage()=" + getImage()
                + ", questionIds=" + questionIds + "]";
    }
}
