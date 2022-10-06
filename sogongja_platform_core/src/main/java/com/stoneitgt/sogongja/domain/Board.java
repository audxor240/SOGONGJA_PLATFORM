package com.stoneitgt.sogongja.domain;

import java.util.List;

import javax.validation.constraints.NotBlank;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Board {

	// 게시판순번
	private int boardSeq;

	// 게시판유형
	@NotBlank
	private String boardType;

	// 제목
	@NotBlank(message = "{field.required}")
	private String subject;

	// 내용
	@NotBlank(message = "{field.required}")
	private String content;

	// 카테고리
	private String category;

	// 조회수
	private int readCnt;

	// 공지여부
	private int noticeFlag;

	// 팝업여부
	private int popupFlag;

	// 팝업시작일
	private String fromDt;

	// 팝업종료일
	private String toDt;

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

	private String secretUse;

	private int regUserSeq;

	private int boardSettingSeq;

	private int answerSeq;

	private String comment;

}
