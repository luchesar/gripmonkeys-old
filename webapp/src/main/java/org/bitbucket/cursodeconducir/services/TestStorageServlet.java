package org.bitbucket.cursodeconducir.services;

import java.io.IOException;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.Test;
import org.bitbucket.cursodeconducir.services.storage.TestStorage;

import com.google.gson.Gson;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;

@SuppressWarnings("serial")
public class TestStorageServlet extends HttpServlet {
    private static final String ID = "key";
    private Gson gson;
    private TestStorage storage;

    public TestStorageServlet() {
        gson = new Gson();
        storage = new TestStorage();
    }

    @Override
    protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        String idString = aReq.getParameter(ID);
        Long id = Long.parseLong(idString);
        gson.toJson(storage.get(id), aResp.getWriter());
    }

    @Override
    protected void doPut(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        final Test test = gson.fromJson(aReq.getReader(), Test.class);
        try {
            Set<Test> put = storage.put(test);
            aResp.addHeader(ID, put.iterator().next().toString());
        } catch (ServiceException e) {
            aResp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        final String keyString = aReq.getParameter(ID);
        Util.inTransaction(new Closures.Run() {

            @Override
            public void exec(Objectify objectify) {
                objectify.delete(new Key<Test>(Test.class, keyString));
            }
        });
        super.doDelete(aReq, aResp);
    }
    
    public TestStorage getStorage() {
        return storage;
    }
}
