package com.stoneitgt.sogongja.domain;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AnswerSetting {

    /*
    ANSWER_SEQ
    CATEGORY_2
    ANSWER
    */

    //답변 관리 시퀀스
    private int answerSettingSeq;

    //중분류
    private int category2;

    //답변
    private String answer;

    private int questionSettingSeq;

    // 로그인 사용자
    private int loginUserSeq;

    private String answerSeqStr;

    private List<Map<String, Object>> answerSeqList;

    private List<Map<String, Object>> answerNameList;

}
