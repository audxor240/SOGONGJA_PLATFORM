package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Faq {

    private int faqSeq;

    private String type;

    private String typeName;

    private String typeColor;

    private String subject;

    private String content;

    private int loginUserSeq;
}
