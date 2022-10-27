package com.stoneitgt.sogongja.domain;


import lombok.Data;

@Data
public class UserSurvey {

    private int userSurveySeq;

    private int surveySettingSeq;

    // 로그인 사용자
    private int loginUserSeq;

}
