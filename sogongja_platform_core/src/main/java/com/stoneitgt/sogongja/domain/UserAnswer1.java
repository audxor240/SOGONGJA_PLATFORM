package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class UserAnswer1 {

    /*
    CATEGORY3_SEQ
    RANK
    TYPE
    ADDRESS
    USER_QUESTION_SEQ

    */

    private int userAnswer1Seq;

    private int category3Seq;

    private int rank;

    private int type;

    private String address;

    private int userQuestionSeq;

    // 로그인 사용자
    private int loginUserSeq;




}
