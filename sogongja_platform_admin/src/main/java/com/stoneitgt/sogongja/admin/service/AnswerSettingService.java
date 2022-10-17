package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class AnswerSettingService {
    @Autowired
    private AnswerSettingMapper answerSettingMapper;

    public List<Map<String, Object>> getAnswerSettingList(int questionSeq) {
        return answerSettingMapper.getAnswerSettingList(questionSeq);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteAnswer(Map<String, Object> params){
        answerSettingMapper.deleteAnswer(params);
    }
}
