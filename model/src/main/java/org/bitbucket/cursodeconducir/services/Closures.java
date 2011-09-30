package org.bitbucket.cursodeconducir.services;

import com.googlecode.objectify.Objectify;

public interface Closures {
    interface Closure<R,E extends Exception> extends Closures {
        public R exec(Objectify objectify) throws E;
    }
    
    interface Result<R> extends Closures {
        R exec(Objectify objectify);
    }
    
    interface Void <E extends Exception> extends Closures {
        void exec(Objectify objectify) throws E;
    }
    
    interface Run extends Closures {
        void exec(Objectify objectify);
    }
}


