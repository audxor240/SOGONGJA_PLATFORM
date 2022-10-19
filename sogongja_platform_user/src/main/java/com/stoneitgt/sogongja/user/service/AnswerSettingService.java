package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.mapper.AnswerSettingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnswerSettingService extends BaseService{

    @Autowired
    private AnswerSettingMapper answerSettingMapper;

    public List<Map<String, Object>> getAnswerSettingList(int questionSeq) {
        return answerSettingMapper.getAnswerSettingList(questionSeq);
    }
}
