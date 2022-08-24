package com.stoneitgt.sogongja.user.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

/**
 * 로그인 실패 핸들러
 *
 * @author yh.kim
 *
 */
@Component
public class AuthFailureHandler extends SimpleUrlAuthenticationFailureHandler {

	private String defaultFailureUrl;

	public AuthFailureHandler() {
		this.defaultFailureUrl = "/login";
	}

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {

		//String returnUrl = null;

		String username = request.getParameter("id");

		request.setAttribute("id", username);
		request.setAttribute("error", exception.getMessage());

		request.getRequestDispatcher(defaultFailureUrl).forward(request, response);

	}
}