package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.ReSearchShopParameter;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.sogongja.admin.service.ReSearchAreaService;
import com.stoneitgt.sogongja.admin.service.ReSearchRegionService;
import com.stoneitgt.sogongja.admin.service.ReSearchShopService;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/areaSetting")
public class AreaSettingController extends BaseController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private ReSearchShopService reSearchShopService;

    @Autowired
    private ReSearchAreaService reSearchAreaService;

    @Autowired
    private ReSearchRegionService reSearchRegionService;

    @GetMapping("/shop")
    public String areaShopSettingList(@ModelAttribute ReSearchShopParameter params, Model model, HttpServletResponse response) {

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
        model.addAttribute("excelDown", true);  //엑셀다운로드 사용하는 페이지인지 여부

        /*Cookie cookie = new Cookie("fileDownloadToken", "TRUE");
        System.out.println("cookie11 :: "+cookie.getDomain());
        System.out.println("cookie22 :: "+cookie.getValue());
        System.out.println("cookie33 :: "+cookie.getName());
        response.addCookie(cookie);*/

        return "pages/area/area_shop_setting_list";
    }

    @GetMapping("/analysis")
    public String areaAnalysisSettingList(@ModelAttribute BaseParameter params, Model model) {
        System.out.println("params :: "+params);
        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        String resultUrl = "";
        AreaColmunParameter areaColmunParameter = new AreaColmunParameter();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        if(params.getType().equals("1")) {
            resultUrl = "pages/area/area_analysis_setting_list";
            list = reSearchAreaService.getReSearchAreaList(paramsMap, paging);  //상권 데이터(일반)
            if (params.getSubType().equals("0") || params.getSubType().equals("2")) {   //인구
                areaColmunParameter.Area2Dto(true);
            }

            if (params.getSubType().equals("0") || params.getSubType().equals("3")) {   //소득소비
                areaColmunParameter.Area3Dto(true);
            }

            if (params.getSubType().equals("0") || params.getSubType().equals("4")) {   //아파트
                areaColmunParameter.setJoin(true);
                areaColmunParameter.setCtAptCom(true);
                areaColmunParameter.setCtAptHou(true);
            }

            if (params.getSubType().equals("0") || params.getSubType().equals("5")) {   //상권안정화지표
                areaColmunParameter.setJoin(true);
                areaColmunParameter.setIdxStbArea(true);
            }
        }else{
            resultUrl = "pages/area/area_analysis_setting_list02";
            list = reSearchAreaService.getReSearchAreaComList(paramsMap, paging);  //상권 데이터(업종)
            if (params.getSubType().equals("0") || params.getSubType().equals("6")) {   //점포

                areaColmunParameter.Area2DefaultDto(true);
                areaColmunParameter.setCtShop(true);
                areaColmunParameter.setCtShopSim(true);
                areaColmunParameter.setCtFranchise(true);
            }
            if (params.getSubType().equals("0") || params.getSubType().equals("7")) {   //추정매출
                areaColmunParameter.Area2DefaultDto(true);
                areaColmunParameter.setSum0006(true);
                areaColmunParameter.setSum0611(true);
                areaColmunParameter.setSum1114(true);
                areaColmunParameter.setSum1417(true);
                areaColmunParameter.setSum1721(true);
                areaColmunParameter.setSum2124(true);
            }
            if (params.getSubType().equals("0") || params.getSubType().equals("7")) {   //개폐업
                areaColmunParameter.Area2DefaultDto(true);
                areaColmunParameter.setPerOpen(true);
                areaColmunParameter.setCtOpen(true);
                areaColmunParameter.setPerClose(true);
                areaColmunParameter.setCtClose(true);
            }

        }


        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "상권데이터 관리");

        Integer total = boardService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        model.addAttribute("areaColmunParameter", areaColmunParameter);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        System.out.println("resultUrl :: "+resultUrl);
        return resultUrl;
    }

    @GetMapping("/regional")
    public String areaRegionalSettingList(@ModelAttribute RegionParameter params, Model model) {
        System.out.println("params :: "+params);
        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        RegionColmunParameter regionColmunParameter = new RegionColmunParameter();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        if(params.getType().equals("region0") || params.getType().equals("region1")) {
            regionColmunParameter.setSumPopul(true);
            regionColmunParameter.setRPopul(true);
            regionColmunParameter.setWPopul(true);
        }

        if(params.getType().equals("region0") || params.getType().equals("region2")) {
            regionColmunParameter.setCtShopU20s(true);
            regionColmunParameter.setCtShop30s(true);
            regionColmunParameter.setCtShop40s(true);
            regionColmunParameter.setCtShop50s(true);
            regionColmunParameter.setCtShopO60s(true);
        }

        if(params.getType().equals("region0") || params.getType().equals("region3")) {
            regionColmunParameter.setHouse1(true);
            regionColmunParameter.setHouse2(true);
            regionColmunParameter.setHouse3(true);
            regionColmunParameter.setHouse4(true);
            regionColmunParameter.setHouse5(true);
            regionColmunParameter.setHouse6(true);
            regionColmunParameter.setHouse7(true);
        }

        if(params.getType().equals("region0") || params.getType().equals("region4")) {
            regionColmunParameter.setRtAll(true);
            regionColmunParameter.setRt1f(true);
            regionColmunParameter.setRtOther(true);
        }

        //list = boardService.getBoardSettingList(paramsMap, paging);
        list = reSearchRegionService.getReSearchRegionList(paramsMap, paging);  //지역 데이터
        breadcrumb.put("parent_menu_name", "커머스 연구소 데이터");
        breadcrumb.put("menu_name", "지역데이터 관리");

        Integer total = boardService.selectTotalRecords();
        paging.setTotal(total);

        System.out.println("regionColmunParameter : "+regionColmunParameter);
        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        model.addAttribute("regionColmunParameter", regionColmunParameter);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/area/area_regional_setting_list";
    }

    @PostMapping("/shop/delete")
    public String deleteReSearchShop(@RequestParam String seqStr, @RequestParam String type,
                                  Model model, RedirectAttributes rttr) throws IOException {

        List<String> seqArr = Arrays.asList(seqStr.split(","));

        String returnUrl = "";
        for(int i =0; i < seqArr.size();i++) {
            int seq = Integer.parseInt(seqArr.get(i));
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("seq", seq);
            params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
            switch (type){
                case "shop": reSearchShopService.deleteReSearchShop(params); returnUrl = "redirect:/areaSetting/shop"; break;
                case "area": reSearchAreaService.deleteReSearchArea(params); returnUrl = "redirect:/areaSetting/analysis?type=1&subType=0"; break;
                case "areaCom": reSearchAreaService.deleteReSearchAreaCom(params); returnUrl = "redirect:/areaSetting/analysis?type=2&subType=0"; break;
                case "region": reSearchRegionService.deleteReSearchRegion(params); returnUrl = "redirect:/areaSetting/regional?type=region0"; break;
            }

        }
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);

        return returnUrl;
    }



}
