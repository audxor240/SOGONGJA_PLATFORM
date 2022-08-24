package com.stoneitgt.sogongja.user.component;

import java.util.Collection;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.security.Role;

@Component
public class AuthenticationFacade implements IAuthenticationFacade {

	@Override
	public Authentication getAuthentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}

	@Override
	public User getLoginUser() {
		return getAuthentication() != null ? (User) getAuthentication().getPrincipal() : null;
	}

	@Override
	public String getLoginUserId() {
		return getLoginUser().getId();
	}

	@Override
	public int getLoginUserSeq() {
		return getLoginUser().getUserSeq();
	}

	@Override
	public String getAuth() {
		return getLoginUser().getAuth();
	}

	@Override
	public boolean isAuthenticated() {
		return !isAnonymous();
	}

	public boolean isAnonymous() {
		if (AnonymousAuthenticationToken.class == null || getAuthentication() == null) {
			return false;
		}
		return AnonymousAuthenticationToken.class.isAssignableFrom(getAuthentication().getClass());
	}

	@Override
	public boolean isAdmin() {
		if (isAuthenticated() && getLoginUser() != null) {
			Collection<? extends GrantedAuthority> authorities = getLoginUser().getAuthorities();
			return authorities.stream().anyMatch(x -> Role.SUPER.getValue().equals(x.getAuthority())
					|| Role.ADMIN.getValue().equals(x.getAuthority()));
		}
		return false;
	}
}
