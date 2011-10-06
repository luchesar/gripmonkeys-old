<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
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
<title>Curso de conducir</title>
<meta charset='utf-8'>
<link rel="stylesheet" href="css/bootstrap.min.css">
<script data-main="scripts/main" src="scripts/require.js"
    language="javascript"></script>
</head>
<body class='sessions'>
	<%@include file="modules/menu.html" %>
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
