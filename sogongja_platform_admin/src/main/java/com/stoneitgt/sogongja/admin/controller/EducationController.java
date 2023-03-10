package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.util.*;

import javax.validation.Valid;

import com.stoneitgt.sogongja.admin.service.CategoryService;
import com.stoneitgt.sogongja.admin.service.SupportService;
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
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.sogongja.domain.Education;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/education")
public class EducationController extends BaseController {

	@Autowired
	private EducationService educationService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private SupportService supportService;

	@GetMapping("")
	public String educationiList(@ModelAttribute EducationParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);
		Integer total = educationService.selectTotalRecords();
		paging.setTotal(total);

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		List<Map<String, Object>> category2List = null;
		List<Map<String, Object>> category3List = null;
		if(params.getCategory1() != null && !params.getCategory1().equals("")){
			Map<String, Object> param2 = new HashMap<String, Object>();
			param2.put("category1Seq",params.getCategory1());
			category2List = categoryService.getCategory2(param2);
			model.addAttribute("category2", category2List);		//????????????2
		}

		if(params.getCategory2() != null && !params.getCategory2().equals("")){
			Map<String, Object> param3 = new HashMap<String, Object>();
			param3.put("category2Seq",params.getCategory2());
			category3List = categoryService.getCategory3(param3);
			model.addAttribute("category3", category3List);		//????????????3
		}

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "????????? ??????");
		breadcrumb.put("menu_name", "????????? ?????? ??????");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("category1", getCodeList("CATEGORY_1", "??????"));
		//model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG", "??????"));
		model.addAttribute("category1", category1List);		//????????????1
		model.addAttribute("supportOrg", supportList);		//????????????

		return "pages/education/education_list";
	}

	@GetMapping("/{eduSeq}")
	public String boardView(@PathVariable int eduSeq, @ModelAttribute EducationParameter params, Model model) {
		Education education = educationService.getEducation(eduSeq);
		model.addAttribute("education", education);
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "????????? ??????");
		breadcrumb.put("menu_name", "????????? ?????? ??????");
		model.addAttribute("breadcrumb", breadcrumb);

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		Map<String, Object> param2 = new HashMap<String, Object>();
		param2.put("category1Seq",education.getCategory1());
		List<Map<String, Object>> category2List = categoryService.getCategory2(param2);


		Map<String, Object> param3 = new HashMap<String, Object>();
		param3.put("category2Seq",education.getCategory2());
		List<Map<String, Object>> category3List = categoryService.getCategory3(param3);

		List<Map<String, Object>> imageList2 = getFileList(FILE_REF_TYPE.EDUCATION_IMAGE, eduSeq);



		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.EDUCATION, eduSeq));
		model.addAttribute("imageList", getFileList(FILE_REF_TYPE.EDUCATION_IMAGE, eduSeq));
		//model.addAttribute("category1", getCodeList("CATEGORY_1"));
		//model.addAttribute("category2", getCodeRefList("CATEGORY_2", education.getCategory1(), ""));
		//model.addAttribute("category3", getCodeRefList("CATEGORY_3", education.getCategory2(), ""));
		//model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));
		model.addAttribute("category1", category1List);
		model.addAttribute("category2", category2List);
		model.addAttribute("category3", category3List);
		model.addAttribute("supportOrg", supportList);



		return "pages/education/education_form";
	}

	@GetMapping("/form")
	public String boardForm(@ModelAttribute EducationParameter params, Model model) {
		Education education = new Education();

		model.addAttribute("education", education);
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();

		breadcrumb.put("parent_menu_name", "????????? ??????");
		breadcrumb.put("menu_name", "????????? ?????? ??????");

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		//model.addAttribute("category1", getCodeList("CATEGORY_1"));
		model.addAttribute("category2", new ArrayList<>());
		model.addAttribute("category3", new ArrayList<>());
		//model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));
		model.addAttribute("category1", category1List);		//????????????1
		model.addAttribute("supportOrg", supportList);		//????????????


		return "pages/education/education_form";
	}

	@PostMapping("/form")
	public String saveEducation(@RequestParam(required = false) String menuCode,
			@ModelAttribute("education") @Valid Education education, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
			breadcrumb.put("parent_menu_name", "????????? ??????");
			breadcrumb.put("menu_name", "????????? ?????? ??????");
			model.addAttribute("breadcrumb", breadcrumb);
			model.addAttribute("pageParams", education.getPageParams());
			model.addAttribute("fileList", getFileList(FILE_REF_TYPE.EDUCATION, education.getEduSeq()));
			model.addAttribute("imageList", getFileList(FILE_REF_TYPE.EDUCATION_IMAGE, education.getEduSeq()));
			model.addAttribute("category1", getCodeList("CATEGORY_1"));
			model.addAttribute("category2", getCodeRefList("CATEGORY_2", education.getCategory1(), ""));
			model.addAttribute("category3", getCodeRefList("CATEGORY_3", education.getCategory2(), ""));
			model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG"));

			return "pages/education/education_form";
		}

		String returnUrl = "redirect:/education?";

		if (education.getEduSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += education.getPageParams();
		}
		education.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		educationService.saveEducation(education);

		return returnUrl;
	}

	@PostMapping("/delete")
	public String deleteEducation(@RequestParam String eduStr, @RequestParam(required = false) String menuCode,
			Model model, RedirectAttributes rttr) throws IOException {

		List<String> eduSeqArr = Arrays.asList(eduStr.split(","));

		for(int i =0; i < eduSeqArr.size();i++) {
			int eduSeq = Integer.parseInt(eduSeqArr.get(i));
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("edu_seq", eduSeq);
			params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
			educationService.deleteEducation(params);
		}
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);

		return "redirect:/education?menuCode=" + menuCode;
		//return "pages/education/education_list";
	}
}
