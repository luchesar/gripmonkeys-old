package org.bitbucket.cursodeconducir.services.storage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Question;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

public class QuestionStorage {

    static {
        Util.factory().register(Question.class);
    }

    public Set<Question> put(final Question... questions) throws ServiceException {
        Objectify objectify = Util.factory().begin();

        Map<Key<Question>, Question> putResult = objectify.put(Arrays.asList(questions));
        return Sets.newLinkedHashSet(putResult.values());
    }

    public Set<Question> get(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Question>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Question>(Question.class, id));
        }
        Map<Key<Question>, Question> map = objectify.get(keys);
        return Sets.newLinkedHashSet(map.values());
    }

    public List<Question> getAll() {
        Objectify objectify = Util.factory().begin();
        Query<Question> query = objectify.query(Question.class).order("title");
        return query.list();
    }

    public List<Question> getAll(boolean published) {
        Objectify objectify = Util.factory().begin();
        Query<Question> query = objectify.query(Question.class).filter("published", published)
                .order("title");
        return query.list();
    }

    public List<Question> getAll(int offset, int limit) {
        Objectify objectify = Util.factory().begin();
        Query<Question> query = objectify.query(Question.class).offset(offset).limit(limit).order("title");
        return query.list();
    }

    public Question find(final String title) {
        Objectify objectify = Util.factory().begin();
        Query<Question> query = objectify.query(Question.class).filter("title", title);

        if (query.count() < 1) {
            return null;
        }
        if (query.count() > 1) {
            throw new RuntimeException("Found more then one test with the same titme "
                    + query.list());
        }
        return query.get();
    }

    public List<Question> find(final String... titles) {
        Objectify objectify = Util.factory().begin();
        Query<Question> query = objectify.query(Question.class).filter("title in", titles);
        return query.list();
    }

    public void delete(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Question>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Question>(Question.class, id));
        }
        objectify.delete(keys);
    }
}
