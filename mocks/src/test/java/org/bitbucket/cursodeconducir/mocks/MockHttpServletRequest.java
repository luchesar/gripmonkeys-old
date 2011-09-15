/**
 * (c) 2007 Ontology-Partners Ltd.  All rights reserved.
 *
 * Creator: carl
 */
package org.bitbucket.cursodeconducir.mocks;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * @author carl
 * 
 */
public class MockHttpServletRequest implements HttpServletRequest {

    private final HashMap<String, String[]> m_parameters;

    private HttpSession m_session;

    private String m_pathInfo;

    private String m_method;

    private String m_protocol;

    private String m_content;

    private String m_queryString;

    private String m_contentType;

    private Map<String, String> m_headers;

    public MockHttpServletRequest() {
        m_parameters = new LinkedHashMap<String, String[]>();
        m_headers = new LinkedHashMap<String, String>();
    }

    public String getParameter(String name) {
        String[] strings = m_parameters.get(name);
        return strings == null ? null : strings[0];
    }

    public Map getParameterMap() {
        return m_parameters;
    }

    public HttpSession getSession() {
        return m_session;
    }

    public void setSession(HttpSession session) {
        m_session = session;
    }

    public Enumeration getParameterNames() {
        return new CollectionEnumeration(m_parameters.keySet());
    }

    public void setParameters(HashMap<String, String[]> parameters) {
        m_parameters.putAll(parameters);
    }

    public void setPathInfo(String pathInfo) {
        m_pathInfo = pathInfo;
    }

    public String getPathInfo() {
        return m_pathInfo;
    }

    public String getAuthType() {
        return null;
    }

    public String getContextPath() {
        return null;
    }

    public Cookie[] getCookies() {
        return null;
    }

    public long getDateHeader(String name) {
        return 0;
    }

    public String getHeader(String name) {
        return m_headers.get(name);
    }

    public Enumeration getHeaderNames() {
        return Collections.enumeration(m_headers.keySet());
    }

    public Enumeration getHeaders(String name) {
        String value = m_headers.get(name);
        if (value != null) {
            return Collections.enumeration(Collections.singletonList(value));
        } else {
            return Collections.enumeration(new ArrayList<String>());
        }
    }

    public int getIntHeader(String arg0) {
        return 0;
    }

    public String getMethod() {
        return m_method;
    }

    public void setMethod(String method) {
        m_method = method;
    }

    public String getPathTranslated() {
        return null;
    }

    public String getQueryString() {
        return m_queryString;
    }

    public String getRemoteUser() {
        return null;
    }

    public String getRequestURI() {
        return null;
    }

    public StringBuffer getRequestURL() {
        return null;
    }

    public String getRequestedSessionId() {
        return null;
    }

    public String getServletPath() {
        return null;
    }

    public HttpSession getSession(boolean arg0) {
        return null;
    }

    public Principal getUserPrincipal() {
        return null;
    }

    public boolean isRequestedSessionIdFromCookie() {
        return false;
    }

    public boolean isRequestedSessionIdFromURL() {
        return false;
    }

    public boolean isRequestedSessionIdFromUrl() {
        return false;
    }

    public boolean isRequestedSessionIdValid() {
        return false;
    }

    public boolean isUserInRole(String arg0) {
        return false;
    }

    public Object getAttribute(String arg0) {
        return null;
    }

    public Enumeration getAttributeNames() {
        return null;
    }

    public String getCharacterEncoding() {
        return null;
    }

    public int getContentLength() {
        return 0;
    }

    public String getContentType() {
        return m_contentType;
    }

    public ServletInputStream getInputStream() throws IOException {
        return new ServletInputStream() {
            private final ByteArrayInputStream m_internalData = new ByteArrayInputStream(m_content
                    .getBytes());

            @Override
            public int read() throws IOException {
                return m_internalData.read();
            }
        };
    }

    public String getLocalAddr() {
        return null;
    }

    public String getLocalName() {
        return null;
    }

    public int getLocalPort() {
        return 0;
    }

    public Locale getLocale() {
        return null;
    }

    public Enumeration getLocales() {
        return null;
    }

    public String[] getParameterValues(String param) {
        return m_parameters.get(param);
    }

    public String getProtocol() {
        return m_protocol;
    }

    public void setProtocol(String protocol) {
        m_protocol = protocol;
    }

    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new StringReader(m_content));
    }

    public String getRealPath(String arg0) {
        return null;
    }

    public String getRemoteAddr() {
        return null;
    }

    public String getRemoteHost() {
        return null;
    }

    public int getRemotePort() {
        return 0;
    }

    public RequestDispatcher getRequestDispatcher(String arg0) {
        return null;
    }

    public String getScheme() {
        return null;
    }

    public String getServerName() {
        return null;
    }

    public int getServerPort() {
        return 0;
    }

    public boolean isSecure() {
        return false;
    }

    public void removeAttribute(String arg0) {
        // do nothing
    }

    public void setAttribute(String arg0, Object arg1) {
        // do nothing
    }

    public void setCharacterEncoding(String arg0) throws UnsupportedEncodingException {
        // do nothing
    }

    private static class CollectionEnumeration<E> implements Enumeration {

        private final Iterator m_iterator;

        public CollectionEnumeration(Collection collection) {
            this.m_iterator = collection.iterator();
        }

        public boolean hasMoreElements() {
            return m_iterator.hasNext();
        }

        public Object nextElement() {
            return m_iterator.next();
        }

    }

    public void setContent(String content) {
        m_content = content;
    }

    public void setQueryString(String queryString) {
        m_queryString = queryString;
    }

    public void setParameter(String parameter, String value) {
        String[] values = m_parameters.get(parameter);
        if (values == null) {
            values = new String[1];
        } else {
            values = Arrays.copyOf(values, values.length + 1);
        }
        values[values.length - 1] = value;
        m_parameters.put(parameter, values);
    }
    
    public void setContentType(String contentType) {
        m_contentType = contentType;
    }
    
    public void setHeader(String name, String value) {
        m_headers.put(name, value);
    }

}
