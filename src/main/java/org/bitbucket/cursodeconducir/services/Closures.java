package org.bitbucket.cursodeconducir.services;

import com.google.appengine.api.datastore.DatastoreService;

public interface Closures {
    interface Closure<R,E extends Exception> extends Closures {
        public R exec(DatastoreService ds) throws E;
    }
    
    interface Void <E extends Exception> extends Closures {
        void exec(DatastoreService ds) throws E;
    }
    
    interface Result<R> extends Closures {
        R exec(DatastoreService ds);
    }
}
