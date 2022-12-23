package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.mapper.AreaMapper;
import com.stoneitgt.sogongja.user.service.AreaService;
import com.stoneitgt.sogongja.user.service.BoardService;
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

    @GetMapping("/area")
    public String commerceArea(@ModelAttribute BaseParameter params, Model model) {

        model.addAttribute("shopList", areaMapper.getAllShop());


        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        return "pages/commerce/commerce_area";
    }

    @PostMapping( "/area-heatmap")
    public @ResponseBody
    Map<String, Object> areaGetHeatmap(@RequestBody Map<String, Object> params, Model model, HttpServletResponse response) throws FactoryException {
        System.out.println(params);
        // api 에러시 throws 처리
        params.put("blob", geoService.makeHeatMap(params));
        return params;
    }

    @GetMapping("/service")
    public String commerceService(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_service";
    }

}
