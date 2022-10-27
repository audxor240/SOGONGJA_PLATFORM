package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.Survey;
import com.stoneitgt.sogongja.domain.UserAnswer1;
import com.stoneitgt.sogongja.domain.UserQuestion;
import com.stoneitgt.sogongja.domain.UserSurvey;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SurveyMapper {

    List<Map<String, Object>> getSurveySubList(int surveySettingSeq);

    Survey getSurvey(int surveySettingSeq);

    int insertUserSurvey(UserSurvey userSurvey);

    int insertUserQuestion(UserQuestion userQuestion);

    int insertUserAnswer1(UserAnswer1 userAnswer1);
}
