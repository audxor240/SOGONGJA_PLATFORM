package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.util.StoneUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping("/commerce")
public class CommerceController extends BaseController {

    @GetMapping("/area")
    public String commerceArea(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_area";
    }

    @PostMapping("/area-heatmap")
    public @ResponseBody
    Map<String, Object> areaGetHeatmap(@RequestBody Map<String, Object> params, Model model) {
        System.out.println(params.get("test"));
        return new HashMap<String, Object>();
    }

    @GetMapping("/service")
    public String commerceService(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_service";
    }

}
