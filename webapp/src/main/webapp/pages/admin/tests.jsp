<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Test management</title>
<meta name="description" content="">
<meta name="author" content="">
<link rel="stylesheet" type="text/css" href="/css/jquery.wysiwyg.css" />
<%@include file="../../modules/cssAndJs.html"%>
<style type="text/css">
/* Override some defaults */
html,body {
	background-color: #eee;
}

body {
	padding-top: 40px;
	/* 40px to make the container go all the way to the bottom of the topbar */
}

/* The white background content wrapper */
.content {
	background-color: #fff;
	padding: 20px;
	margin: 0 -20px;
	/* negative indent the amount of the padding to maintain the grid system */
	-webkit-border-radius: 0 0 6px 6px;
	-moz-border-radius: 0 0 6px 6px;
	border-radius: 0 0 6px 6px;
	-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
	-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
	box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
}

/* Page header tweaks */
.page-header-ext {
	background-color: #f5f5f5;
	padding: 20px 20px 10px;
	margin: -20px -20px 20px;
}

.testDescription-input {
	width: 200px;
	height: 150px
}
</style>

<link rel="shortcut icon" href="/favicon.ico">
<link rel="placeholder" href="http://placehold.it/210x150">

<script src="../../jslib/closure/goog/base.js"></script>
<script src="../../deps.js"></script>
<script>goog.require('cursoconducir.admin.TestsPage');</script> 
<!-- <script src="/jsgen/adminTests.compiled.js"></script>-->
<script type="text/javascript">
cursoconducir.admin.tests.init();
</script>

</head>
<body>
  <%@include file="../../modules/menu.html"%>
  <div class="container">
    <div class="content">
      <div class="page-header page-header-ext">
        <div class="container">
          <div class="row">
            <div class="span10">
              <h1>
                Manage Tests <small>Create new or modify old tests</small>
              </h1>
            </div>
            <div class="span6">
              <div class="pull-right pageButtons"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container feedback hide"></div>
      <div class="row" id="container"></div>
      <div class="container feedback hide"></div>
      <div class="container">
        <div class="container">
          <div class="row">
            <div class="span10">&nbsp;</div>
            <div class="span6">
              <div class="pull-right pageButtons">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer id="footer">
      <p>&copy; Company 2011</p>
    </footer>
  </div>
</body>
</html>