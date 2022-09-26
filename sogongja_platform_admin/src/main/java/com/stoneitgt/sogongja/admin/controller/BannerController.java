package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/banner")
public class BannerController extends BaseController {

    @Autowired
    private EducationService educationService;

    @GetMapping("")
    public String bannerList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);
        Integer total = educationService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "설문 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("category1", getCodeList("CATEGORY_1", "전체"));
        model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG", "전체"));

        return "pages/banner/banner_list";
    }
}
