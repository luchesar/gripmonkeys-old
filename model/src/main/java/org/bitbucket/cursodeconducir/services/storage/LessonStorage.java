package org.bitbucket.cursodeconducir.services.storage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Lesson;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

public class LessonStorage {
    static {
        Util.factory().register(Lesson.class);
    }

    public Set<Lesson> put(final Lesson... lessons) throws ServiceException {
        Objectify objectify = Util.factory().begin();

        Map<Key<Lesson>, Lesson> putResult = objectify.put(Arrays.asList(lessons));
        return Sets.newLinkedHashSet(putResult.values());
    }

    public Set<Lesson> get(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Lesson>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Lesson>(Lesson.class, id));
        }
        Map<Key<Lesson>, Lesson> map = objectify.get(keys);
        return Sets.newLinkedHashSet(map.values());
    }

    public List<Lesson> getAll() {
        Objectify objectify = Util.factory().begin();
        Query<Lesson> query = objectify.query(Lesson.class).order("title");
        return query.list();
    }

    public List<Lesson> getAll(boolean published) {
        Objectify objectify = Util.factory().begin();
        Query<Lesson> query = objectify.query(Lesson.class).filter("published", published)
                .order("title");
        return query.list();
    }

    public List<Lesson> getAll(int offset, int limit) {
        Objectify objectify = Util.factory().begin();
        Query<Lesson> query = objectify.query(Lesson.class).offset(offset).limit(limit).order("title");
        return query.list();
    }

    public Lesson find(final String title) {
        Objectify objectify = Util.factory().begin();
        Query<Lesson> query = objectify.query(Lesson.class).filter("title", title);

        if (query.count() < 1) {
            return null;
        }
        if (query.count() > 1) {
            throw new RuntimeException("Found more then one test with the same titme "
                    + query.list());
        }
        return query.get();
    }

    public List<Lesson> find(final String... titles) {
        Objectify objectify = Util.factory().begin();
        Query<Lesson> query = objectify.query(Lesson.class).filter("title in", titles);
        return query.list();
    }

    public void delete(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Lesson>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Lesson>(Lesson.class, id));
        }
        objectify.delete(keys);
    }
}
