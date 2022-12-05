package com.stoneitgt.sogongja.user.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.Event;
import com.stoneitgt.sogongja.user.security.SocialLoginSupport;
import com.stoneitgt.sogongja.user.service.BannerService;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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

	@Autowired
	private BannerService bannerService;

	@Autowired
	private EventService eventService;

	@Autowired
	private BoardService boardService;

	@GetMapping(value = { "/", "/index" })
	public String index(Model model) {

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("search_type", "main");

		List<Map<String, Object>> pcBannerList = bannerService.getPcBannerList();
		List<Map<String, Object>> mobileBannerList = bannerService.getMobileBannerList();
		Map<String, Object> event = eventService.getEventInfo();
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("pcBannerList", pcBannerList);
		model.addAttribute("mobileBannerList", mobileBannerList);
		System.out.println("event >> "+event);
		model.addAttribute("event", event);
		model.addAttribute("boardSettingList", boardSettingList);


		return "pages/index";
	}

	@RequestMapping(value = "/login", method = { RequestMethod.GET, RequestMethod.POST })
	public String login(@ModelAttribute LoginForm loginForm, Model model, HttpServletRequest request) {
		// 로그인 실패시 메인으로 리타이렉트 됨 따라서 리다이레트 주석처리
		/*
		 * if (authenticationFacade.isAuthenticated()) { return "redirect:/"; }
		 */
		socialLoginSupport.setSocialOauthUrl(request, model);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("loginForm", loginForm);
		return "pages/login";
	}

	@GetMapping("/sub/{page}")
	public String subPage(@PathVariable String page, Model model) {
		return "pages/sub/" + page;
	}

	@GetMapping("/privacyPolicy")
	public String privacyPolicy(Model model) {
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("sel_privacyPolicy", true);
		return "pages/user/privacy_policy";

	}

	@GetMapping("/TermsOfService")
	public String TermsOfService(Model model) {
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("sel_TermsOfService", true);
		return "pages/user/Terms_of_service";
	}
}
