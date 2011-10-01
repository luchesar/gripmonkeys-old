package org.bitbucket.cursodeconducir.services;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.Test;

import com.google.gson.Gson;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyFactory;

@SuppressWarnings("serial")
public class TestStorageServlet extends HttpServlet {
    private static final String TEST_KEY = "key";
    private Gson gson;
    private static ObjectifyFactory fact;

    static {
        fact = new ObjectifyFactory();
        fact.register(Test.class);
    }

    public TestStorageServlet() {
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        String keyString = aReq.getParameter(TEST_KEY);
        final Key<Test> key = new Key<Test>(Test.class, keyString);
        Test test = Util.inTransaction(new Closures.Result<Test>() {

            @Override
            public Test exec(Objectify objectify) {
                return objectify.get(key);
            }
        });
        gson.toJson(test, aResp.getWriter());
    }

    @Override
    protected void doPut(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        final Test test = gson.fromJson(aReq.getReader(), Test.class);
        Key<Test> testKey = Util.inTransaction(new Closures.Result<Key<Test>>() {

            @Override
            public Key<Test> exec(Objectify objectify) {
                return objectify.put(test);
            }
        });
        aResp.addHeader(TEST_KEY, testKey.toString());
    }

    @Override
    protected void doDelete(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        final String keyString = aReq.getParameter(TEST_KEY);
        Util.inTransaction(new Closures.Run() {

            @Override
            public void exec(Objectify objectify) {
                objectify.delete(new Key<Test>(Test.class, keyString));
            }
        });
        super.doDelete(aReq, aResp);
    }
}
