package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class UserAnswer2 {

    private int userAnswer2Seq;

    private int category2Seq;

    private int answerSeq;

    private String answer;

    private int rank;

    // 로그인 사용자
    private int loginUserSeq;

    private int userQuestionSeq;
}
