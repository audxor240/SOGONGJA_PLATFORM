package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class ConsultingBookmark {

    private int conMarkSeq;
    private int conSeq;
    private int userSeq;
    private int delFlag;
    private int regUserSeq;
    private String regDate;
    private int modUserSeq;
    private String modDate;
    private int delUserSeq;
    private String delDate;
}
