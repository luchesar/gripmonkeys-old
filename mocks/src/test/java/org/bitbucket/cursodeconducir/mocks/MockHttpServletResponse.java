package org.bitbucket.cursodeconducir.mocks;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.Locale;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import com.google.common.collect.LinkedHashMultimap;
import com.google.common.collect.Multimap;

public class MockHttpServletResponse implements HttpServletResponse {

    private static final String CHARACTER_SET = "UTF-8";

    private int m_status;
    private final PrintWriter m_printWriter;
    private final ByteArrayOutputStream m_outStream;
    private final ServletOutputStream m_servletStream;
    private String m_encoding;
    private String m_contentType;

    // Use a linked hash multimap to keep insertion ordering hence make life
    // easier for tests.
    private Multimap<String, String> m_headers = LinkedHashMultimap.create();

    public MockHttpServletResponse() {
        m_outStream = new ByteArrayOutputStream();
        m_servletStream = new ServletOutputStream() {
            @Override
            public void write(int b) throws IOException {
                m_outStream.write(b);
            }
        };
        try {
            m_printWriter = new PrintWriter(new OutputStreamWriter(m_servletStream, CHARACTER_SET));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    public String getResponseText() {
        try {
            m_printWriter.flush();
            return m_outStream.toString(CHARACTER_SET);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void setStatus(int status) {
        m_status = status;
    }

    public int getStatus() {
        return m_status;
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        return m_printWriter;
    }

    @Override
    public void sendError(int status) throws IOException {
        setStatus(status);
    }

    @Override
    public void sendError(int status, String message) throws IOException {
        setStatus(status);
        getWriter().write(message);
    }

    @Override
    public void setCharacterEncoding(String encoding) {
        m_encoding = encoding;
    }

    @Override
    public String getCharacterEncoding() {
        return m_encoding;
    }

    @Override
    public void addCookie(Cookie arg0) {
        // do nothing
    }

    @Override
    public void addDateHeader(String arg0, long arg1) {
        // do nothing
    }

    @Override
    public void addHeader(String name, String value) {
        m_headers.put(name, value);
    }

    @Override
    public void addIntHeader(String name, int value) {
        m_headers.put(name, Integer.toString(value));
    }

    @Override
    public boolean containsHeader(String name) {
        return m_headers.containsKey(name);
    }

    @Override
    public String encodeRedirectURL(String arg0) {
        return null;
    }

    @Override
    public String encodeRedirectUrl(String arg0) {
        return null;
    }

    @Override
    public String encodeURL(String arg0) {
        return null;
    }

    @Override
    public String encodeUrl(String arg0) {
        return null;
    }

    @Override
    public void sendRedirect(String arg0) throws IOException {
        // do nothing
    }

    @Override
    public void setDateHeader(String arg0, long arg1) {
        // do nothing
    }

    @Override
    public void setHeader(String name, String value) {
        m_headers.removeAll(name);
        m_headers.put(name, value);
    }

    @Override
    public void setIntHeader(String name, int value) {
        setHeader(name, Integer.toString(value));
    }

    @Override
    public void setStatus(int arg0, String arg1) {
        // do nothing
    }

    @Override
    public void flushBuffer() throws IOException {
        // do nothing
    }

    @Override
    public int getBufferSize() {
        return 0;
    }

    @Override
    public String getContentType() {
        return m_contentType;
    }

    @Override
    public Locale getLocale() {
        return null;
    }

    @Override
    public ServletOutputStream getOutputStream() throws IOException {
        return m_servletStream;
    }

    @Override
    public boolean isCommitted() {
        return false;
    }

    @Override
    public void reset() {
        // do nothing
    }

    @Override
    public void resetBuffer() {
        // do nothing
    }

    @Override
    public void setBufferSize(int arg0) {
        // do nothing
    }

    @Override
    public void setContentLength(int arg0) {
        // do nothing
    }

    @Override
    public void setContentType(String contentType) {
        m_contentType = contentType;
    }

    @Override
    public void setLocale(Locale arg0) {
        // do nothing
    }

    public Collection<String> getHeader(String name) {
        return m_headers.get(name);
    }

    public Multimap<String, String> getAllHeaders() {
        return m_headers;
    }

    /**
     * Look up headers for which there should be at most one value
     * 
     * @param name
     *            The name of the header parameter to look up.
     * 
     * @return null if there are no values, the header value if a single value
     *         exists, or throws an IllegalStateException if there are more than
     *         one value.
     * 
     * 
     */
    public String getOneAndOnlyHeader(String name) {
        Collection<String> values = m_headers.get(name);
        if (values.size() > 1) {
            throw new IllegalStateException("" + values.size()
                    + " values found, shouldn't be more than one");
        }
        if (values.size() == 0) {
            return null;
        }
        return values.iterator().next();
    }

}
