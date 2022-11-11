package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.MatchingParameter;
import com.stoneitgt.sogongja.admin.service.MatchingService;
import com.stoneitgt.sogongja.admin.service.UserService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.SurveyMatching;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/serviceMatching")
public class ServiceMatching extends BaseController {

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private UserService userService;

    @GetMapping("")
    public String serviceMatchingList(@ModelAttribute MatchingParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        System.out.println(params.getSortName());
        System.out.println(params.getSortType());
        System.out.println(params.getRegistered());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = userService.getServiceMatchingList(paramsMap, paging);
        Integer total = userService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "회원 관리");
        breadcrumb.put("menu_name", "서비스 매칭 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/serviceMatching/serviceMatching_list";
    }

    @GetMapping("/user/{userSeq}")
    public String serviceMatchingView(@PathVariable int userSeq, @ModelAttribute BaseParameter params, Model model) {

        User user = userService.getUserInfo(userSeq);
        model.addAttribute("user", user);

        Map<String, Object> top = matchingService.getTitle(userSeq);
        model.addAttribute("top", top);

        int registered = Integer.parseInt(top.get("registered").toString());

        if (registered > 0) {
            List<SurveyMatching> surveyList = matchingService.getSurveyList(userSeq);
            model.addAttribute("list", surveyList);

        }
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "회원 관리");
        breadcrumb.put("menu_name", "서비스 매칭 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/serviceMatching/serviceMatching_form";
    }

//    @GetMapping("")
//    public String serviceMatchingList(@ModelAttribute EducationParameter params, Model model) {
//
//        Paging paging = new Paging();
//        paging.setPage(params.getPage());
//        paging.setSize(params.getSize());
//
//        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//
//        List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);
//        Integer total = educationService.selectTotalRecords();
//        paging.setTotal(total);
//
//        model.addAttribute("list", list);
//        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
//        model.addAttribute("paging", paging);
//        model.addAttribute("params", params);
//        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
//        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
//        breadcrumb.put("parent_menu_name", "시스템 관리");
//        breadcrumb.put("menu_name", "설문 관리");
//        model.addAttribute("breadcrumb", breadcrumb);
//        model.addAttribute("pageParams", getBaseParameterString(params));
//        model.addAttribute("category1", getCodeList("CATEGORY_1", "전체"));
//        model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG", "전체"));
//
//        return "pages/serviceMatching/serviceMatching_list";
//    }
}
