package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class SurveySub {
    /*
        SURVEY_SETTING_SUB_SEQ
        QUESTION_SETTING_SEQ
    */

    //설문관리 SUb 시퀀스
    private int surveySettingSubSeq;

    //설문관리 시퀀스
    private int surveySettingSeq;

    //질문관리 시퀀스
    private int questionSettingSeq;
}
