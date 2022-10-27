package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class UserQuestion {

    private int userQuestionSeq;

    private int questionSettingSeq;

    private int userSurveySeq;

    // 로그인 사용자
    private int loginUserSeq;
}
