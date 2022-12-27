package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.mapper.AreaMapper;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommerceService;
import com.stoneitgt.sogongja.user.service.GeoService;

import com.stoneitgt.util.StringUtil;
import org.opengis.referencing.FactoryException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Controller
@RequestMapping("/commerce")
public class CommerceController extends BaseController {

    @Autowired
    private GeoService geoService;

    @Autowired
    private AreaMapper areaMapper;

    @Autowired
    private BoardService boardService;

    @Autowired
    private CommerceService commerceService;

    @GetMapping("/area")
    public String commerceArea(@ModelAttribute BaseParameter params, Model model) {

        model.addAttribute("shopList", areaMapper.getAllShop());
        List<Map<String, Object>> mains = areaMapper.getMainCategory();
        model.addAttribute("mainCategories", mains);
        List<Map<String, Object>> subs = areaMapper.getSubCategory();
        for (Map<String, Object> main : mains) {

            String code_type1 = main.get("code_type1").toString();
            List<Map<String, Object>> sub = subs.stream()
                    .filter(m -> m.get("type").toString().equals(code_type1)).collect(Collectors.toList());
            main.put("sub",sub );
        }

        model.addAttribute("subCategories", mains);

        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        return "pages/commerce/commerce_area";
    }

    @PostMapping( "/area-heatmap")
    public @ResponseBody
    Map<String, Object> areaGetHeatmap(@RequestBody Map<String, Object> params) throws FactoryException {
        System.out.println(params);
        // api 에러시 throws 처리
        params.put("blob", geoService.makeHeatMap(params));
        return params;
    }

    @PostMapping( "/area-gradient")
    public @ResponseBody
    Map<String, Object> areaGetGradient(@RequestBody Map<String, Object> params) {
        long beforeTime = System.currentTimeMillis();

        System.out.println(params);
        params.put("grid", commerceService.getGrid(params));
        long afterTime = System.currentTimeMillis(); // 코드 실행 후에 시간 받아오기
        long secDiffTime = (afterTime - beforeTime)/1000; //두 시간에 차 계산
        System.out.println("시간차이(m) : "+secDiffTime);
        return params;
    }

    @GetMapping("/service")
    public String commerceService(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_service";
    }

}
