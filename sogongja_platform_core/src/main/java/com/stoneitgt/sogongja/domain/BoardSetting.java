package com.stoneitgt.sogongja.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class BoardSetting {

    /*
    NAME
    DESC
    FILE_USE
    ANSWER_USE
    SECRET_USE
    */

    // 게시판 설정 순번
    private int boardSettingSeq;

    // 게시판 이름
    @NotBlank(message = "{field.required}")
    private String name;

    // 설명
    @NotBlank(message = "{field.required}")
    private String description;

    @NotBlank
    private String boardType;

    // 첨부파일 사용 여부
    private int fileUse;

    // 답변 사용 여부
    private int answerUse;

    // 비밀글 사용 여부
    private int secretUse;

    private String fileDirectoryName;

    private String pageParams;

    // 로그인 사용자
    private int loginUserSeq;

    // 등록일
    private String regDt;

}
