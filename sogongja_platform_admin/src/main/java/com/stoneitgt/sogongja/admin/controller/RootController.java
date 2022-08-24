package com.stoneitgt.sogongja.admin.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.LoginForm;
import com.stoneitgt.util.StoneUtil;

@Controller
public class RootController extends BaseController {

	@RequestMapping(value = "/login", method = { RequestMethod.GET, RequestMethod.POST })
	public String login(@ModelAttribute LoginForm loginForm, Model model) {

		if (authenticationFacade.isAdmin()) {
			return "redirect:/main";
		}
		model.addAttribute("loginForm", loginForm);
		return "pages/login";
	}

	@GetMapping(value = { "/", "/admin" })
	public String index(Model model) {
		return "redirect:/main";
	}

	@GetMapping("/main")
	public String main(Model model) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("yyyymm", StoneUtil.getToday("yyyy-MM"));

		model.addAttribute("params", params);
		return "pages/main";
	}

	@PostMapping("/session/extention")
	@ResponseBody
	public Map<String, Object> sessionExtention(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		result.put("session_time", request.getSession().getMaxInactiveInterval());
		return result;
	}

	@PostMapping("/main/count")
	@ResponseBody
	public Map<String, Object> countCard(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();

		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}
}
