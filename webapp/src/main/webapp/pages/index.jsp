<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.bitbucket.cursodeconducir.services.storage.QuestionStorage"%>
<%@ page import="com.google.gson.Gson"%>
<%
    QuestionStorage storage = new QuestionStorage();
			Gson gson = new Gson();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Curso Conducir</title>
<meta name="description"
  content="autoescuela, auto escuela, auto escuela online, autoescuela online,  test dgt, tests dgt, test de conducir, carnet de conducir, carne de conducir, test de trafico, curso conducir, cursoconducir, todotest, todo test, test dgt 2011, tests dgt 2011" />
<meta name="author" content="" />
<link rel="stylesheet" href="/css/bootstrap.css"/>
<link rel="stylesheet" href="/css/docs.css"/>
<style type="text/css">
body {
	padding-top: 60px;
}
</style>
<link rel="" href="http://s7.addthis.com/js/300/addthis_widget.js#pubid=xa-4eebef120e5ccc31" />
<link href="/images/logo.png" />
<script src="../jslib/jquery-1.6.4.js" charset="UTF-8"></script>
<script src="http://localhost:9810/compile?id=index&mode=raw&level=verbose" charset="UTF-8"></script>

<script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push([ '_setAccount', 'UA-27699376-1' ]);
    _gaq.push([ '_trackPageview' ]);

    (function() {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl'
                : 'http://www')
                + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
</script>
</head>

<body>
  <%@include file="menu.html"%>
  <div id="indexContainer"></div>
  <footer id="footer">
    <div class="container">
        <div class="row">
            <div class="span6 offset7">
                <p>&copy; CursoConducir 2012</p>
            </div>
        </div>    
    </div>
  </footer>
</body>
</html>
