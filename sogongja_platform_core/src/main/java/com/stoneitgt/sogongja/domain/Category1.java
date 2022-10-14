package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Category1 {

    // 대분류 시퀀스
    private int category1Seq;

    // 중분류 시퀀스
    private int category2Seq;

    // 소분류 시퀀스
    private int category3Seq;

    //이름
    private String name;

    // 로그인 사용자
    private int loginUserSeq;

    //등록되어 있는 카테고리
    private String groupName;

    private String delGroupSeq;

    //타입
    private int type;
}
