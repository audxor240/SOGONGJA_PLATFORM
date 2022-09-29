package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.BannerService;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Education;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/banner")
public class BannerController extends BaseController {

    @Autowired
    private EducationService educationService;

    @Autowired
    private BannerService bannerService;

    @GetMapping("")
    public String bannerList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = bannerService.getBannerList(paramsMap, paging);
        Integer total = bannerService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "배너 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/banner/banner_list";
    }

    @GetMapping("/{bannerSeq}")
    public String bannerView(@PathVariable int bannerSeq, @ModelAttribute BaseParameter params, Model model) {



        model.addAttribute("banner", bannerService.getBanner(bannerSeq));
        model.addAttribute("menuCode", params.getMenuCode());
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "배너 관리");


        List<Map<String, Object>> fileList_pc = getFileList(GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_PC, bannerSeq);
        List<Map<String, Object>> fileList_mobile = getFileList(GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_MOBILE, bannerSeq);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("fileList_pc", fileList_pc);
        model.addAttribute("fileList_mobile", fileList_mobile);
        return "pages/banner/banner_form";
    }

    @GetMapping("/form")
    public String bannerForm(@ModelAttribute EducationParameter params, Model model) {
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "배너 관리");
        model.addAttribute("breadcrumb", breadcrumb);

        Banner banner = new Banner();
        model.addAttribute("banner", banner);
        return "pages/banner/banner_form";
    }

    @PostMapping("/form")
    public String saveBanner(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("banner") @Valid Banner banner, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {

        String returnUrl = "redirect:/banner/";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        banner.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        bannerService.saveBoard(banner);
        return returnUrl;
    }

    @PostMapping("/delete")
    public String deleteBanner(@RequestParam int bannerSeq, @RequestParam(required = false) String menuCode,
                                  Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("banner_seq", bannerSeq);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        bannerService.deleteBanner(params);
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        return "redirect:/banner";
    }


}
