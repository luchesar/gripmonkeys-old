package org.bitbucket.cursodeconducir.services.storage;

import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Lesson;

public class LessonStorage extends TitledEntityStorage<Lesson>{
    static {
        Util.factory().register(Lesson.class);
    }
    
    public LessonStorage() {
    	super(Lesson.class);
    }
}
