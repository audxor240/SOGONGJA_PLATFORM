package com.stoneitgt.sogongja.domain;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class Event {

    // 이벤트 시퀀스
    private int eventSeq;

    // 이벤트 제목
    @NotBlank(message = "{field.required}")
    private String title;

    // 이벤트 URL
    private String url;

    // 이벤트 사용 여부
    private String used;

    // 이벤트 시작 기간
    private String eventStart;

    // 이벤트 종료 기간
    private String eventEnd;

    // 로그인 사용자
    private int loginUserSeq;

    List<MultipartFile> imageFile;
}
