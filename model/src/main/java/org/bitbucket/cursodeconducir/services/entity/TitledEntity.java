package org.bitbucket.cursodeconducir.services.entity;

import javax.persistence.Id;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
public class TitledEntity {
    @Id
    private long id;
    private String title;
    @Unindexed
    private String description;

    public TitledEntity() {

    }

    public TitledEntity(long aId, String aTitle, String aDescription) {
        id = aId;
        title = aTitle;
        description = aDescription;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public boolean equals(Object aObj) {
        if (aObj == this) {
            return true;
        }
        if (!(aObj instanceof TitledEntity)) {
            return false;
        }

        TitledEntity other = (TitledEntity) aObj;

        return Objects.equal(id, other.id) && Objects.equal(title, other.title)
                && Objects.equal(description, other.description);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, title, description);
    }
}
