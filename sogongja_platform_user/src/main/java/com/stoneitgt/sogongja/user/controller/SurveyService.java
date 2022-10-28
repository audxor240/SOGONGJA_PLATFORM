package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.*;
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

    public int insertUserSurvey(UserSurvey userSurvey){

        return surveyMapper.insertUserSurvey(userSurvey);
    }

    public int insertUserQuestion(UserQuestion userQuestion){

        return surveyMapper.insertUserQuestion(userQuestion);
    }

    public int insertUserAnswer1(UserAnswer1 userAnswer1){

        return surveyMapper.insertUserAnswer1(userAnswer1);
    }

    public int insertUserAnswer2(UserAnswer2 userAnswer2){

        return surveyMapper.insertUserAnswer2(userAnswer2);
    }

    public int insertUserKeyword(UserKeyword userKeyword){

        return surveyMapper.insertUserKeyword(userKeyword);
    }

    public UserSurvey getUserSurvey(int userSeq){
        return surveyMapper.getUserSurvey(userSeq);
    }

    public void deleteAllSurvey(int userSeq){
        surveyMapper.deleteUserSurvey(userSeq);
        surveyMapper.deleteUserQuestion(userSeq);
        surveyMapper.deleteUserAnswer1(userSeq);
        surveyMapper.deleteUserAnswer2(userSeq);
        surveyMapper.deleteUserKeyword(userSeq);
    }
}
