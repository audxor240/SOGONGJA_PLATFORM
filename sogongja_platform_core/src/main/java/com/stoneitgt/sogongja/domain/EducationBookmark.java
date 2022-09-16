package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class EducationBookmark {
    private int eduMarkSeq;
    private int userSeq;
    private int eduSeq;
    private int delFlag;
    private int regUserSeq;
    private String regDate;
    private int modUserSeq;
    private String modDate;
    private int delUserSeq;
    private String delDate;



}
