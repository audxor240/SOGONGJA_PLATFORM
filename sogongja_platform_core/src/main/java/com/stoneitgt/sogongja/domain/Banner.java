package com.stoneitgt.sogongja.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class Banner {
    // 배너 시퀀스
    private int bannerSeq;

    // 배너 제목
    @NotBlank(message = "{field.required}")
    private String title;

    // 배너 URL
    private String url;

    // 배너 오픈 형식
    private String urlOpenType;

    // 배너 사용 여부
    private String used;

    // 첨부파일
    List<MultipartFile> attachFiles;

    // 로그인 사용자
    private int loginUserSeq;

    List<MultipartFile> imageFile;

}
