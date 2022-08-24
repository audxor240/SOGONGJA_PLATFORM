package com.stoneitgt.sogongja.domain;

import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Law {

	// 법령순번
	private int lawSeq;

	// 법령명
	@NotBlank(message = "{field.required}")
	private String subject;

	// 내용
	@NotBlank(message = "{field.required}")
	private String content;

	// 법령유형
	private String lawType;

	// 법령종류
	private String lawClass;

	// 법령종류명칭
	private String lawClassEtc;

	// 제정/개정거분
	private String lawDiv;

	// 공포일자
	private String lawDate;

	// 시행일자
	private String enforceDate;

	// 공포번호
	private String lawNo;

	// 소관부처
	private String lawDepartment;

	// 조회수
	private int readCnt;

	// 태그
	private String tags;

	// 등록일
	private String regDt;

	// 로그인 사용자
	private int loginUserSeq;

	private String pageParams;

	// 첨부파일
	List<MultipartFile> attachFiles;

	private String regUsername;
}
