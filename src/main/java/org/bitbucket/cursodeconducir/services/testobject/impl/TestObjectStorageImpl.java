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
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.repackaged.com.google.common.collect.Lists;
import com.google.appengine.repackaged.com.google.common.collect.Maps;

public class TestObjectStorageImpl implements TestObjectStorage {

    @Override
    public void store(final TestObject aTestObject) throws ServiceException {
        Util.inTransaction(new Closures.Void<ServiceException>() {

            @Override
            public void exec(DatastoreService ds) throws ServiceException {
                Entity entity = new Entity(ENTITY_NAME, aTestObject.getTitle());
                entity.setProperty(PROP_TITLE, aTestObject.getTitle());
                entity.setProperty(PROP_BODY, aTestObject.getTestBody());
                entity.setProperty(PROP_CORRECT_ANSWER_INDEX, aTestObject.getCorrectAnswerIndex());
                Key testObjectKey = ds.put(entity);

                ds.delete(listChildKeys(ds, PROP_POSSIBLE_ANSWER, entity.getKey()));
                int index = 0;
                for (String answer : aTestObject.getPossibleAnswers()) {
                    Entity possibleAnswer = new Entity(PROP_POSSIBLE_ANSWER, testObjectKey);
                    possibleAnswer.setProperty(PROP_POSSIBLE_ANSWER_INDEX, index);
                    possibleAnswer.setProperty(PROP_POSSIBLE_ANSWER_CONTENT, answer);
                    ds.put(possibleAnswer);
                    index++;
                }
            }
        });
    }

    @Override
    public TestObject load(final String title) throws ServiceException {
        return Util.inTransaction(new Closures.Closure<TestObject, ServiceException>() {

            @Override
            public TestObject exec(DatastoreService ds) throws ServiceException {

                Key testKey = KeyFactory.createKey(ENTITY_NAME, title);

                try {
                    Entity entity = ds.get(testKey);
                    String title = (String) entity.getProperty(PROP_TITLE);
                    String body = (String) entity.getProperty(PROP_BODY);
                    int correctAnswerIndex = ((Long) entity.getProperty(PROP_CORRECT_ANSWER_INDEX))
                            .intValue();

                    Map<Integer, String> answers = Maps.newTreeMap();
                    for (Entity answer : listChildren(PROP_POSSIBLE_ANSWER, testKey)) {
                        String answerContent = (String) answer
                                .getProperty(PROP_POSSIBLE_ANSWER_CONTENT);
                        int index = ((Long) answer.getProperty(PROP_POSSIBLE_ANSWER_INDEX))
                                .intValue();

                        answers.put(index, answerContent);
                    }

                    return new TestObjectImpl(title, body, Lists.newArrayList(answers.values()),
                            correctAnswerIndex);
                } catch (EntityNotFoundException e) {
                    return null;
                }
            }
        });
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
