package org.bitbucket.cursodeconducir.services.entity;

import static junit.framework.Assert.*;
import org.junit.Test;

public class TitleEntityTest {
    @Test
    public void testEqualsAndHashCode() throws Exception {
        TitledEntity first = new TitledEntity(10, "first", "description1");

        assertFalse(first.equals(null));
        assertFalse(first.equals(""));
        assertTrue(first.equals(first));

        TitledEntity empty = new TitledEntity();
        assertFalse(first.equals(empty));
        assertFalse(first.hashCode() == empty.hashCode());

        TitledEntity differentId = new TitledEntity(1, first.getTitle(), first.getDescription());
        assertFalse(first.equals(differentId));
        assertFalse(first.hashCode() == differentId.hashCode());

        TitledEntity differentTitle = new TitledEntity(first.getId(), "differentTitle",
                first.getDescription());
        assertFalse(first.equals(differentTitle));
        assertFalse(first.hashCode() == differentTitle.hashCode());

        TitledEntity differentDescription = new TitledEntity(first.getId(), first.getTitle(),
                "differentDescription");
        assertFalse(first.equals(differentDescription));
        assertFalse(first.hashCode() == differentDescription.hashCode());
        
        TitledEntity same = new TitledEntity(first.getId(), first.getTitle(),
        first.getDescription());
        
        assertTrue(first.equals(same));
        assertTrue(first.hashCode() == same.hashCode());
    }
}
