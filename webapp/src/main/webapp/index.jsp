<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.bitbucket.cursodeconducir.services.storage.TestStorage"%>
<%@ page import="com.google.gson.Gson"%>

<%
    TestStorage storage = new TestStorage();
			Gson gson = new Gson();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Curso de conducir</title>
<meta name="description"
  content="autoescuela, auto escuela, auto escuela online, autoescuela online,  test dgt, tests dgt, test de conducir, carnet de conducir, carne de conducir, test de trafico, curso conducir, cursoconducir, todotest, todo test, test dgt 2011, tests dgt 2011" />
<meta name="author" content="" />
<%@include file="modules/cssAndJs.html"%>
<style type="text/css">
body {
	padding-top: 60px;
}
</style>
<link rel="" href="http://s7.addthis.com/js/300/addthis_widget.js#pubid=xa-4eebef120e5ccc31" />
<script id="testPreviewTemplate" type="x-tmpl-mustache">
    <%@include file="/modules/testPreview.html"%>
</script>
<script id="testNavigationTemplate" type="x-tmpl-mustache">
<div class="pagination pull-right">
    <ul>
        {{#allTests}}
            <li {{#active}}class="active"{{/active}}><a href="#preview?test={{id}}">{{title}}</a></li>
        {{/allTests}}
        
        <li class="next {{^hasNext}}disabled{{/hasNext}}">
             <a {{#hasNext}}href="#preview?test={{nextTestId}}"{{/hasNext}}>Siguiente &rarr;</a>
        </li>
    </ul>
</div>
</script>
<script>
    
<%@include file="/index.js"%>
    
<%@include file="/modules/testPreview.js"%>
    var _page;
    $(function() {
        var allTests =
<%=gson.toJson(storage.getAll())%>
    ;
        var indexPage = new IndexPage();
        indexPage.start(allTests);
        _page = indexPage;
    });
</script>

</head>

<body>
  <%@include file="modules/menu.html"%>

  <div class="container">
    <div id="headerHintContainer" class="row">
      <div class="span16">
        <h2>
          Aprueba el test del carnet dec coche a la primera
          <p>
            <hint>Test y cursos para preparar el test de la dgt de forma facil, amena, eficiente, divertid.
              Éxito garantizado!!</hint>
          </p>
        </h2>
      </div>
    </div>
    <!-- Main hero unit for a primary marketing message or call to action -->
    <div class="row">
      <div id="testContainer"></div>
    </div>
    <div id="nextTestLinkContainer" class="row hide">
      <div id="testNavigationContainer" class="span16"></div>
    </div>
    <div id="addThisContainer" class="row">
      <div class="span4">
        <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
          <a class="addthis_button_preferred_1"></a> <a class="addthis_button_preferred_2"></a> <a
            class="addthis_button_preferred_3"></a> <a class="addthis_button_google_plusone_badge"></a>
        </div>
      </div>
      <div class="span8">&nbsp;</div>
      <div class="span4">
        <div class="addthis_toolbox addthis_default_style addthis_16x16_style">
          <a class="addthis_button_facebook_like"></a> <a class="addthis_button_tweet"></a>
        </div>
      </div>
      <script type="text/javascript" src="http://s7.addthis.com/js/300/addthis_widget.js#pubid=xa-4eebef120e5ccc31"></script>
    </div>
    <div id="threeTutorialsContainer" class="row">
      <div class="span16 page-header page-header-ext" align="center">
        <h3>Los 3 tutoriales 100% gratuitos</h3>
      </div>
      <div class="span6">
        <div class="span3">
          <h2>Seminario</h2>
          <div class="content">
            <div class="media-grid">
              <a><img src="/images/homePage2.png" /> </a>
            </div>
            <p>Completo tutorial Tests, conceptos importantes y video animaciones</p>
            <div align="right">
              <a class="btn small info">leer más >></a>
            </div>
          </div>
        </div>
      </div>
      <div class="span6">
        <div class="span3">
          <h2>Trucos</h2>
          <div class="content">
            <div class="media-grid">
              <a><img src="/images/homePage1.jpg" /> </a>
            </div>
            <p>Trucos del examen tipo test de la dgt
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <div align="right">
              <a class="btn small info">leer más >></a>
            </div>
          </div>
        </div>
      </div>
      <div class="inner">
        <div class="span3">
          <h2 class="title">Tests</h2>
          <div class="content">
            <div class="media-grid">
              <a><img src="/images/homePage2.png" /> </a>
            </div>
            <p>Test de la dgt 2012 con
              explicaciones&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <div align="right">
              <a class="btn small info">leer más >></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
    <p>&copy; Company 2011</p>
    </footer>
  </div>
</body>
</html>
