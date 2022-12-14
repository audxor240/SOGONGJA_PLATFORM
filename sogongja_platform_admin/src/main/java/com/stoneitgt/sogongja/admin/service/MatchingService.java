package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.mapper.ServiceMatchingMapper;
import com.stoneitgt.sogongja.domain.SurveyMatching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;


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
        //List<Map<String, Object>> resultList = new ArrayList<>();

        for (Map<String, Object> question : questionList) {

            SurveyMatching surveyMatching = new SurveyMatching();
            int questionSeq = Integer.parseInt((question.get("user_question_seq").toString()));

            Map<String, Object> questionDetail = serviceMatchingMapper.getQuestion(questionSeq);
            int userQuestionSeq = Integer.parseInt(questionDetail.get("user_question_seq").toString());
            String coa = questionDetail.get("question_type").toString();
            surveyMatching.setQuestion(questionDetail.get("title").toString());

            if (coa.equals("choice")) {
                List<Map<String, Object>> choiceAnswer = serviceMatchingMapper.getChoiceAnswer(userQuestionSeq);
                List<String> answerArr = new ArrayList<>();
                List<Integer> rankArr = new ArrayList<>();
                List<List<String>> category2 = new ArrayList<>();
                for (Map<String, Object> item : choiceAnswer) {
                    answerArr.add((String) item.get("answer"));
                    if(item.get("rank") != null && !item.get("rank").equals(0)){
                        rankArr.add((Integer) item.get("rank"));
                    }

                    //answerArr.add((String) item.get("category2"));
                    List<String> category2Arr = Arrays.asList(((String) item.get("category2")).split(","));
                    category2.add(category2Arr);
                }
                surveyMatching.setAnswer(answerArr);
                surveyMatching.setCategory2(category2);
                surveyMatching.setRank(rankArr);
                /*Map<String, Object> choiceAnswer = serviceMatchingMapper.getChoiceAnswer(userQuestionSeq);
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
                        answer += (i + 1) + ". " + answers[i] + "<br/>";
                    }
                }
                surveyMatching.setAnswer(answer);*/
            } else {
                List<Map<String, Object>> addAnswerList = serviceMatchingMapper.getAddAnswer(userQuestionSeq);
                List<String> answerArr = new ArrayList<>();
                List<List<String>> keyword = new ArrayList<>();
                List<Integer> rankArr = new ArrayList<>();
                for (Map<String, Object> item : addAnswerList) {
                    List<String> keywordArr = new ArrayList<>();

                    answerArr.add((String) item.get("answer"));

                    if(item.get("rank") != null && !item.get("rank").equals(0)){
                        rankArr.add((Integer) item.get("rank"));
                    }

                    if(item.get("type").equals(2)){   //추가형[주소]이면 키워드 조회
                        List<Map<String, Object>> keyWordList = serviceMatchingMapper.getKeyword((Integer) item.get("user_answer1_seq"));
                        for (Map<String, Object> item2 : keyWordList) {
                            keywordArr.add((String) item2.get("keyword"));
                        }
                        keyword.add(keywordArr);
                    }
                }
                surveyMatching.setAnswer(answerArr);    //답변 리스트 저장
                surveyMatching.setKeyword(keyword);     //답변의 키워드 저장
                surveyMatching.setRank(rankArr);
                /*
                Map<String, Object> addAnswer = serviceMatchingMapper.getAddAnswer(userQuestionSeq);

                int ranked = Integer.parseInt(addAnswer.get("ranked").toString());

                String answer = " ";
                String answerRes = addAnswer.get("answer").toString();

                if (answerRes.length() > 0) {
                    String[] answers = answerRes.split("\\^");
                    if (ranked == 0) {
                        for (int i = 0; i < answers.length; i++) {
                            answer += answers[i];
                            if (i < answers.length - 1) {
                                answer += ", ";
                            }
                        }
                    } else {
                        for (int i = 0; i < answers.length; i++) {
                            answer += (i + 1) + ". " + answers[i] + "<br/>";
                        }
                    }
                    answer += "<br/>";
                }

                String keyword = addAnswer.get("keyword").toString();
                if (keyword.length() > 0) {
                    String[] keywords = keyword.split("\\^");
                    answer += "키워드 <br/>";
                    if (ranked == 0) {
                        for (int i = 0; i < keywords.length; i++) {
                            answer += keywords[i];
                            if (i < keywords.length - 1) {
                                answer += ", ";
                            }
                        }
                    } else {
                        for (int i = 0; i < keywords.length; i++) {
                            answer += (i + 1) + ". " + keywords[i] + "<br/>";
                        }
                    }
                }
                surveyMatching.setAnswer(answer);
                */
            }

            resultList.add(surveyMatching);
        }
        return resultList;
    }


}
