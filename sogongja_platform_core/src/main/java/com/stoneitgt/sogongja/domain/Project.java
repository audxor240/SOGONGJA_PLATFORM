package com.stoneitgt.sogongja.domain;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Project {

	// 지원사업순번
	private int projectSeq;

	// 지원사업분류
	@NotBlank(message = "{field.required}")
	private String projectType;

	// 지원사업년도
	@NotBlank(message = "{field.required}")
	@Size(min = 4, max = 4)
	private String projectYear;

	// 지원사업지역
	@NotBlank(message = "{field.required}")
	private String place;

	// 제목
	@NotBlank(message = "{field.required}")
	private String subject;

	// 내용
	@NotBlank(message = "{field.required}")
	private String content;

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
