package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.*;
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

    int insertUserAnswer2(UserAnswer2 userAnswer2);

    int insertUserKeyword(UserKeyword userKeyword);

    UserSurvey getUserSurvey(int userSeq);

    void deleteUserSurvey(int userSeq);
    void deleteUserQuestion(int userSeq);
    void deleteUserAnswer1(int userSeq);
    void deleteUserAnswer2(int userSeq);
    void deleteUserKeyword(int userSeq);

}
