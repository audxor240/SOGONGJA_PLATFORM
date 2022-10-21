package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.*;
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
import java.util.*;

@Controller
@RequestMapping("/question")
public class QuestionController extends BaseController {

    @Autowired
    private EducationService educationService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private AnswerSettingService answerSettingService;

    @Autowired
    private QuestionSettingKeywordService questionSettingKeywordService;

    @GetMapping("")
    public String questionList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());
        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = questionService.getQuestionSettingList(paramsMap, paging);
        Integer total = questionService.selectTotalRecords();
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

    @GetMapping("/{questionSeq}")
    public String questionSettingView(@PathVariable int questionSeq, @ModelAttribute EducationParameter params, Model model) {
        QuestionSetting questionSetting = questionService.getQuestionSetting(questionSeq);
        System.out.println("questionSetting >>> "+questionSetting);
        model.addAttribute("questionSetting", questionSetting);
        //model.addAttribute("menuCode", params.getMenuCode());

        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "질문 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        List<Map<String, Object>> category1List = categoryService.getCategory1List();
        List<Map<String, Object>> category2List = categoryService.getCategory2List();
        List<Map<String, Object>> answerList = answerSettingService.getAnswerSettingList(questionSeq);
        String keywordStr = questionSettingKeywordService.getQuestionSettingKeywordList(questionSeq);
        System.out.println("keywordStr :: "+keywordStr);

        model.addAttribute("category1List", category1List);
        model.addAttribute("category2List", category2List);
        model.addAttribute("answerList", answerList);
        model.addAttribute("keywordStr", keywordStr);
        System.out.println("answerList 111:: "+answerList);



        for(int i =0;i < answerList.size();i++){
            List name_list = new ArrayList();
            List seq_list = new ArrayList();
            Map<String, Object> item = answerList.get(i);
            String nameStr = (String) item.get("g_name");
            String seqStr = (String) item.get("g_seq");

            name_list = Arrays.asList(nameStr.split(","));
            seq_list = Arrays.asList(seqStr.split(","));

            item.put("nameArr",name_list);
            item.put("seqArr",seq_list);
        }
        System.out.println("answerList 222:: "+answerList);

        model.addAttribute("pageParams", getBaseParameterString(params));
        System.out.println("CHECK------------------------------------1");
        return "pages/survey/questions_form";
    }

    @GetMapping("/form")
    public String questionForm(@ModelAttribute BaseParameter params, Model model) {

        //int surveySeq = 2882;   // 테스트용

        QuestionSetting questionSetting = new QuestionSetting();
        model.addAttribute("questionSetting", questionSetting);
        System.out.println("questionSetting >>>>> "+questionSetting);

        model.addAttribute("menuCode", params.getMenuCode());
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "질문 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        List<Map<String, Object>> category1List = categoryService.getCategory1List();
        List<Map<String, Object>> category2List = categoryService.getCategory2List();

        model.addAttribute("category1List", category1List);
        model.addAttribute("category2List", category2List);

        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/survey/questions_form";
    }

    @PostMapping("/form")
    public String saveQuestionSetting(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("questionSetting") @Valid QuestionSetting questionSetting, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {
        String returnUrl = "";

        //질문 유형이 항목 선택형이면
        if(questionSetting.getQuestionType().equals("choice")){
            questionSetting.setAnswerType(3);
            if(questionSetting.getMultipleUse().equals("N")){
                questionSetting.setRankChangeUse("N");
                questionSetting.setMaximumUse(null);
            }
        }

        if (questionSetting.getQuestionSettingSeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
            returnUrl += "menuCode=" + menuCode;
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
            returnUrl += questionSetting.getPageParams();
        }
        returnUrl = "redirect:/question"+ "?";

        AnswerSetting answerSetting = new AnswerSetting();
        answerSetting.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        questionSetting.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        System.out.println("questionSetting >> "+questionSetting);
        //BoardSetting boardSetting = questionService.getQuestionSetting(questionSetting.getQuestionSettingSeq());
        questionService.saveQuestionSetting(questionSetting, answerSetting);

        return returnUrl;
    }

    @PostMapping("/delete")
    public String deleteQuestionSetting(@RequestParam List<Integer> delSeqList,
                                  Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("delSeqList", delSeqList);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        int login_user_seq = authenticationFacade.getLoginUserSeq();
        System.out.println("params >>> "+params);
        questionService.deleteQuestionSetting(delSeqList, login_user_seq);
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        return "redirect:/question";
    }
}
