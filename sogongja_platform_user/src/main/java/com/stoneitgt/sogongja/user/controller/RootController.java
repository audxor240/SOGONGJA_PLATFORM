package com.stoneitgt.sogongja.user.controller;

import java.util.HashMap;
import java.util.Map;

import com.stoneitgt.sogongja.user.security.SocialLoginSupport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.stoneitgt.sogongja.domain.LoginForm;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequiredArgsConstructor
public class RootController extends BaseController {

	private final SocialLoginSupport socialLoginSupport;

	@GetMapping(value = { "/", "/index" })
	public String index(Model model) {

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("search_type", "main");

		return "pages/index";
	}

	@RequestMapping(value = "/login", method = { RequestMethod.GET, RequestMethod.POST })
	public String login(@ModelAttribute LoginForm loginForm, Model model, HttpServletRequest request) {
		// 로그인 실패시 메인으로 리타이렉트 됨 따라서 리다이레트 주석처리
		/*
		 * if (authenticationFacade.isAuthenticated()) { return "redirect:/"; }
		 */
		socialLoginSupport.setSocialOauthUrl(request, model);
		model.addAttribute("loginForm", loginForm);
		return "pages/login";
	}

	@GetMapping("/sub/{page}")
	public String subPage(@PathVariable String page, Model model) {
		return "pages/sub/" + page;
	}
}
