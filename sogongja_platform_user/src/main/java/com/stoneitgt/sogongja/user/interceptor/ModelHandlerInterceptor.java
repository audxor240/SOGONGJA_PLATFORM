package com.stoneitgt.sogongja.user.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.stoneitgt.sogongja.user.properties.SystemProperties;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ModelHandlerInterceptor implements HandlerInterceptor {

	@Autowired
	private SystemProperties systemProperties;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {

		if (modelAndView != null) {
			log.info("getRequestURI : " + request.getRequestURI().toLowerCase());
			log.info("getQueryString : " + request.getQueryString());
			log.info("menuCode : " + request.getParameter("menuCode"));
			ModelMap modelMap = modelAndView.getModelMap();

			modelMap.addAttribute("menu", systemProperties.getUploadFilePath());
		}
	}
}
