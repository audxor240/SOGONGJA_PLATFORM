package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class UserKeyword {

    private int userKeywordSeq;

    private int questionSettingKeywordSeq;

    private String keyword;

    private int userAnswer1Seq;

    // 로그인 사용자
    private int loginUserSeq;

}
