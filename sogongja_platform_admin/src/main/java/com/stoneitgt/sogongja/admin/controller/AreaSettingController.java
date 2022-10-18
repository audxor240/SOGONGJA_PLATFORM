package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/areaSetting")
public class AreaSettingController extends BaseController {

    @Autowired
    private BoardService boardService;

    @GetMapping("/shop")
    public String areaShopSettingList(@ModelAttribute BaseParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        list = boardService.getBoardSettingList(paramsMap, paging);
        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "상점데이터 관리");

        Integer total = boardService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/area/area_shop_setting_list";
    }

    @GetMapping("/analysis")
    public String areaAnalysisSettingList(@ModelAttribute BaseParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        list = boardService.getBoardSettingList(paramsMap, paging);
        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "상권데이터 관리");

        Integer total = boardService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/area/area_analysis_setting_list";
    }

    @GetMapping("/regional")
    public String areaRegionalSettingList(@ModelAttribute BaseParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        list = boardService.getBoardSettingList(paramsMap, paging);
        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "지역데이터 관리");

        Integer total = boardService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/area/area_regional_setting_list";
    }



}
