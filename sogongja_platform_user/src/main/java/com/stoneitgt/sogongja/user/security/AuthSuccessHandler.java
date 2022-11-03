package com.stoneitgt.sogongja.user.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.User;

import lombok.extern.slf4j.Slf4j;

/**
 * 로그인 성공 핸들러
 *
 * @author yh.kim
 *
 */
@Slf4j
@Component
public class AuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
	private RequestCache requestCache = new HttpSessionRequestCache();
	@Autowired
	private AppProperties app;


	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {

		log.info("onAuthenticationSuccess!");

		FormWebAuthenticationDetails form = (FormWebAuthenticationDetails) authentication.getDetails();
		boolean remember = form.getRemember();

		User user = (User) authentication.getPrincipal();

		// session setting
		request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);

		if (remember == true) {
			String jwtToken = JWT.create()
					.withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(app.getJwtLimit())))
					.withClaim("key", user.getId())
					.sign(Algorithm.HMAC512(app.getJwtSecret()));

			Cookie myCookie = new Cookie("obscure-remember-me", jwtToken);
			myCookie.setMaxAge(Integer.parseInt(app.getJwtLimit()));  // 7일동안 유효
			response.addCookie(myCookie);
		}
		response.setStatus(HttpServletResponse.SC_OK);

		resultRedirectStrategy(request, response, authentication);
	}

	protected void resultRedirectStrategy(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		SavedRequest savedRequest = requestCache.getRequest(request, response);

		if (savedRequest != null) {
			String targetUrl = savedRequest.getRedirectUrl();
			redirectStrategy.sendRedirect(request, response, targetUrl);
		} else {
			redirectStrategy.sendRedirect(request, response, app.getHost());
		}
	}
}