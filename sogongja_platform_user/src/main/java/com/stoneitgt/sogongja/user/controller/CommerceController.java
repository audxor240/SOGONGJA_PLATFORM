package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.mapper.AreaMapper;
import com.stoneitgt.sogongja.user.service.AreaService;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommerceService;
import com.stoneitgt.sogongja.user.service.GeoService;

import com.stoneitgt.util.StoneUtil;
import org.apache.commons.io.FileUtils;
import org.opengis.referencing.FactoryException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

import java.util.Map;


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
