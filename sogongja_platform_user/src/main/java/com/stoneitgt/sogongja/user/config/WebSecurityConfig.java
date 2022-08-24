package com.stoneitgt.sogongja.user.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.context.request.RequestContextListener;

import com.stoneitgt.sogongja.user.security.AuthFailureHandler;
import com.stoneitgt.sogongja.user.security.AuthProvider;
import com.stoneitgt.sogongja.user.security.AuthSuccessHandler;

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
	private DataSource dataSource;

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
		web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/streaming/**");
		web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.cors().and().csrf().ignoringAntMatchers("/login");

		http.headers().frameOptions().disable();
		http.headers().httpStrictTransportSecurity().disable();
		http.requiresChannel().anyRequest().requiresInsecure();

//		http.authorizeRequests().antMatchers("/", "/login", "/error/**").permitAll();

		http.authorizeRequests()//
				.antMatchers("/mypage/**").authenticated()//
				.anyRequest().permitAll()//
				.and()//
					.formLogin()//
					.loginPage("/login")//
					.usernameParameter("id")//
					.passwordParameter("password")//
					.successHandler(authSuccessHandler)//
					.failureHandler(authFailureHandler)//
				.and()//
					.logout()//
					.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))//
					.deleteCookies("SOGONGJA_USER_JSESSIONID")//
					.clearAuthentication(true)//
					.invalidateHttpSession(true)//
					.logoutSuccessUrl("/");
	}

	@Bean
	public SessionRegistry sessionRegistry() {
		return new SessionRegistryImpl();
	}

	@Bean
	public ServletListenerRegistrationBean<HttpSessionEventPublisher> httpSessionEventPublisher() {
		return new ServletListenerRegistrationBean<HttpSessionEventPublisher>(new HttpSessionEventPublisher());
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
	public PersistentTokenRepository persistentTokenRepository() {
		JdbcTokenRepositoryImpl tokenREpository = new JdbcTokenRepositoryImpl();
		tokenREpository.setDataSource(dataSource);
		return tokenREpository;
	}
}
