package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.BaseParameter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/commerce")
public class CommerceController extends BaseController {

    @GetMapping("/area")
    public String commerceArea(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_area";
    }

    @GetMapping("/service")
    public String commerceService(@ModelAttribute BaseParameter params, Model model) {
        return "pages/commerce/commerce_service";
    }

}
