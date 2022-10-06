package com.stoneitgt.sogongja.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class Answer {

    // 답변 시퀀스
    private int answerSeq;

    // 게시판 시퀀스
    private int boardSeq;

    @NotBlank(message = "{field.required}")
    private String comment;
}
