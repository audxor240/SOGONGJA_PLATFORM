package com.stoneitgt.sogongja.admin.component;

import org.springframework.security.core.Authentication;

import com.stoneitgt.sogongja.domain.User;

public interface IAuthenticationFacade {

	Authentication getAuthentication();

	User getLoginUser();

	String getLoginUserId();

	int getLoginUserSeq();

	String getAuth();

	boolean isAuthenticated();

	boolean isAdmin();
}
