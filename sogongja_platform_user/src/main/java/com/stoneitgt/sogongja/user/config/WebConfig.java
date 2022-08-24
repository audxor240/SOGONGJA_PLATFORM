package com.stoneitgt.sogongja.user.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.stoneitgt.sogongja.user.interceptor.ModelHandlerInterceptor;
import com.stoneitgt.sogongja.user.properties.SystemProperties;

import nz.net.ultraq.thymeleaf.LayoutDialect;

@Configuration
@EnableWebMvc
@ComponentScan
public class WebConfig implements WebMvcConfigurer {

	@Autowired
	private SystemProperties systemProperties;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/css/**", "/js/**", "/images/**", "/font/**", "/static/**", "/thumb/**")//
				.addResourceLocations("classpath:/static/assets/css/", "classpath:/static/assets/js/",
						"classpath:/static/assets/images/", "classpath:/static/assets/font/",
						"file:///" + systemProperties.getStaticFilePath() + "/",
						"file:///" + systemProperties.getThumbnailFilePath() + "/")
				.resourceChain(false);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		// 인터셉터가 필요할 경우 사용
//		registry.addInterceptor(modelHandlerInterceptor());
	}

	@Bean
	public ModelHandlerInterceptor modelHandlerInterceptor() {
		return new ModelHandlerInterceptor();
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**").allowCredentials(false).allowedHeaders("*").allowedOrigins("*")
				.allowedMethods("GET", "POST");
	}

	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasenames("classpath:i18n/messages", "classpath:i18n/validators");
		messageSource.setDefaultEncoding("UTF-8");
		messageSource.setAlwaysUseMessageFormat(false);
		messageSource.setCacheSeconds(-1);
		return messageSource;
	}

	@Bean
	public LayoutDialect layoutDialect() {
		return new LayoutDialect();
	}

//	@Bean
//	@Profile("prod")
//	public WebServerFactoryCustomizer<UndertowServletWebServerFactory> servletWebServerFactory() {
//		return (WebServerFactoryCustomizer<UndertowServletWebServerFactory>) factory -> {
//			UndertowServletWebServerFactory undertowFactory = (UndertowServletWebServerFactory) factory;
//			undertowFactory.getBuilderCustomizers().add(builder -> {
//				builder.addHttpListener(80, "0.0.0.0");
//			});
//			undertowFactory.addDeploymentInfoCustomizers(deploymentInfo -> {
//				deploymentInfo
//						.addSecurityConstraint(new SecurityConstraint()
//								.addWebResourceCollection(new WebResourceCollection().addUrlPattern("/*"))
//								.setTransportGuaranteeType(TransportGuaranteeType.CONFIDENTIAL)
//								.setEmptyRoleSemantic(SecurityInfo.EmptyRoleSemantic.PERMIT))
//						.setConfidentialPortManager(exchange -> 443);
//			});
//		};
//	}
}