package org.bitbucket.cursodeconducir.services.entity;

import javax.persistence.Id;

import com.google.appengine.repackaged.com.google.common.base.Objects;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Cached
public class TitledEntity {
    @Id
    private Long id;
    
    private String title;
    @Unindexed
    private String image;
    @Unindexed
    private String description;

    public TitledEntity() {

    }

    public TitledEntity(String aTitle, String aImage, String aDescription) {
        title = aTitle;
        image = aImage;
        description = aDescription;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getTitleImage() {
        return image;
    }

    public String getDescription() {
        return description;
    }
    
    public String getImage() {
        return image;
    }

    public void setTitleImage(String aImage) {
        image = aImage;
    }

    public void setId(Long aId) {
        id = aId;
    }

    public void setTitle(String aTitle) {
        title = aTitle;
    }

    public void setDescription(String aDescription) {
        description = aDescription;
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
                && Objects.equal(image, other.image)
                && Objects.equal(description, other.description);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, title, image, description);
    }

    @Override
    public String toString() {
        return "TitledEntity [id=" + id + ", title=" + title + ", titleImage=" + image
                + ", description=" + description + "]";
    }
}
