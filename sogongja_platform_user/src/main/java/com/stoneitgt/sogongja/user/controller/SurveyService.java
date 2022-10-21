package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.Survey;
import com.stoneitgt.sogongja.user.mapper.SurveyMapper;
import com.stoneitgt.sogongja.user.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SurveyService extends BaseService {

    @Autowired
    private SurveyMapper surveyMapper;

    public List<Map<String, Object>> getSurveySubList(int surveySettingSeq){

        return surveyMapper.getSurveySubList(surveySettingSeq);
    }

    public Survey getSurvey(int surveySettingSeq){
        return surveyMapper.getSurvey(surveySettingSeq);
    }
}
