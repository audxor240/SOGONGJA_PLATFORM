package com.stoneitgt.sogongja.admin.config;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.stoneitgt.sogongja.admin.properties.SystemProperties;

import nz.net.ultraq.thymeleaf.LayoutDialect;

@Configuration
@EnableWebMvc
@ComponentScan
public class WebConfig implements WebMvcConfigurer {

	@Autowired
	private SystemProperties systemProperties;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {

		registry.addResourceHandler("/assets/**", "/static/**", "/thumb/**")//
				.addResourceLocations("classpath:/static/assets/",
						"file:///" + systemProperties.getStaticFilePath() + "/",
						"file:///" + systemProperties.getThumbnailFilePath() + "/")
				.resourceChain(false);
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
		messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
		messageSource.setAlwaysUseMessageFormat(false);
		messageSource.setCacheSeconds(-1);
		return messageSource;
	}

	@Bean
	public LayoutDialect layoutDialect() {
		return new LayoutDialect();
	}
}