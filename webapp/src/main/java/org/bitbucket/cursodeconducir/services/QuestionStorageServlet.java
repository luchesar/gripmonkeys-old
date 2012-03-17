package org.bitbucket.cursodeconducir.services;

import java.io.IOException;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.bitbucket.cursodeconducir.services.entity.Question;
import org.bitbucket.cursodeconducir.services.storage.QuestionStorage;

import com.google.gson.Gson;

@SuppressWarnings("serial")
public class QuestionStorageServlet extends HttpServlet {
    public static final String JSON_KEY = "json";
    public static final String ID = "key";
    public static final String INVALID_JSON = "passed test JSON is not valid:";
    private Gson gson;
    private QuestionStorage storage;

    public QuestionStorageServlet() {
        gson = new Gson();
        storage = new QuestionStorage();
    }

    @Override
    protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        setResponseEnconding(aResp);
        String all = aReq.getParameter("*");
        if (all != null) {
            gson.toJson(storage.getAll(), aResp.getWriter());
        } else {
            String idString = aReq.getParameter(ID);
            Long id = Long.parseLong(idString);
            Set<Question> foundQuestions = storage.get(id);
            if (foundQuestions.isEmpty()) {
                aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            } else {
                gson.toJson(foundQuestions.iterator().next(), aResp.getWriter());
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        doPost(aReq, aResp);
    }

    @Override
    protected void doPost(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        setResponseEnconding(aResp);
        String testJson = aReq.getParameter(JSON_KEY);
        final Question test = gson.fromJson(testJson, Question.class);
        if (test == null) {
            aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            IOUtils.write(INVALID_JSON + testJson, aResp.getOutputStream());
            return;
        }
        try {
            Set<Question> put = storage.put(test);
            aResp.getWriter().write(gson.toJson(put.iterator().next()));
            aResp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (ServiceException e) {
            aResp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest aReq, HttpServletResponse aResp)
            throws ServletException, IOException {
        setResponseEnconding(aResp);
        final String keyString = aReq.getParameter(ID);
        storage.delete(Long.parseLong(keyString));
        aResp.getWriter().write(gson.toJson(true));
    }

    public QuestionStorage getStorage() {
        return storage;
    }

    private void setResponseEnconding(HttpServletResponse aResp) {
        aResp.setContentType("application/json; charset=utf-8");
        aResp.setCharacterEncoding("UTF-8");
    }
}
