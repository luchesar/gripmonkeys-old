package org.bitbucket.cursodeconducir.services;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;

public class Util {
    private static final ObjectifyFactory FACTORY = new ObjectifyFactory();

    public static ObjectifyFactory factory() {
        return FACTORY;
    }
    
    public static <E extends Exception> void inTransaction(Closures.Void<E> closure) throws E {
        final ObjectifyFactory factory = factory();
        Objectify objectify = factory.beginTransaction();
        try {
            closure.exec(objectify);
            objectify.getTxn().commit();
        } finally {
            if (objectify.getTxn().isActive()) {
                objectify.getTxn().rollback();
            }
        }
    }
    
    public static void inTransaction(Closures.Run closure) {
        final ObjectifyFactory factory = factory();
        Objectify objectify = factory.beginTransaction();
        try {
            closure.exec(objectify);
            objectify.getTxn().commit();
        } finally {
            if (objectify.getTxn().isActive()) {
                objectify.getTxn().rollback();
            }
        }
    }
    
    public static <R, E extends Exception> R inTransaction(Closures.Closure<R, E> closure) throws E {
        final ObjectifyFactory factory = factory();
        Objectify objectify = factory.beginTransaction();
        try {
            R result = closure.exec(objectify);
            objectify.getTxn().commit();
            return result;
        } finally {
            if (objectify.getTxn().isActive()) {
                objectify.getTxn().rollback();
            }
        }
    }
    
    public static <R> R inTransaction(Closures.Result<R> closure) {
        final ObjectifyFactory factory = factory();
        Objectify objectify = factory.beginTransaction();
        try {
            R result = closure.exec(objectify);
            objectify.getTxn().commit();
            return result;
        } finally {
            if (objectify.getTxn().isActive()) {
                objectify.getTxn().rollback();
            }
        }
    }
}
