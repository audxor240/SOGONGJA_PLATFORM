package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class EmailToken {

    private String token;
    private String email;
    private String regDate;
}
