package com.stoneitgt.sogongja.admin.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.stoneitgt.sogongja.admin.service.UserService;
import com.stoneitgt.sogongja.component.MessageByLocaleService;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.security.Role;

/**
 * 인증 프로바이더 로그인시 사용자가 입력한 아이디와 비밀번호를 확인하고 해당 권한을 주는 클래스
 *
 *
 */
@Component
public class AuthProvider implements AuthenticationProvider {

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private MessageByLocaleService messageByLocaleService;

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		String id = authentication.getName();
		String password = (String) authentication.getCredentials();

		User user = userService.loadUserByUsername(id);

		if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
			throw new BadCredentialsException(messageByLocaleService.getMessage("login.failed"));
		}

		String authVal = "";

		if ("AU00".equals(user.getAuth())) {
			authVal = Role.SUPER.getValue();
		} else if ("AU01".equals(user.getAuth())) {
			authVal = Role.ADMIN.getValue();
		} else {
			throw new BadCredentialsException(messageByLocaleService.getMessage("login.invalid.auth"));
		}

		userService.updateLastLoginDate(user.getUserSeq());

		List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
		grantedAuthorityList.add(new SimpleGrantedAuthority(authVal));
		user.setAuthorities(grantedAuthorityList);

		// 로그인 성공시 로그인 사용자 정보 반환
		return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());

	}

	@Override
	public boolean supports(Class<?> authentication) {
		return authentication.equals(UsernamePasswordAuthenticationToken.class);
	}

}
