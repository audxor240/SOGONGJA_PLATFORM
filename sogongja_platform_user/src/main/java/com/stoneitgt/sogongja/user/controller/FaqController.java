package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.FaqService;
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
@RequestMapping("/faq")
public class FaqController extends BaseController {

    @Autowired
    private FaqService faqService;

    @Autowired
    private BoardService boardService;

    @GetMapping("")
    public String faqList(@ModelAttribute BaseParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        String url = "";

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        list = faqService.getFaqList(paramsMap, paging);
        Map<String, Object> typeList = faqService.getFaqTypeList(paramsMap);

        Integer total = faqService.selectTotalRecords();
        paging.setTotal(total);

        List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

        String nlString = System.getProperty("line.separator").toString();

        //QNA게시판 시퀀스 정보
        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        model.addAttribute("list", list);
        model.addAttribute("typeList", typeList);
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        model.addAttribute("category", getCodeList("FAQ_TYPE"));
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("nlString", nlString);

        //url = "pages/board/board_list_faq";
        return "pages/board/faq";
    }
}
