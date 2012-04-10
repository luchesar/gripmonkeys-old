package org.bitbucket.cursodeconducir.services;

import java.io.IOException;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.bitbucket.cursodeconducir.services.storage.LessonStorage;

import com.google.common.collect.Lists;
import com.google.gson.Gson;

@SuppressWarnings("serial")
public class LessonStorageServlet extends HttpServlet {
	public static final String JSON_KEY = "json";
	public static final String ID = "key";
	public static final String INVALID_JSON = "passed test JSON is not valid:";
	private Gson gson;
	private LessonStorage storage;

	public LessonStorageServlet() {
		gson = new Gson();
		storage = new LessonStorage();
	}

	@Override
	protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
			throws ServletException, IOException {
		setResponseEnconding(aResp);
		String all = aReq.getParameter("*");
		if (all != null) {
			gson.toJson(storage.getAll(), aResp.getWriter());
		} else {
			long[] ids = getIdArray(aReq.getParameter(ID));
			Set<Lesson> foundQuestions = storage.get(ids);
			if (foundQuestions.isEmpty()) {
				aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else if (foundQuestions.size() == 1) {
				gson.toJson(foundQuestions.iterator().next(), aResp.getWriter());
			} else {
				gson.toJson(foundQuestions, aResp.getWriter());
			}
		}
	}

	private long[] getIdArray(String idString) {
		String[] idStrings = idString.split(",");
		long[] ids = new long[idStrings.length];
		for (int i = 0; i < idStrings.length; i++) {
			ids[i] = Long.parseLong(idStrings[i]);
		}
		return ids;
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
		java.util.List<Lesson> questionsToStore = Lists.newArrayList();
		String questionsJson = aReq.getParameter(JSON_KEY);
		if (questionsJson == null) {
			aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
			IOUtils.write(INVALID_JSON + questionsJson, aResp.getOutputStream());
			return;
		}
		Lesson[] deserializedQuestions = gson.fromJson(questionsJson,
				new Lesson[0].getClass());
		questionsToStore.addAll(Lists.newArrayList(deserializedQuestions));
		try {
			Set<Lesson> put = storage.put(questionsToStore
					.toArray(new Lesson[0]));
			aResp.getWriter().write(gson.toJson(put));
			aResp.setStatus(HttpServletResponse.SC_CREATED);
		} catch (ServiceException e) {
			aResp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	protected void doDelete(HttpServletRequest aReq, HttpServletResponse aResp)
			throws ServletException, IOException {
		setResponseEnconding(aResp);
		long[] ids = getIdArray(aReq.getParameter(ID));
		storage.delete(ids);
		aResp.getWriter().write(gson.toJson(true));
	}

	public LessonStorage getStorage() {
		return storage;
	}

	private void setResponseEnconding(HttpServletResponse aResp) {
		aResp.setContentType("application/json; charset=utf-8");
		aResp.setCharacterEncoding("UTF-8");
	}
}
