package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.sogongja.admin.service.FaqService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.Faq;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/faq")
public class FaqController extends BaseController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private FaqService faqService;

    @GetMapping("")
    public String faqList(@ModelAttribute BaseParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        String url = "";
        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "콘텐츠 관리");
        breadcrumb.put("menu_name", "FAQ 관리");

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        System.out.println("paramsMap :: "+paramsMap);
        list = faqService.getFaqList(paramsMap, paging);

        Integer total = faqService.selectTotalRecords();
        paging.setTotal(total);


        model.addAttribute("list", list);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("category", getCodeList("FAQ_TYPE"));
        model.addAttribute("pageParams", getBaseParameterString(params));

        url = "pages/board/board_list_faq";
        return url;
    }

    @PostMapping("/form")
    public String savefaq(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("faq") @Valid Faq faq, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {
        System.out.println("faq >> "+faq);

        String returnUrl = "";

        returnUrl = "redirect:/faq";

        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
        faq.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        switch (faq.getType()){
            case "CON": faq.setTypeColor("primary"); faq.setTypeName("소공자 컨설팅"); break;
            case "EDU": faq.setTypeColor("success"); faq.setTypeName("소공자 교육"); break;
            case "GUIDE": faq.setTypeColor("info"); faq.setTypeName("이용 가이드"); break;
            case "USER": faq.setTypeColor("dark"); faq.setTypeName("소공자 회원"); break;
        }
        faqService.saveFaq(faq);

        return returnUrl;
    }

    @GetMapping("/{faqSeq}")
    public String faqForm(@ModelAttribute BaseParameter params, @PathVariable int faqSeq,Model model) {

        Faq faq = faqService.getFaq(faqSeq);

        model.addAttribute("faq", faq);
        model.addAttribute("menuCode", params.getMenuCode());
        Map<String, Object> breadcrumb = new HashMap<String, Object>();

        breadcrumb.put("parent_menu_name", "콘텐츠 관리");
        breadcrumb.put("menu_name", "FAQ 관리");

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
        model.addAttribute("params", params);

        return "pages/board/board_form_faq";
    }

    @PostMapping("/delete")
    public String deleteFaq(@RequestParam String faqStr, @RequestParam(required = false) String menuCode,
                                   Model model, RedirectAttributes rttr) throws IOException {

        List<String>faqSeqArr = Arrays.asList(faqStr.split(","));

        for(int i =0; i < faqSeqArr.size();i++) {
            int faqSeq = Integer.parseInt(faqSeqArr.get(i));
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("faq_seq", faqSeq);
            params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
            faqService.deleteFaq(params);
        }
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        return "redirect:/faq";
    }

}
