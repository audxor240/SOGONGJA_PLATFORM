package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class QuestionSettingKeyword {

    // 질문 키워드 시퀀스
    private int questionSettingKeywordSeq;

    // 질문 설정 시퀀스
    private int questionSettingSeq;

    // 키워드
    private String keyword;

    // 로그인 사용자
    private int loginUserSeq;

    private String keywordStr;
}
