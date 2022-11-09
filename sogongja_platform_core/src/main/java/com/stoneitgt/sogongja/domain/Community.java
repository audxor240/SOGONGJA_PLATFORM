package com.stoneitgt.sogongja.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Data
public class Community {

    // 게시판순번
    private int communitySeq;

    // 제목
    @NotBlank(message = "{field.required}")
    private String subject;

    // 내용
    @NotBlank(message = "{field.required}")
    private String content;

    // 등록일
    private String regDt;

    // 로그인 사용자
    private int loginUserSeq;

    private String pageParams;

    private int regUserSeq;

    // 첨부파일
    List<MultipartFile> attachFiles = new ArrayList<>();

    private String regionName1;	//지역(시)
    private String regionName2;	//지역(구)
    private String regionName3;	//지역(동)

    private String categoryName1;	//업종(대분류)
    private String categoryName2;	//업종(중분류)

    private String communityType;	//커뮤니티 타입
}
