package org.bitbucket.cursodeconducir.services.storage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.Query;

public class TitledEntityStorage<TE> {
	private final Class<TE> clazz;
	
	public TitledEntityStorage(Class<TE> aClazz) {
		clazz = aClazz;
	}
	
	public Set<TE> put(final TE... lessons) throws ServiceException {
        Objectify objectify = Util.factory().begin();

        Map<Key<TE>, TE> putResult = objectify.put(Arrays.asList(lessons));
        return Sets.newLinkedHashSet(putResult.values());
    }

    public Set<TE> get(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<TE>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<TE>(clazz, id));
        }
        Map<Key<TE>, TE> map = objectify.get(keys);
        return Sets.newLinkedHashSet(map.values());
    }

    public List<TE> getAll() {
        Objectify objectify = Util.factory().begin();
        Query<TE> query = objectify.query(clazz).order("title");
        return query.list();
    }

    public List<TE> getAll(boolean published) {
        Objectify objectify = Util.factory().begin();
        Query<TE> query = objectify.query(clazz).filter("published", published)
                .order("title");
        return query.list();
    }

    public List<TE> getAll(int offset, int limit) {
        Objectify objectify = Util.factory().begin();
        Query<TE> query = objectify.query(clazz).offset(offset).limit(limit).order("title");
        return query.list();
    }

    public TE find(final String title) {
        Objectify objectify = Util.factory().begin();
        Query<TE> query = objectify.query(clazz).filter("title", title);

        if (query.count() < 1) {
            return null;
        }
        if (query.count() > 1) {
            throw new RuntimeException("Found more then one test with the same titme "
                    + query.list());
        }
        return query.get();
    }

    public List<TE> find(final String... titles) {
        Objectify objectify = Util.factory().begin();
        Query<TE> query = objectify.query(clazz).filter("title in", titles);
        return query.list();
    }

    public void delete(final long... ids) {
        Objectify objectify = Util.factory().begin();
        List<Key<TE>> keys = Lists.newArrayList();
        for (long id : ids) {
            keys.add(new Key<TE>(clazz, id));
        }
        objectify.delete(keys);
    }
}
