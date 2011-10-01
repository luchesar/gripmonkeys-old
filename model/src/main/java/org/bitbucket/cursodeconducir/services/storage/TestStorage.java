package org.bitbucket.cursodeconducir.services.storage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.entity.Test;

import com.google.appengine.repackaged.com.google.common.collect.Lists;
import com.google.appengine.repackaged.com.google.common.collect.Sets;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

public class TestStorage {

    static {
        Util.factory().register(Test.class);
    }

    public Set<Test> put(final Test... tests) throws ServiceException {
        Objectify objectify = Util.factory().begin();
        
        Map<Key<Test>, Test> putResult = objectify.put(Arrays.asList(tests));
        return Sets.newLinkedHashSet(putResult.values());
    }

    public Set<Test> get(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Test>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Test>(Test.class, id));
        }
        Map<Key<Test>, Test> map = objectify.get(keys);
        return Sets.newLinkedHashSet(map.values());
    }

    public List<Test> getAll() {
        Objectify objectify = Util.factory().begin();
        Query<Test> query = objectify.query(Test.class);
        return query.list();
    }

    public List<Test> getAll(int offset, int limit) {
        Objectify objectify = Util.factory().begin();
        Query<Test> query = objectify.query(Test.class).offset(offset).limit(limit);
        return query.list();
    }

    public Test find(final String title) {
        Objectify objectify = Util.factory().begin();
        Query<Test> query = objectify.query(Test.class).filter("title", title);

        if (query.count() < 1) {
            return null;
        }
        if (query.count() > 1) {
            throw new RuntimeException("Found more then one test with the same titme "
                    + query.list());
        }
        return query.get();
    }
    
    public List<Test> find(final String... titles) {
        Objectify objectify = Util.factory().begin();
        Query<Test> query = objectify.query(Test.class).filter("title in", titles);
        return query.list();
    }

    public void delete(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<Test>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<Test>(Test.class, id));
        }
        objectify.delete(keys);
    }
}
