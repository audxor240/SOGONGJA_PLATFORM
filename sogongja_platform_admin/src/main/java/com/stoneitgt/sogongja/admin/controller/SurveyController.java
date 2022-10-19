package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.AnswerSettingService;
import com.stoneitgt.sogongja.admin.service.QuestionService;
import com.stoneitgt.sogongja.admin.service.SurveyService;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.sogongja.domain.Survey;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/survey")
@RequiredArgsConstructor
public class SurveyController extends BaseController {


    @Autowired
    private SurveyService surveyService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AnswerSettingService answerSettingService;

    @GetMapping("")
    public String surveyList(@ModelAttribute EducationParameter params, Model model) {

        List<Map<String, Object>> list = surveyService.getSurveySettingList();
        System.out.println("list ::: "+list);
        model.addAttribute("list", list);
        model.addAttribute("params", params);
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "설문 관리");
        model.addAttribute("breadcrumb", breadcrumb);

        return "pages/survey/survey_list";
    }

    @GetMapping("/{surveySeq}")
    public String serveyView(@PathVariable int surveySeq, @ModelAttribute EducationParameter params, Model model) {

        //설문 관리 정보
        Survey survey = surveyService.getSurveySetting(surveySeq);

        //질문 관리 리스트 정보
        List<Map<String, Object>> list = questionService.getQuestionList();

        //설문 관리 sub 정보
        List<Map<String, Object>> listSub = surveyService.getSurveySubList(surveySeq);

        List<Integer> qArr = new ArrayList<>();
        if(listSub != null){
            for (Map<String, Object> element : listSub){
                qArr.add((Integer) element.get("question_setting_seq"));
            }
        }
        System.out.println("qArr :: "+qArr);
        System.out.println("survey :: "+survey);
        model.addAttribute("survey", survey);
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "설문 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("list", list);
        model.addAttribute("listSub", listSub);
        model.addAttribute("qArr", qArr);

        return "pages/survey/survey_form";
    }

    @PostMapping("/form")
    public String saveSurvey(@RequestParam(required = false) String menuCode,
                             @ModelAttribute("survey") @Valid Survey survey, BindingResult bindingResult, Model model,
                             RedirectAttributes rttr) throws IOException {

        String returnUrl = "redirect:/survey/";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
        survey.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        System.out.println("survey >>> "+survey);
        if(survey.getSurveyUse() == null){
            survey.setSurveyUse("N");
        }
        surveyService.saveSurvey(survey);
        return returnUrl;
    }

    @PostMapping("/preview")
    public String surveyPreview(Model model,@RequestBody Map<String, Object> params) throws IOException {

        List<QuestionSetting> List = new ArrayList<>();
        List<List<String>> answerArrList = new ArrayList<>();

        List<String> qSeqArr = (List<String>) params.get("qSeqArr");
        // 추가된 질문 개수만큼 루프
        for(int i=0;i< qSeqArr.size();i++){
            String questionSettingSeq = qSeqArr.get(i);
            //질문 정보 조회
            QuestionSetting questionSetting = questionService.getQuestionSetting(Integer.parseInt(questionSettingSeq));

            List<String> answerArr = new ArrayList<>();
            //질문이 선택형이면
            if(questionSetting.getQuestionType().equals("choice")){
                //답변 정보 조회
                List<Map<String, Object>> listSub = answerSettingService.getAnswerSettingList(questionSetting.getQuestionSettingSeq());

                //해당질문의 답변 배열에 저장
                for(int j =0; j < listSub.size();j++){
                    String answer = (String) listSub.get(j).get("answer");
                    answerArr.add(answer);
                }
                answerArrList.add(answerArr);
            }else{
                answerArrList.add(null);
            }
            List.add(questionSetting);
        }

        model.addAttribute("answerArrList", answerArrList);
        model.addAttribute("List", List);

        return "pages/survey/survey_form"+ " :: #dtsch_modal";
    }

}
