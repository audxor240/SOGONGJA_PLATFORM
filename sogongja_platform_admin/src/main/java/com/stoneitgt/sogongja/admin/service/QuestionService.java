package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.AnswerMapper;
import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingMapper;
import com.stoneitgt.sogongja.domain.AnswerSetting;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class QuestionService extends BaseService {

    @Autowired
    private QuestionSettingMapper questionSettingMapper;

    @Autowired
    private AnswerSettingMapper answerSettingMapper;

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

            answerSetting.setQuestionSettingSeq(questionSetting.getQuestionSettingSeq());
            //답변 리스트 추가, 답변하나당 카테고리 개수만큼 추가해준다
            for(int i= 0;i < questionSetting.getAnswerTitleList().size();i++ ){
                String answer = questionSetting.getAnswerTitleList().get(i);

                answerSetting.setAnswer(answer);
                String tag_str = questionSetting.getAnswerTagList().get(i);
                String[] tag_arr = tag_str.split("\\|");

                for(int j =0; j < tag_arr.length;j++){
                    String category2 = tag_arr[j];
                    answerSetting.setCategory2(category2);
                    answerSettingMapper.insertAnswerSetting(answerSetting);
                }
            }

        } else {
            result = questionSettingMapper.updateQuestionSetting(questionSetting);
        }

        return result;
    }
}
