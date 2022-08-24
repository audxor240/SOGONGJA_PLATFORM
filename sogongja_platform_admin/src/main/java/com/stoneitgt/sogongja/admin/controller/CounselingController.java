package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.CounselingParameter;
import com.stoneitgt.sogongja.admin.service.CounselingService;
import com.stoneitgt.sogongja.domain.Counseling;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/counseling")
public class CounselingController extends BaseController {

	@Autowired
	private CounselingService counselingService;

	@GetMapping("")
	public String counselingiList(@ModelAttribute CounselingParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = counselingService.getCounselingList(paramsMap, paging);

		model.addAttribute("list", list);
		model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("params", params);
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("couType", getCodeList("COU_TYPE"));
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/counseling/counseling_list";
	}

	@GetMapping("/{couSeq}")
	public String counselingView(@PathVariable int couSeq, @ModelAttribute CounselingParameter params, Model model) {
		Counseling counseling = counselingService.getCounseling(couSeq);
		model.addAttribute("counseling", counseling);
		model.addAttribute("menuCode", params.getMenuCode());
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.COUNSELING, couSeq));
		model.addAttribute("couType", getCodeList("COU_TYPE"));
		model.addAttribute("couClass", getCodeRefList("COU_CLASS", counseling.getCouType(), ""));
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/counseling/counseling_form";
	}

	@GetMapping("/form")
	public String boardForm(@ModelAttribute CounselingParameter params, Model model) {
		Counseling counseling = new Counseling();

		model.addAttribute("counseling", counseling);
		model.addAttribute("menuCode", params.getMenuCode());
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("couType", getCodeList("COU_TYPE"));
		model.addAttribute("couClass", new ArrayList<>());
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/counseling/counseling_form";
	}

	@PostMapping("/form")
	public String saveCounseling(@RequestParam(required = false) String menuCode,
			@ModelAttribute("counseling") @Valid Counseling counseling, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", counseling.getPageParams());
			model.addAttribute("fileList", getFileList(FILE_REF_TYPE.COUNSELING, counseling.getCouSeq()));
			model.addAttribute("couType", getCodeList("COU_TYPE"));
			model.addAttribute("couClass", getCodeRefList("COU_CLASS", counseling.getCouType(), ""));
			model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

			return "pages/counseling/counseling_form";
		}

		String returnUrl = "redirect:/counseling?";

		if (counseling.getCouSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += counseling.getPageParams();
		}
		counseling.setLoginUserSeq(authenticationFacade.getLoginUserSeq());

		counselingService.saveCounseling(counseling);

		return returnUrl;
	}

	@PostMapping("/delete")
	public String deleteCounseling(@RequestParam int couSeq, @RequestParam(required = false) String menuCode,
			Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("cou_seq", couSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		counselingService.deleteCounseling(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/counseling?menuCode=" + menuCode;
	}
}
