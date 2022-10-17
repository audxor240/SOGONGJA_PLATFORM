package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.mapper.AnswerMapper;
import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import com.stoneitgt.sogongja.domain.AnswerSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnswerService extends BaseService {

    @Autowired
    private AnswerMapper answerMapper;


}
