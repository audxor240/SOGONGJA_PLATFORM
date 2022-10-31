package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Support {

    private int supportSeq;

    private String supportName;

    // 로그인 사용자
    private int loginUserSeq;
}
