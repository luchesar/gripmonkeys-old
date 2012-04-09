package org.bitbucket.cursodeconducir.services;

import static junit.framework.Assert.*;
import static org.mockito.Matchers.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.Question;
import org.bitbucket.cursodeconducir.services.storage.QuestionStorage;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalMemcacheServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalTaskQueueTestConfig;
import com.google.common.collect.Lists;
import com.google.gson.Gson;

public class QuestionStorageServletTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected QuestionStorage storage;
	protected QuestionStorageServlet servlet;
	private Gson gson;

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ServletOutputStream responseOutputStream;
	private StringWriter responseWriter = new StringWriter();

	private Question question1;

	private Question question2;

	@Before
	public void setUp() throws Exception {
		helper.setUp();
		gson = new Gson();

		MockitoAnnotations.initMocks(this);
		resetResponse();

		servlet = new QuestionStorageServlet();
		storage = servlet.getStorage();

		question1 = new Question("question1", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
		question2 = new Question("question2", "image", "description",
				Lists.newArrayList("question1", "question2"), 0, "explanation",
				Lists.newArrayList("image1", "image2"));
	}

	private void resetResponse() throws IOException {
		reset(response);
		when(response.getOutputStream()).thenReturn(responseOutputStream);
		when(response.getWriter()).thenReturn(new PrintWriter(responseWriter));
	}

	@After
	public void tearDown() throws Exception {
		helper.tearDown();
	}

	@Test
	public void testDoPut() throws Exception {
		when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(
				null);
		servlet.doPut(request, response);

		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
		verify(responseOutputStream).write(
				(QuestionStorageServlet.INVALID_JSON + null).getBytes());

		when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(
				gson.toJson(Lists.newArrayList(question1)));
		servlet.doPut(request, response);

		List<Question> allTests = storage.getAll();
		assertEquals(1, allTests.size());

		Question storedQuestion = allTests.iterator().next();
		question1.setId(storedQuestion.getId());

		assertEquals(storedQuestion, question1);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion)), responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_CREATED);
	}

	@Test
	public void testDoPutMultiple() throws Exception {
		when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(
				gson.toJson(Lists.newArrayList(question1, question2)));
		servlet.doPut(request, response);

		List<Question> allTests = storage.getAll();
		assertEquals(2, allTests.size());

		Iterator<Question> iterator = allTests.iterator();
		Question storedQuestion1 = iterator.next();
		Question storedQuestion2 = iterator.next();
		question1.setId(storedQuestion1.getId());
		question2.setId(storedQuestion2.getId());

		assertEquals(storedQuestion1, question1);
		assertEquals(storedQuestion2, question2);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion1,
				storedQuestion2)), responseWriter.toString());
	}

	@Test
	public void testDoGet() throws Exception {
		question1 = storage.put(question1).iterator().next();
		question2 = storage.put(question2).iterator().next();

		when(request.getParameter("*")).thenReturn("*");
		servlet.doGet(request, response);
		assertEquals(gson.toJson(Lists.newArrayList(question1, question2)),
				responseWriter.toString());
		verify(response, never()).setStatus(anyInt());

		when(request.getParameter("*")).thenReturn(null);
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question2.getId() + "");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(question2), responseWriter.toString());

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				"11111111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);

		assertEquals("", responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question1.getId() + "," + question2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Question[] { question1, question2 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question2.getId() + "," + question1.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Question[] { question2, question1 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question1.getId() + ",768," + question2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Question[] { question1, question2 }),
				responseWriter.toString());
	}

	@Test
	public void testDoDelete() throws Exception {
		question1 = storage.put(question1).iterator().next();
		question2 = storage.put(question2).iterator().next();

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question2.getId() + "");
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(question1), storage.getAll());

		when(request.getParameter(QuestionStorageServlet.ID))
				.thenReturn("1111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doDelete(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());
	}

	@Test
	public void testDoDeleteMultiple() throws Exception {
		question1 = storage.put(question1).iterator().next();
		question2 = storage.put(question2).iterator().next();

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				question1.getId() + "," + question2.getId());
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(), storage.getAll());
	}
}
