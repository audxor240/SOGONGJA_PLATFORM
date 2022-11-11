package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.mapper.ServiceMatchingMapper;
import com.stoneitgt.sogongja.domain.SurveyMatching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Service
public class MatchingService extends BaseService {

    @Autowired
    private ServiceMatchingMapper serviceMatchingMapper;

    @Transactional
    public Map<String, Object> getTitle(int userSeq) {
        return serviceMatchingMapper.getTitle(userSeq);
    }

    @Transactional
    public List<SurveyMatching> getSurveyList(int userSeq) {

        List<Map<String, Object>> questionList = serviceMatchingMapper.getQuestionList(userSeq);

        List<SurveyMatching> resultList = new ArrayList<>();

        for (Map<String, Object> question : questionList) {

            SurveyMatching surveyMatching = new SurveyMatching();
            int questionSeq = Integer.parseInt((question.get("question_setting_seq").toString()));

            Map<String, Object> questionDetail = serviceMatchingMapper.getQuestion(questionSeq);
            int userQuestionSeq = Integer.parseInt(questionDetail.get("user_question_seq").toString());
            String coa = questionDetail.get("question_type").toString();
            surveyMatching.setQuestion(questionDetail.get("title").toString());

            if (coa.equals("choice")) {
                Map<String, Object> choiceAnswer = serviceMatchingMapper.getChoiceAnswer(userQuestionSeq);
                int ranked = Integer.parseInt(choiceAnswer.get("ranked").toString());

                String answer = " ";

                if (ranked == 0) {
                    String[] answers = choiceAnswer.get("answer").toString().split("\\^");
                    for (int i = 0; i < answers.length; i++) {
                        answer += answers[i];
                        if (i < answers.length - 1) {
                            answer += ", ";
                        }
                    }
                } else {
                    String[] answers = choiceAnswer.get("answer").toString().split("\\^");
                    for (int i = 0; i < answers.length; i++) {
                        answer += (i + 1) + ". " + answers[i];
                    }
                }
                surveyMatching.setAnswer(answer);
            } else {
                Map<String, Object> addAnswer = serviceMatchingMapper.getAddAnswer(userQuestionSeq);
                int ranked = Integer.parseInt(addAnswer.get("ranked").toString());

                String answer = addAnswer.get("answer").toString() + "<br/>";

                String keyword = addAnswer.get("keyword").toString();
                if (keyword.length() > 0) {
                    String[] answers = keyword.split("\\^");
                    if (ranked == 0) {
                        for (int i = 0; i < answers.length; i++) {
                            answer += answers[i];
                            if (i < answers.length - 1) {
                                answer += ", ";
                            }
                        }
                    } else {
                        for (int i = 0; i < answers.length; i++) {
                            answer += (i + 1) + ". " + answers[i];
                        }
                    }
                }
                surveyMatching.setAnswer(answer);
                }
            resultList.add(surveyMatching);
        }
        return resultList;
    }


}
