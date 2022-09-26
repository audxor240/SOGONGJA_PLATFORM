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
import com.stoneitgt.sogongja.admin.domain.ConsultingParameter;
import com.stoneitgt.sogongja.admin.service.ConsultingService;
import com.stoneitgt.sogongja.domain.Consulting;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/consulting")
public class ConsultingController extends BaseController {

	@Autowired
	private ConsultingService consultingService;

	@GetMapping("")
	public String consultingiList(@ModelAttribute ConsultingParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = consultingService.getConsultingList(paramsMap, paging);
		Integer total = consultingService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "소공자 공부방");
		breadcrumb.put("menu_name", "소공자 컨설팅");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("conType", getCodeList("CON_TYPE"));
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/consulting/consulting_list";
	}

	@GetMapping("/{conSeq}")
	public String boardView(@PathVariable int conSeq, @ModelAttribute ConsultingParameter params, Model model) {
		Consulting consulting = consultingService.getConsulting(conSeq);
		model.addAttribute("consulting", consulting);
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "소공자 공부방");
		breadcrumb.put("menu_name", "소공자 컨설팅");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.CONSULTING, conSeq));
		model.addAttribute("conType", getCodeList("CON_TYPE"));
		model.addAttribute("conClass", getCodeRefList("CON_CLASS", consulting.getConType(), ""));
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/consulting/consulting_form";
	}

	@GetMapping("/form")
	public String boardForm(@ModelAttribute ConsultingParameter params, Model model) {
		Consulting consulting = new Consulting();

		model.addAttribute("consulting", consulting);
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "소공자 공부방");
		breadcrumb.put("menu_name", "소공자 컨설팅");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("conType", getCodeList("CON_TYPE"));
		model.addAttribute("conClass", new ArrayList<>());
		model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

		return "pages/consulting/consulting_form";
	}

	@PostMapping("/form")
	public String saveConsulting(@RequestParam(required = false) String menuCode,
			@ModelAttribute("consulting") @Valid Consulting consulting, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
			breadcrumb.put("parent_menu_name", "소공자 공부방");
			breadcrumb.put("menu_name", "소공자 컨설팅");

			model.addAttribute("breadcrumb", breadcrumb);
			model.addAttribute("pageParams", consulting.getPageParams());
			model.addAttribute("fileList", getFileList(FILE_REF_TYPE.CONSULTING, consulting.getConSeq()));
			model.addAttribute("conType", getCodeList("CON_TYPE"));
			model.addAttribute("conClass", getCodeRefList("CON_CLASS", consulting.getConType(), ""));
			model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

			return "pages/consulting/consulting_form";
		}

		String returnUrl = "redirect:/consulting?";

		if (consulting.getConSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += consulting.getPageParams();
		}
		consulting.setLoginUserSeq(authenticationFacade.getLoginUserSeq());

		consultingService.saveConsulting(consulting);

		return returnUrl;
	}

	@PostMapping("/delete")
	public String deleteConsulting(@RequestParam int conSeq, @RequestParam(required = false) String menuCode,
			Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("con_seq", conSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		consultingService.deleteConsulting(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/consulting?menuCode=" + menuCode;
	}
}
