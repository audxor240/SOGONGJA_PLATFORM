package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingKeywordMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingMapper;
import com.stoneitgt.sogongja.domain.AnswerSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.sogongja.domain.QuestionSettingKeyword;
import org.apache.commons.compress.compressors.zstandard.ZstdCompressorOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

@Service
public class QuestionService extends BaseService {

    @Autowired
    private QuestionSettingMapper questionSettingMapper;

    @Autowired
    private AnswerSettingMapper answerSettingMapper;

    @Autowired
    private QuestionSettingKeywordMapper questionSettingKeywordMapper;


    public QuestionSetting getQuestionSetting(int questionSettingSeq) {
        QuestionSetting questionSetting = questionSettingMapper.getQuestionSetting(questionSettingSeq);
        return questionSetting;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveQuestionSetting(QuestionSetting questionSetting, AnswerSetting answerSetting) throws IOException {
        int result = 0;

        if (questionSetting.getQuestionSettingSeq() == 0) {
            //질문 추가
            result = questionSettingMapper.insertQuestionSetting(questionSetting);
        } else {
            //질문 update
            result = questionSettingMapper.updateQuestionSetting(questionSetting);

            if(questionSetting.getQuestionType().equals("choice")) {
                //관련 답변을 전부 삭제
                answerSettingMapper.deleteAllAnswer(questionSetting);
            }else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2){
                //관련 키워드를 전부 삭제
                questionSettingKeywordMapper.deleteAllQuestionSettingKeyword(questionSetting);
            }
        }

        //선택형이면
        if(questionSetting.getQuestionType().equals("choice")) {
            answerSetting.setQuestionSettingSeq(questionSetting.getQuestionSettingSeq());
            //답변 리스트 추가, 답변하나당 카테고리 개수만큼 추가해준다
            for (int i = 0; i < questionSetting.getAnswerTitleList().size(); i++) {
                String answer = questionSetting.getAnswerTitleList().get(i);

                answerSetting.setAnswer(answer);
                String tag_str = questionSetting.getAnswerTagList().get(i);
                String[] tag_arr = tag_str.split("\\|");

                for (int j = 0; j < tag_arr.length; j++) {
                    String category2 = tag_arr[j];
                    System.out.println("category2 :: " + category2);
                    answerSetting.setCategory2(Integer.parseInt(category2));
                    answerSettingMapper.insertAnswerSetting(answerSetting);
                }
            }
        }else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2){  //추가형[주소]
            QuestionSettingKeyword questionSettingKeyword = new QuestionSettingKeyword();
            for (int i = 0; i < questionSetting.getKeywordList().size(); i++) {
                String keyword = questionSetting.getKeywordList().get(i);

                questionSettingKeyword.setQuestionSettingSeq(questionSetting.getQuestionSettingSeq());
                questionSettingKeyword.setKeyword(keyword);
                questionSettingKeyword.setLoginUserSeq(questionSetting.getLoginUserSeq());

                questionSettingKeywordMapper.insertQuestionSettingKeyword(questionSettingKeyword);

            }
        }

        return result = 1;
    }

    public List<Map<String, Object>> getQuestionSettingList(Map<String, Object> params, Paging paging) {
        return questionSettingMapper.getQuestionSettingList(params, paging.getPaging());
    }

    public List<Map<String, Object>> getQuestionList() {
        return questionSettingMapper.getQuestionList();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteQuestionSetting(List<Integer> delSeqList, int login_user_seq) {

        //질문 개수 만큼 삭제
        for(int i=0; i < delSeqList.size();i++){
            int questionSettingSeq = delSeqList.get(i);
            QuestionSetting questionSetting = questionSettingMapper.getQuestionSetting(questionSettingSeq);

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("questionSettingSeq", questionSettingSeq);
            params.put("login_user_seq", login_user_seq);
            questionSettingMapper.deleteQuestionSetting(params);

            //질문이 '항목 선택형'일 경우에 답변을 삭제
            if(questionSetting.getQuestionType().equals("choice")) {
                //해당 질문의 답변 삭제
                questionSetting.setLoginUserSeq(login_user_seq);
                answerSettingMapper.deleteAllAnswer(questionSetting);
            }
        }

    }

    public Integer selectTotalRecords() {
        return questionSettingMapper.selectTotalRecords();
    }
}
