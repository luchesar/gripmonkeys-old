package org.bitbucket.cursodeconducir.services;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.FacebookApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.google.inject.Singleton;

@Singleton @SuppressWarnings("serial")
public class FacebookSignInServlet extends HttpServlet {
//	private static final String APP_ID = "315440385198744";
//	private static final String APP_SECRET = "b7b3e5904aa685bd3570e3923e5632f4";
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		OAuthService service = new ServiceBuilder().provider(FacebookApi.class)
				.apiKey("APP_ID").apiSecret("APP_SECRET").build();
		
		Token requestToken = service.getRequestToken();
		
		String authUrl = service.getAuthorizationUrl(requestToken);
		resp.sendRedirect(authUrl);
		
		Verifier verifier = new Verifier("verifier you got from the user");
		Token accessToken = service.getAccessToken(requestToken, verifier);
		
		OAuthRequest request = new OAuthRequest(Verb.GET, "http://api.twitter.com/1/account/verify_credentials.xml");
		service.signRequest(accessToken, request); // the access token from step 4
		Response response = request.send();
		
		System.out.println(response.getBody());
	}
}
