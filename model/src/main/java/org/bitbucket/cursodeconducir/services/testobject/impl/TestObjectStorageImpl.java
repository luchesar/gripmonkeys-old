package org.bitbucket.cursodeconducir.services.testobject.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.bitbucket.cursodeconducir.services.Closures;
import org.bitbucket.cursodeconducir.services.ServiceException;
import org.bitbucket.cursodeconducir.services.Util;
import org.bitbucket.cursodeconducir.services.testobject.TestObject;
import org.bitbucket.cursodeconducir.services.testobject.TestObjectStorage;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.repackaged.com.google.common.collect.Lists;
import com.google.appengine.repackaged.com.google.common.collect.Maps;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;

public class TestObjectStorageImpl implements TestObjectStorage {

    private ObjectifyFactory fact = new ObjectifyFactory();;
    
    public TestObjectStorageImpl() {
        fact.register(TestObjectImpl.class);
    }

    @Override
    public void store(final TestObject aTestObject) throws ServiceException {
        Objectify objectify = fact.begin();
        com.googlecode.objectify.Key<TestObject> put = objectify.put(aTestObject);
        System.out.println(put);
    }

    @Override
    public TestObject load(final String title) throws ServiceException {
        Objectify objectify = fact.begin();
        Key testKey = KeyFactory.createKey(TestObjectImpl.class.getSimpleName(), title);
        return objectify.find(new com.googlecode.objectify.Key<TestObject>(testKey));
    }

    @Override
    public Set<String> getTestTitles() throws ServiceException {
        Set<String> titles = new HashSet<String>();
        Query q = new Query(ENTITY_NAME);
        PreparedQuery pq = Util.ds().prepare(q);

        for (Entity e : pq.asIterable()) {
            titles.add(e.getKey().getName());
        }

        return titles;
    }

    @Override
    public boolean delete(final String aTitle) throws ServiceException {
        return Util.inTransaction(new Closures.Closure<Boolean, ServiceException>() {

            @Override
            public Boolean exec(DatastoreService ds) throws ServiceException {

                Key testKey = KeyFactory.createKey(ENTITY_NAME, aTitle);
                try {
                    ds.get(testKey);
                } catch (EntityNotFoundException e) {
                    return false;
                }

                ds.delete(listChildKeys(ds, PROP_POSSIBLE_ANSWER, testKey));
                ds.delete(testKey);
                return true;
            }
        });
    }
    
    public static Iterable<Key> listChildKeys(DatastoreService ds, String kind, Key ancestor) {
        Query q = new Query(kind);
        q.setAncestor(ancestor).setKeysOnly();
        q.addFilter(Entity.KEY_RESERVED_PROPERTY, FilterOperator.GREATER_THAN, ancestor);
        PreparedQuery pq = ds.prepare(q);

        final List<Key> keys = new ArrayList<Key>();
        for (Entity e : pq.asIterable()) {
            keys.add(e.getKey());
        }
        return keys;
    }

    public static Iterable<Entity> listChildren(String kind, Key ancestor) {
        Query q = new Query(kind);
        q.setAncestor(ancestor);
        q.addFilter(Entity.KEY_RESERVED_PROPERTY, FilterOperator.GREATER_THAN, ancestor);
        PreparedQuery pq = Util.ds().prepare(q);
        return pq.asIterable();
    }

}
