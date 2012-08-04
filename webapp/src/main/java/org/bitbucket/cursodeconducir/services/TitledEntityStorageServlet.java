package org.bitbucket.cursodeconducir.services;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.bitbucket.cursodeconducir.services.entity.TitledEntity;
import org.bitbucket.cursodeconducir.services.storage.TitledEntityStorage;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

@SuppressWarnings("serial")
public abstract class TitledEntityStorageServlet<ES extends TitledEntityStorage<TE>, TE extends TitledEntity>
		extends HttpServlet {
	public static final String JSON_KEY = "json";
	public static final String ID = "key";
	public static final String OFFSET = "offset";
	public static final String LENGTH = "length";
	public static final String INVALID_JSON = "passed test JSON is not valid:";
	private final Gson gson;
	private final ES storage;
	private final Type listOfTE;

	public TitledEntityStorageServlet(ES aStorage, TypeToken<List<TE>> tokenType) {
		gson = new Gson();
		storage = aStorage;
		listOfTE = tokenType.getType();
	}

	@Override
	protected void doGet(HttpServletRequest aReq, HttpServletResponse aResp)
			throws ServletException, IOException {
		setResponseEnconding(aResp);
		String all = aReq.getParameter("*");
		String questionIds = aReq.getParameter(ID);
		String offset = aReq.getParameter(OFFSET);
		String length = aReq.getParameter(LENGTH);

		if (all != null) {
			gson.toJson(storage.getAll(), aResp.getWriter());
		} else if (questionIds != null) {
			long[] ids = getIdArray(questionIds);
			Set<TE> foundEntities = storage.get(ids);
			if (foundEntities.isEmpty()) {
				aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
			} else if (foundEntities.size() == 1) {
				gson.toJson(foundEntities.iterator().next(), aResp.getWriter());
			} else {
				gson.toJson(foundEntities, aResp.getWriter());
			}
		} else if (offset != null) {
			int offsetI = Integer.parseInt(offset);
			int lengthI = Integer.MAX_VALUE;
			if (length != null) {
				lengthI = Integer.parseInt(length);
				if (lengthI < 0) {
					lengthI = Integer.MAX_VALUE;
				}
			}
			if (offsetI < 0) {
				aResp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				aResp.getWriter()
						.write("OFFSET parameter must not be negative");
				return;
			}
			gson.toJson(storage.getAll(offsetI, lengthI), aResp.getWriter());
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
		List<TE> questionsToStore = Lists.newArrayList();
		String questionsJson = aReq.getParameter(JSON_KEY);
		if (questionsJson == null) {
			aResp.setStatus(HttpServletResponse.SC_NOT_FOUND);
			IOUtils.write(INVALID_JSON + questionsJson, aResp.getOutputStream());
			return;
		}
		List<TE> deserialized = gson.fromJson(questionsJson, listOfTE);
		questionsToStore.addAll(deserialized);
		try {
			Set<TE> put = storage.put(questionsToStore);
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

	public ES getStorage() {
		return storage;
	}

	private void setResponseEnconding(HttpServletResponse aResp) {
		aResp.setContentType("application/json; charset=utf-8");
		aResp.setCharacterEncoding("UTF-8");
	}
}
