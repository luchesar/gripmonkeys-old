<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Test management</title>
<meta name="description" content="">
<meta name="author" content="">
<link rel="stylesheet" type="text/css" href="/css/jquery.wysiwyg.css" />

<%@include file="../modules/cssAndJs.html"%>
<script type="text/javascript" src="/scripts/jquery.wysiwyg.js"></script>
<style type="text/css">
/* Override some defaults */
html,body {
	background-color: #eee;
}

body {
	padding-top: 40px;
	/* 40px to make the container go all the way to the bottom of the topbar */
}

.container {
	width: 820px;
	/* downsize our container to make the content feel a bit tighter and more cohesive. NOTE: this removes two full columns from the grid, meaning you only go to 14 columns and not 16. */
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
.page-header {
	background-color: #f5f5f5;
	padding: 20px 20px 10px;
	margin: -20px -20px 20px;
}

/* Give a quick and non-cross-browser friendly divider */
.content .span4 {
	margin-left: 0;
	padding-left: 19px;
	border-left: 1px solid #eee;
}
</style>

<link rel="shortcut icon" href="favicon.ico">
<script type="text/javascript">
	(function($) {
		$(document).ready(function() {
			$('#testDescription').wysiwyg({
				controls : {
					strikeThrough : {
						visible : true
					},
					underline : {
						visible : true
					},
					separator00 : {
						visible : false
					},
					justifyLeft : {
						visible : true
					},
					justifyCenter : {
						visible : true
					},
					justifyRight : {
						visible : true
					},
					justifyFull : {
						visible : true
					},
					separator01 : {
						visible : false
					},
					indent : {
						visible : true
					},
					outdent : {
						visible : true
					},
					separator02 : {
						visible : false
					},
					subscript : {
						visible : true
					},
					superscript : {
						visible : true
					},
					separator03 : {
						visible : false
					},
					undo : {
						visible : false
					},
					redo : {
						visible : false
					},
					separator04 : {
						visible : false
					},
					insertOrderedList : {
						visible : true
					},
					insertUnorderedList : {
						visible : true
					},
					insertHorizontalRule : {
						visible : true
					},
					separator07 : {
						visible : false
					},
					cut : {
						visible : false
					},
					copy : {
						visible : false
					},
					paste : {
						visible : false
					},
					html : {
						visible : true
					}
				}
			});
		});
	})(jQuery);
</script>

</head>
<%@include file="../modules/menu.html"%>
<body>
  <div class="container">
    <div class="content">
      <div class="page-header">
        <div class="container">
          <div class="row">
            <div class="span12">
              <h1>
                Manage Tests <small>Create new or modify old tests</small>
              </h1>
            </div>
            <div class="span1">
              <a class="btn large danger" href="#create">Create</a>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span10">
          <h3 align="center">
            <small>No test selected</small>
          </h3>
          <h3 align="center">
            Create new test <small>enter new test fields</small>
          </h3>

          <form>
            <div>
              <input class="xlarge" placeholder="Test title" id="testTitle" name="testTitle" size="40" type="text">
              <span class="help-block">A prase that identifies the test </span>
            </div>
            <div>
              <div class="media-grid">
                <a id="testImage" href="#"> <img class="thumbnail" src="http://placehold.it/210x150" alt=""> </a>
              </div>
              <span class="help-block"> Block of help text to describe the field above if need be. </span>
            </div>

            <div>
              <textarea class="xxlarge" id="testDescription" name="tstDescription" rows="2"></textarea>
              <span class="help-block"> Block of help text to describe the field above if need be. </span>
            </div>
            <div>
              <input type="submit" class="btn primary" value="Save changes">&nbsp;
              <button type="reset" class="btn">Cancel</button>
            </div>
          </form>

        </div>
        <div class="span4">
          <h3>
            Existing tests <small>No tests yet</small>
          </h3>
        </div>
      </div>
    </div>

    <footer>
      <p>&copy; Company 2011</p>
    </footer>
  </div>
  <!-- /container -->

</body>
</html>