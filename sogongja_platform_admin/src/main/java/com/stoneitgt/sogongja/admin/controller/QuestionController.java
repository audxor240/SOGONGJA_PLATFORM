package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.sogongja.admin.service.QuestionService;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/question")
public class QuestionController extends BaseController {

    @Autowired
    private EducationService educationService;

    @Autowired
    private QuestionService questionService;

    @GetMapping("")
    public String questionList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());
        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);
        Integer total = educationService.selectTotalRecords();
        paging.setTotal(total);
        model.addAttribute("list", list);
        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "질문 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("category1", getCodeList("CATEGORY_1", "전체"));
        model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG", "전체"));
        return "pages/survey/questions_list";
    }

    @GetMapping("/form")
    public String questionForm(@ModelAttribute BaseParameter params, Model model) {

        //int surveySeq = 2882;   // 테스트용

        QuestionSetting questionSetting = new QuestionSetting();
        model.addAttribute("questionSetting", questionSetting);


        model.addAttribute("menuCode", params.getMenuCode());
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "질문 관리");
        model.addAttribute("breadcrumb", breadcrumb);

        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/survey/questions_form";
    }

    @PostMapping("/form")
    public String saveQuestionSetting(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("questionSetting") @Valid QuestionSetting questionSetting, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {
/*
        if (bindingResult.hasErrors()) {
            model.addAttribute("menuCode", menuCode);
            model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
            model.addAttribute("pageParams", board.getPageParams());

            if (GlobalConstant.BOARD_TYPE.FAQ.equals(board.getBoardType())) {
                model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
                return "pages/board/board_form_faq";
            } else {
                model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.BOARD, board.getBoardSeq()));
                return "pages/board/board_form";
            }
        }



        String returnUrl = "";
        if(GlobalConstant.BOARD_TYPE.COMMUNITY.equals(board.getBoardType())){
            returnUrl = "redirect:/board/type/" + board.getBoardType() + "?";
        }else{
            returnUrl = "redirect:/board/" + board.getBoardSettingSeq() + "?";
        }
*/
        String returnUrl = "";

        System.out.println("questionSetting :: "+questionSetting);

        //질문 유형이 항목 선택형이면
        if(questionSetting.getQuestionType().equals("choice")){
            questionSetting.setAnswerType(3);
        }

        if (questionSetting.getQuestionSettingSeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
            returnUrl += "menuCode=" + menuCode;
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
            returnUrl += questionSetting.getPageParams();
        }
        returnUrl = "redirect:/question"+ "?";
        questionSetting.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        //BoardSetting boardSetting = questionService.getQuestionSetting(questionSetting.getQuestionSettingSeq());
        //questionService.saveQuestionSetting(questionSetting);

        return returnUrl;
    }
}
