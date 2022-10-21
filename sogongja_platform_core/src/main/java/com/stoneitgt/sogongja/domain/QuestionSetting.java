package com.stoneitgt.sogongja.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class QuestionSetting {
    /*
    QUESTION_TYPE
    TITLE
    DESCRIPTION
    MULTIPLE_USE
    RANK_CHANGE_USE
    MAXIMUM_USER
    MAXIMUM_NUM
    KEYWORD
    */

    // 질문 설정 순번
    private int questionSettingSeq;

    // 질문 유형
    private String questionType;

    // 질문 제목
    private String title;

    // 부가 설명
    private String description;

    // 복수선택 사용
    private String multipleUse;

    // 순위입력 사용
    private String rankChangeUse;

    // 최대수 사용
    private String maximumUse;

    // 최대수
    private int maximumNum;

    // 최대수
    private int answerType;

    //키워드
    private String keyword;

    // 로그인 사용자
    private int loginUserSeq;

    private String pageParams;

    // 답변 리스트
    //private List<Map<String,Object>> answerList;
    private List<String> answerTitleList;
    private List<String> answerTagList;

    private List<String> keywordList;

    // 등록일
    private String regDt;

}
