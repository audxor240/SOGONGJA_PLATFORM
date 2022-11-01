package com.stoneitgt.sogongja.domain;

import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Consulting {

	// 컨설팅순번
	private int conSeq;

	// 사례형태
	@NotBlank(message = "{field.required}")
	private String conType;

	// 사례분류
	@NotBlank(message = "{field.required}")
	private String conClass;

	// 교육명
	@NotBlank(message = "{field.required}")
	private String subject;

	// 내용
	@NotBlank(message = "{field.required}")
	private String content;

	// 지원기관
	@NotBlank(message = "{field.required}")
	private String supportOrg;

	// URL
	private String conUrl;

	// 추천여부
	private int recommendFlag;

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

	// 대분류
	@NotBlank(message = "{field.required}")
	private String category1;

	// 중분류
	private String category2;

	// 세분류
	private String category3;

	private String supportContent;

	private String supportBy;

	private String region;
}
