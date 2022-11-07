package com.stoneitgt.sogongja.admin.config;

import com.stoneitgt.sogongja.admin.mapper.UserMapper;
import com.stoneitgt.sogongja.admin.properties.AppProperties;
import com.stoneitgt.sogongja.admin.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.context.request.RequestContextListener;

import com.stoneitgt.sogongja.admin.security.AuthFailureHandler;
import com.stoneitgt.sogongja.admin.security.AuthProvider;
import com.stoneitgt.sogongja.admin.security.AuthSuccessHandler;

/**
 * Spring Security에 대한 설정 클래스
 *
 * @author yh.kim
 *
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthProvider authProvider;

	@Autowired
	private AuthFailureHandler authFailureHandler;

	@Autowired
	private AuthSuccessHandler authSuccessHandler;

	@Autowired
	AuthenticationDetailsSource authenticationDetailsSource;

	@Autowired
	private AppProperties app;

	@Autowired
	UserMapper userMapper;

	@Autowired
	MenuService menuService;

//	@Autowired
//	private DataSource dataSource;
//
//	@Autowired
//	private UserService userService;

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(authProvider);
	}

	@Bean
	public RequestContextListener requestContextListener() {
		return new RequestContextListener();
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		super.configure(web);
		web.ignoring().antMatchers("/static/**", "/assets/**", "/streaming/**");
		web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.cors().and().csrf().ignoringAntMatchers("/api/session/extention", "/login");

		http.headers().frameOptions().disable();
		http.headers().httpStrictTransportSecurity().disable();

		http.authorizeRequests().antMatchers("/", "/login", "/error/**").permitAll();

		http.authorizeRequests().antMatchers("/actuator/**").hasRole("SUPER");

		http.authorizeRequests()//
				.antMatchers("/**").hasAnyRole("ADMIN", "SUPER")//
				.anyRequest().denyAll()//
				.and()//
				.addFilterBefore(new JwtFilter(app, userMapper, menuService), UsernamePasswordAuthenticationFilter.class)
				.formLogin()//
				.loginPage("/login")//
				.usernameParameter("id")//
				.passwordParameter("password")//
				.authenticationDetailsSource(authenticationDetailsSource)
				.successHandler(authSuccessHandler)//
				.failureHandler(authFailureHandler);//

				http.logout()//
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))//
				.deleteCookies("SOGONGJA_ADMIN_JSESSIONID", "admin-remember-me")//
				.clearAuthentication(true)//
				.invalidateHttpSession(true)//
				.logoutSuccessUrl("/login");
//				.and()//
//					.rememberMe()//
//					.rememberMeParameter("ates-remember-me")//
//					.rememberMeCookieName("ates-remember-me")//
//					.key("atesSecurity")//
//					.userDetailsService(userService)//
//					.authenticationSuccessHandler(authSuccessHandler)//
//					.tokenRepository(persistentTokenRepository())//
//					.tokenValiditySeconds(24 * 60 * 60);
	}

	@Bean
	public HttpFirewall allowUrlEncodedSlashHttpFirewall() {
		StrictHttpFirewall firewall = new StrictHttpFirewall();
		firewall.setAllowUrlEncodedSlash(true);
		firewall.setAllowSemicolon(true);
		return firewall;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

	@Bean
	public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean<HttpSessionEventPublisher>(new HttpSessionEventPublisher());
	}
//
//	@Bean
//	public RememberMeServices rememberMeServices(PersistentTokenRepository ptr) {
//		PersistentTokenBasedRememberMeServices rememberMeServices = new PersistentTokenBasedRememberMeServices(
//				"atesSecurity", userService, ptr);
//		rememberMeServices.setParameter("ates-remember-me");
//		rememberMeServices.setCookieName("ates-remember-me");
//		return rememberMeServices;
//	}
//
//	@Bean
//	public PersistentTokenRepository persistentTokenRepository() {
//		JdbcTokenRepositoryImpl tokenREpository = new JdbcTokenRepositoryImpl();
//		tokenREpository.setDataSource(dataSource);
//		return tokenREpository;
//	}
}
