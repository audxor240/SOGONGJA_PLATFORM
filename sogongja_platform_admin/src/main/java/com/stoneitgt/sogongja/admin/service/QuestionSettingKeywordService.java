package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingKeywordMapper;
import com.stoneitgt.sogongja.domain.QuestionSettingKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class QuestionSettingKeywordService extends BaseService {

    @Autowired
    private QuestionSettingKeywordMapper questionSettingKeywordMapper;

    public String getQuestionSettingKeywordList(int questionSeq) {
        return questionSettingKeywordMapper.getQuestionSettingKeywordList(questionSeq);
    }

}
