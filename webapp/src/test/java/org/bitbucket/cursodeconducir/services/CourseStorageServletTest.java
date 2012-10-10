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

import org.bitbucket.cursodeconducir.services.entity.Course;
import org.bitbucket.cursodeconducir.services.storage.CourseStorage;
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

public class CourseStorageServletTest {
	private final LocalServiceTestHelper helper = new LocalServiceTestHelper(
			new LocalDatastoreServiceTestConfig(),
			new LocalMemcacheServiceTestConfig(),
			new LocalTaskQueueTestConfig());

	protected CourseStorage storage;
	protected CoursesStorageServlet servlet;
	private Gson gson;

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ServletOutputStream responseOutputStream;
	private StringWriter responseWriter = new StringWriter();

	private Course course1;
	private Course course2;

	@Before
	public void setUp() throws Exception {
		helper.setUp();
		gson = new Gson();

		MockitoAnnotations.initMocks(this);
		resetResponse();

		servlet = new CoursesStorageServlet();
		storage = servlet.getStorage();

		course1 = new Course("course1", "image", "description", Lists.newArrayList(1, 2, 3));
		course2 = new Course("course2", "image", "description",Lists.newArrayList(2, 3, 1));
	}

	private void resetResponse() throws IOException {
		reset(response);
		when(response.getOutputStream()).thenReturn(responseOutputStream);
		responseWriter = new StringWriter();
		when(response.getWriter()).thenReturn(new PrintWriter(responseWriter));
	}

	@After
	public void tearDown() throws Exception {
		helper.tearDown();
	}

	@Test
	public void testDoPut() throws Exception {
		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY)).thenReturn(
				null);
		servlet.doPut(request, response);

		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);
		verify(responseOutputStream).write(
				(TitledEntityStorageServlet.INVALID_JSON + null).getBytes());

		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY)).thenReturn(
				gson.toJson(Lists.newArrayList(course1)));
		servlet.doPut(request, response);

		List<Course> allTests = storage.getAll();
		assertEquals(1, allTests.size());

		Course storedQuestion = allTests.iterator().next();
		course1.setId(storedQuestion.getId());

		assertEquals(storedQuestion, course1);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion)), responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_CREATED);
	}

	@Test
	public void testDoPutMultiple() throws Exception {
		when(request.getParameter(TitledEntityStorageServlet.JSON_KEY)).thenReturn(
				gson.toJson(Lists.newArrayList(course1, course2)));
		servlet.doPut(request, response);

		List<Course> allTests = storage.getAll();
		assertEquals(2, allTests.size());

		Iterator<Course> iterator = allTests.iterator();
		Course storedQuestion1 = iterator.next();
		Course storedQuestion2 = iterator.next();
		course1.setId(storedQuestion1.getId());
		course2.setId(storedQuestion2.getId());

		assertEquals(storedQuestion1, course1);
		assertEquals(storedQuestion2, course2);

		assertEquals(gson.toJson(Lists.newArrayList(storedQuestion1,
				storedQuestion2)), responseWriter.toString());
	}

	@Test
	public void testDoGet() throws Exception {
		course1 = storage.put(course1).iterator().next();
		course2 = storage.put(course2).iterator().next();

		when(request.getParameter("*")).thenReturn("*");
		servlet.doGet(request, response);
		assertEquals(gson.toJson(Lists.newArrayList(course1, course2)),
				responseWriter.toString());
		verify(response, never()).setStatus(anyInt());

		when(request.getParameter("*")).thenReturn(null);
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course2.getId() + "");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(course2), responseWriter.toString());

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				"11111111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);

		assertEquals("", responseWriter.toString());
		verify(response).setStatus(HttpServletResponse.SC_NOT_FOUND);

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course1.getId() + "," + course2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course1, course2 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course2.getId() + "," + course1.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course2, course1 }),
				responseWriter.toString());

		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course1.getId() + ",768," + course2.getId());
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course1, course2 }),
				responseWriter.toString());
	}
	
	@Test
	public void testDoGetPaged() throws Exception {
		course1 = storage.put(course1).iterator().next();
		course2 = storage.put(course2).iterator().next();
		Course course3 = storage.put(new Course("course3", "image", "description",
				Lists.newArrayList(1, 2))).iterator().next();
		Course course4 = storage.put(new Course("course4", "image", "description",
				Lists.newArrayList(1, 2))).iterator().next();
		Course course5 = storage.put(new Course("course5", "image", "description",
				Lists.newArrayList(1, 2))).iterator().next();
		
		
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("-1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("1");
		servlet.doGet(request, response);
		verify(response).setStatus(HttpServletResponse.SC_BAD_REQUEST);
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("0");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("-1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course1, course2, course3, course4, course5}),
				responseWriter.toString());
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("0");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course1}),
				responseWriter.toString());
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("1");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course2}),
				responseWriter.toString());
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("4");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course2, course3, course4, course5}),
				responseWriter.toString());
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("3");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("5");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course4, course5}),
				responseWriter.toString());
		
		resetResponse();
		when(request.getParameter(TitledEntityStorageServlet.OFFSET)).thenReturn("1");
		when(request.getParameter(TitledEntityStorageServlet.LENGTH)).thenReturn("3");
		servlet.doGet(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(new Course[] { course2, course3, course4}),
				responseWriter.toString());
	}

	@Test
	public void testDoDelete() throws Exception {
		course1 = storage.put(course1).iterator().next();
		course2 = storage.put(course2).iterator().next();

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course2.getId() + "");
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(course1), storage.getAll());

		when(request.getParameter(TitledEntityStorageServlet.ID))
				.thenReturn("1111");
		responseWriter.getBuffer().delete(0,
				responseWriter.getBuffer().length());
		servlet.doDelete(request, response);
		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());
	}

	@Test
	public void testDoDeleteMultiple() throws Exception {
		course1 = storage.put(course1).iterator().next();
		course2 = storage.put(course2).iterator().next();

		when(request.getParameter(TitledEntityStorageServlet.ID)).thenReturn(
				course1.getId() + "," + course2.getId());
		servlet.doDelete(request, response);

		verify(response, never()).setStatus(anyInt());
		assertEquals(gson.toJson(true), responseWriter.toString());

		assertEquals(Lists.newArrayList(), storage.getAll());
	}
}
