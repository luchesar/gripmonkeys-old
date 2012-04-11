package org.bitbucket.cursodeconducir.services.entity;

import java.util.List;

import com.google.common.base.Objects;

public class Lesson extends TitledEntity {
    /**
     * Used only for storage purposes. Do not use for anything instead us the
     * questions!
     */
    private List<Integer> questionKeys;

    public Lesson() {
    }

    public Lesson(String aTitle, String aImage, String aDescription, List<Integer> aQuestionKeys) {
        super(aTitle, aImage, aDescription);
        questionKeys = aQuestionKeys;
    }

    public List<Integer> getQuestionKeys() {
        return questionKeys;
    }

    public void setQuestionKeys(List<Integer> aQuestionKeys) {
        questionKeys = aQuestionKeys;
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
        return Objects.equal(questionKeys, other.questionKeys);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(super.hashCode(), questionKeys);
    }

    @Override
    public String toString() {
        return "Lesson [getId()="
                + getId() + ", getTitle()=" + getTitle() + ", getTitleImage()=" + getTitleImage()
                + ", getDescription()=" + getDescription() + ", getImage()=" + getImage()
                + ", questionKeys=" + questionKeys + "]";
    }
}
