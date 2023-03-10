package com.stoneitgt.sogongja.user.config;

import javax.sql.DataSource;

import com.stoneitgt.sogongja.user.mapper.UserMapper;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices;
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
 * Spring Security??? ?????? ?????? ?????????
 *
 * @author yh.kim
 *
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private AuthProvider authProvider;

	@Autowired
	private AuthFailureHandler authFailureHandler;

	@Autowired
	private AuthSuccessHandler authSuccessHandler;

	@Autowired
	private DataSource dataSource;

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	UserService userService;

	@Autowired
	UserMapper userMapper;

	@Autowired
	AuthenticationDetailsSource authenticationDetailsSource;

	@Autowired
	private AppProperties app;

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
		web.ignoring().antMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/streaming/**","/assets/**","/sass/**");
		web.httpFirewall(allowUrlEncodedSlashHttpFirewall());
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.cors().disable().csrf().ignoringAntMatchers("/login");

		http.headers().frameOptions().disable();
		http.headers().httpStrictTransportSecurity().disable();
		http.requiresChannel().anyRequest().requiresInsecure();

//		http.authorizeRequests().antMatchers("/", "/login", "/error/**").permitAll();

/*
		http.rememberMe() // rememberMe ?????? ?????????
				.key("oingdaddy!")
				.rememberMeParameter("remember-me") // default: remember-me, checkbox ?????? ????????? ????????????
				.tokenValiditySeconds(604800) // ????????? ???????????? ??????(???), default: 14???
				.alwaysRemember(false) // ???????????? ??????????????? ??????????????? ????????? ?????? ??????, default: false
				.tokenRepository(persistentTokenRepository()) //DataSource ??????
				.userDetailsService(userDetailsService); // ????????? ????????? ??? ????????? ????????? ?????????. ????????? ??? ?????? ?????????.
*/
//		http.rememberMe()
//				.key("jbcpCalendar")
//				.rememberMeParameter("obscure-remember-me")
//				.rememberMeCookieName("obscure-remember-me")
//				.tokenValiditySeconds(604800) // ????????? ???????????? ??????(???), default: 14???
//				.alwaysRemember(true) // ???????????? ??????????????? ??????????????? ????????? ?????? ??????, default: false
//				.tokenRepository(persistentTokenRepository()) //DataSource ??????
//				.userDetailsService(userDetailsService); // ????????? ????????? ??? ????????? ????????? ?????????. ????????? ??? ?????? ?????????.
/*
		http.rememberMe()
				.key("hayden") //????????? ???????????? ?????? ??????????????? ?????? ???(key)???
				.tokenRepository(persistentTokenRepository()) //DataSource ??????
				.tokenValiditySeconds(604800); //?????? ?????? ??????(?????????) - ?????????
*/

		/*
		http.rememberMe()
				.userDetailsService(userDetailsService)
				.tokenRepository(persistentTokenRepository());

		 */
		/*
		http.rememberMe()
				.rememberMeParameter("remember-me") // rememberme ????????????. ???????????? remember-me
				.tokenValiditySeconds(3600) // ???????????? ??????. ???????????? 14???
				.alwaysRemember(false) // ???????????? remember me??? ???????????? ????????? true?????? ?????? remember me ??????.
				.userDetailsService(userDetailsService) // ????????? ????????? ?????????. ????????? ????????? ?????????????????? ?????? ????????? ????????? ??????.
				.authenticationSuccessHandler(authSuccessHandler)
		;

		 */


		http.authorizeRequests()
				.antMatchers("/mypage/**").authenticated()
				.anyRequest().permitAll()
				.and()
				.addFilterBefore(new JwtFilter(app, userMapper), UsernamePasswordAuthenticationFilter.class)
					.formLogin()
					.loginPage("/login")
					.usernameParameter("id")
				 	.passwordParameter("password")
					.authenticationDetailsSource(authenticationDetailsSource)
					.successHandler(authSuccessHandler)
					.failureHandler(authFailureHandler);
		http.logout()
					.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
					.deleteCookies("JSESSIONID","obscure-remember-me")
					.clearAuthentication(true)
					.invalidateHttpSession(true)
					.logoutSuccessUrl(app.getHost());
	}

	@Bean
	public RememberMeServices rememberMeServices
			(PersistentTokenRepository ptr){
		PersistentTokenBasedRememberMeServices rememberMeServices = new
				PersistentTokenBasedRememberMeServices("jbcpCalendar",
				userDetailsService, ptr);
		rememberMeServices.setParameter("obscure-remember-me");
		rememberMeServices.setCookieName("obscure-remember-me");
		return rememberMeServices;
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
