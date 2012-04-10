package org.bitbucket.cursodeconducir.services;

import static junit.framework.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.reset;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bitbucket.cursodeconducir.services.entity.Lesson;
import org.bitbucket.cursodeconducir.services.storage.LessonStorage;
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

public class LessonStorageServletTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected LessonStorage storage;
	protected LessonStorageServlet servlet;
	private Gson gson;

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ServletOutputStream responseOutputStream;
	private StringWriter responseWriter = new StringWriter();

	private Lesson lesson1;
	private Lesson lesson2;
	
	private int k1 = 1;
    private int k2 = 2;
    private int k3 = 3;

	@Before
	public void setUp() throws Exception {
		helper.setUp();
		gson = new Gson();

		MockitoAnnotations.initMocks(this);
		resetResponse();

		servlet = new LessonStorageServlet();
		storage = servlet.getStorage();

		lesson1 = new Lesson("lesson1", "image", "description", Lists.newArrayList(k1, k2, k3));
        lesson2 = new Lesson("lesson2", "image", "description", Lists.newArrayList(k1, k2, k3));
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
				gson.toJson(Lists.newArrayList(lesson1)));
		servlet.doPut(request, response);

		List<Lesson> allTests = storage.getAll();
		assertEquals(1, allTests.size());

		Lesson storedQuestion = allTests.iterator().next();
		lesson1.setId(storedQuestion.getId());

		assertEquals(storedQuestion, lesson1);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion)), responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_CREATED);
	}

	@Test
	public void testDoPutMultiple() throws Exception {
		when(request.getParameter(QuestionStorageServlet.JSON_KEY)).thenReturn(
				gson.toJson(Lists.newArrayList(lesson1, lesson2)));
		servlet.doPut(request, response);

		List<Lesson> allTests = storage.getAll();
		assertEquals(2, allTests.size());

		Iterator<Lesson> iterator = allTests.iterator();
		Lesson storedQuestion1 = iterator.next();
		Lesson storedQuestion2 = iterator.next();
		lesson1.setId(storedQuestion1.getId());
		lesson2.setId(storedQuestion2.getId());

		assertEquals(storedQuestion1, lesson1);
		assertEquals(storedQuestion2, lesson2);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion1,
				storedQuestion2)), responseWriter.toString());
	}

	@Test
	public void testDoGet() throws Exception {
		lesson1 = storage.put(lesson1).iterator().next();
		lesson2 = storage.put(lesson2).iterator().next();

		when(request.getParameter("*")).thenReturn("*");
		servlet.doGet(request, response);
		assertEquals(gson.toJson(Lists.newArrayList(lesson1, lesson2)),
				responseWriter.toString());
		verify(response, never()).setStatus(anyInt());

		when(request.getParameter("*")).thenReturn(null);
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson2.getId() + "");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(lesson2), responseWriter.toString());

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				"11111111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);

		assertEquals("", responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson1.getId() + "," + lesson2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Lesson[] { lesson1, lesson2 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson2.getId() + "," + lesson1.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Lesson[] { lesson2, lesson1 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson1.getId() + ",768," + lesson2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Lesson[] { lesson1, lesson2 }),
				responseWriter.toString());
	}

	@Test
	public void testDoDelete() throws Exception {
		lesson1 = storage.put(lesson1).iterator().next();
		lesson2 = storage.put(lesson2).iterator().next();

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson2.getId() + "");
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(lesson1), storage.getAll());

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
		lesson1 = storage.put(lesson1).iterator().next();
		lesson2 = storage.put(lesson2).iterator().next();

		when(request.getParameter(QuestionStorageServlet.ID)).thenReturn(
				lesson1.getId() + "," + lesson2.getId());
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(), storage.getAll());
	}
}
