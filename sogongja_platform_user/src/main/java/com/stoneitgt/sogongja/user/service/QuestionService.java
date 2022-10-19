package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.sogongja.user.mapper.QuestionSettingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionService extends BaseService {

    @Autowired
    private QuestionSettingMapper questionSettingMapper;

    public QuestionSetting getQuestionSetting(int questionSettingSeq) {
        QuestionSetting questionSetting = questionSettingMapper.getQuestionSetting(questionSettingSeq);
        return questionSetting;
    }
}
