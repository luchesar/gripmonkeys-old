package org.bitbucket.cursodeconducir.services;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Transaction;

public class Util {
    public static DatastoreService ds() {
        return DatastoreServiceFactory.getDatastoreService();
    }
    
    public static <E extends Exception> void inTransaction(Closures.Void<E> closure) throws E {
        final DatastoreService ds = ds();
        Transaction transaction = ds.beginTransaction();
        try {
            closure.exec(ds);
            transaction.commit();
        } finally {
            if (transaction.isActive()) {
                transaction.rollback();
            }
        }
    }
    
    public static <R, E extends Exception> R inTransaction(Closures.Closure<R, E> closure) throws E {
        final DatastoreService ds = ds();
        Transaction transaction = ds.beginTransaction();
        try {
            R result = closure.exec(ds);
            transaction.commit();
            return result;
        } finally {
            if (transaction.isActive()) {
                transaction.rollback();
            }
        }
    }
}
