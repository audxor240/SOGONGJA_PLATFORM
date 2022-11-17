package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.ReSearchShopParameter;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.sogongja.admin.service.ReSearchShopService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/areaSetting")
public class AreaSettingController extends BaseController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private ReSearchShopService reSearchShopService;

    @GetMapping("/shop")
    public String areaShopSettingList(@ModelAttribute ReSearchShopParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        List<Map<String,Object>> category1List = reSearchShopService.getReSearchShopCategoty1(); //대분류 조회

        if(paramsMap.get("category1") != null && !paramsMap.get("category1").equals("")) {
            List<Map<String, Object>> category2List = reSearchShopService.getReSearchShopCategoty2(paramsMap.get("category1").toString()); //중분류 조회
            model.addAttribute("category2List", category2List);
        }
        if(paramsMap.get("category2") != null && !paramsMap.get("category2").equals("")) {
            List<Map<String, Object>> category3List = reSearchShopService.getReSearchShopCategoty3(paramsMap.get("category2").toString()); //소분류 조회
            model.addAttribute("category3List", category3List);
        }

        list = reSearchShopService.getReSearchShopList(paramsMap, paging);

        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "상점데이터 관리");

        Integer total = reSearchShopService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("category1List", category1List);
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

    @PostMapping("/shop/delete")
    public String deleteReSearchShop(@RequestParam String reSearchShopStr, @RequestParam(required = false) String menuCode,
                                  Model model, RedirectAttributes rttr) throws IOException {

        List<String> reSearchShopArr = Arrays.asList(reSearchShopStr.split(","));

        for(int i =0; i < reSearchShopArr.size();i++) {
            int shopSeq = Integer.parseInt(reSearchShopArr.get(i));
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("shop_seq", shopSeq);
            params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
            reSearchShopService.deleteReSearchShop(params);
        }
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);

        return "redirect:/areaSetting/shop";
    }



}
