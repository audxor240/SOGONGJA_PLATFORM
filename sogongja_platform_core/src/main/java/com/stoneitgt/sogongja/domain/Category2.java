package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Category2 {

    // 중분류 시퀀스
    private int category2Seq;

    // 이름
    private String name;

    // 로그인 사용자
    private int loginUserSeq;

    // 대분류 시퀀스
    private int category1Seq;
}
