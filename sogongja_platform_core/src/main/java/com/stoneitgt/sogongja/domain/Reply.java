package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Reply {

    private int replySeq;

    private String comment;

    private int communitySeq;

    private String communityType;

    // 로그인 사용자
    private int loginUserSeq;
}
