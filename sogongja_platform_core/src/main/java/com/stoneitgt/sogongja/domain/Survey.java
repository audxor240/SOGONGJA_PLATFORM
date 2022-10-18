package com.stoneitgt.sogongja.domain;

import lombok.Data;

import java.util.List;

@Data
public class Survey {

    /*
    SURVEY_SETTING_SEQ
    SURVEY_TYPE1
    SURVEY_TYPE2
    TITLE
    SURVEY_USE
    */

    //설문 관리 시퀀스
    private int surveySettingSeq;

    private String surveyType1;

    private String surveyType2;

    private String title;

    private String surveyUse;

    // 로그인 사용자
    private int loginUserSeq;

    private List<Integer> qSeqList;


}
