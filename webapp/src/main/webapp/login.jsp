<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<!DOCTYPE html>
<!--[if lt IE 7]> <html class="ie6 no-js" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="ie7 no-js" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="ie8 no-js" lang="en"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class='no-js' lang='en'>
<!--<![endif]-->
<head>
<script type="text/javascript">
	var _sf_startpt = (new Date()).getTime();
	var root_url = "http://www.codecademy.com/";

	var _kmq = _kmq || [];
	function _kms(u) {
		setTimeout(function() {
			var s = document.createElement('script');
			var f = document.getElementsByTagName('script')[0];
			s.type = 'text/javascript';
			s.async = true;
			s.src = u;
			f.parentNode.insertBefore(s, f);
		}, 1);
	}
	_kms('//i.kissmetrics.com/i.js');
	_kms('//doug1izaerwt3.cloudfront.net/a8c173bfd5ec377516a48bea90a3766964cab3c6.1.js');
	_kmq.push([ 'identify', '4e874a7a0ceeb90001003d70' ]);
</script>
<title>Codecademy</title>
<meta charset='utf-8'>
<meta content='IE=edge,chrome=1' http-equiv='X-UA-Compatible'>
<meta
	content="Codecademy is the easiest way to learn how to code. It's interactive, fun, and you can do it with your friends."
	name='description'>
<meta content='Codecademy' name='author'>
<link href='/favicon.ico' rel='shortcut icon'>
<meta content='width=device-width, initial-scale=1.0' name='viewport'>
<link rel="stylesheet" href="css/bootstrap.min.css">
<link href="/assets/application.css?1317345234" media="all"
	rel="stylesheet" type="text/css" />
<link href='http://fonts.googleapis.com/css?family=Lobster'
	rel='stylesheet' type='text/css'>
<script src="/javascripts/modernizr.min.js?1317345234"
	type="text/javascript"></script>
<script src="/javascripts/respond.min.js?1317345234"
	type="text/javascript"></script>
<meta name="csrf-param" content="authenticity_token" />
<meta name="csrf-token"
	content="BqaX5yPmy9428CFStnD0nAbnT9ccb/SCXmYDEskomSU=" />
<meta property="og:title" content="Codecademy" />
<meta property="og:description"
	content="Codecademy is the easiest way to learn how to code. It's interactive, fun, and you can do it with your friends." />
<meta property="og:site_name" content="Codecademy" />
<meta property="og:type" content="article" />
<meta property="og:url" content="http://www.codecademy.com/sign_in" />
<meta property="og:image"
	content="http://www.codecademy.com/images/thumbnail.png" />
<meta property="fb:app_id" content="212500508799908" />
<script type="text/javascript">
	var NREUMQ = NREUMQ || [];
	NREUMQ.push([ "mark", "firstbyte", new Date().getTime() ]);
</script>
</head>
<body class='sessions'>
	<%@include file="menu.jsp" %>
	<div id='container'>
		<div id='content'>
			<div>
				<div class='user_new'>
					<h2>Sign In</h2>
					<form accept-charset="UTF-8" action="/sign_in" class="user_new"
						id="user_new" method="post">
						<div style="margin: 0; padding: 0; display: inline">
							<input name="utf8" type="hidden" value="&#x2713;" /><input
								name="authenticity_token" type="hidden"
								value="BqaX5yPmy9428CFStnD0nAbnT9ccb/SCXmYDEskomSU=" />
						</div>

						<div id='flash'></div>

						<table>
							<tr>
								<td><label for="user_email">Email</label>
								</td>
								<td><input id="user_email" name="user[email]"
									placeholder="Email" size="30" type="email" />
								</td>
							</tr>
							<tr>
								<td><label for="user_password">Password</label>
								</td>
								<td><input id="user_password" name="user[password]"
									placeholder="Password" size="30" type="password" value="" />
								</td>
							</tr>
							<tr>
								<td><label for="user_remember_me">Remember me</label>
								</td>
								<td><input name="user[remember_me]" type="hidden" value="0" /><input
									id="user_remember_me" name="user[remember_me]" type="checkbox"
									value="1" />
								</td>
							</tr>
							<tr>
								<td></td>
								<td class='actions'><input class="sign_in_button"
									id="user_submit" name="commit" type="submit" value="Sign In" />
								</td>
							</tr>
						</table>
					</form>
					<h3 class='line-through'>
						<p>
							<span>or</span>
						</p>
					</h3>
					<div class='providers'>
						<a class='sign_in_facebook' href='/auth/facebook'> <img
							alt="Facebook-connect-large"
							src="/images/social_media/facebook-connect-large.png?1317345234" />
						</a>
					</div>


					<a href="/secret/new">Forgot your password?</a><br />

				</div>

			</div>
		</div>
	</div>
	<footer id='footer'>
	<div>
		<ul>
			<li>&copy;Curso de conducir, Inc.</li>

		</ul>

	</div>
	</footer>

	</script>
</body>
</html>
