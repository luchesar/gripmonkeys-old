package org.bitbucket.cursodeconducir.services.entity;

import static junit.framework.Assert.*;

import org.junit.Test;

public class TitledEntityTest {
    @Test
    public void testEqualsAndHashCode() throws Exception {
        TitledEntity first = new TitledEntity("first", "image", "description1");

        assertFalse(first.equals(null));
        assertFalse(first.equals(""));
        assertTrue(first.equals(first));

        TitledEntity empty = new TitledEntity();
        assertFalse(first.equals(empty));
        assertFalse(first.hashCode() == empty.hashCode());

        TitledEntity differentTitle = new TitledEntity("differentTitle", first.getTitleImage(),
                first.getDescription());
        assertFalse(first.equals(differentTitle));
        assertFalse(first.hashCode() == differentTitle.hashCode());
        
        TitledEntity differentTitleImage = new TitledEntity(first.getTitle(), "different title image",
                first.getDescription());
        assertFalse(first.equals(differentTitleImage));
        assertFalse(first.hashCode() == differentTitleImage.hashCode());

        TitledEntity differentImage = new TitledEntity(first.getTitle(), "different image",
                "differentDescription");
        assertFalse(first.equals(differentImage));
        assertFalse(first.hashCode() == differentImage.hashCode());

        TitledEntity differentDescription = new TitledEntity(first.getTitle(), first.getTitleImage(),
                "differentDescription");
        assertFalse(first.equals(differentDescription));
        assertFalse(first.hashCode() == differentDescription.hashCode());
        
        TitledEntity differentIsPublished = new TitledEntity(first.getTitle(), first.getTitleImage(), first.getDescription());
        differentIsPublished.setPublished(true);
        assertFalse(first.equals(differentIsPublished));
        assertFalse(first.hashCode() == differentIsPublished.hashCode());

        TitledEntity same = new TitledEntity(first.getTitle(), first.getTitleImage(),
                first.getDescription());

        assertTrue(first.equals(same));
        assertTrue(first.hashCode() == same.hashCode());
    }
}
