package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class Files {

	// 파일 순번
	private int fileSeq;

	// 참조타입
	private String refType;

	// 참조순번
	private int refSeq;

	// 파일유형
	private String fileType;

	// 파일명
	private String fileName;

	// 파일제목
	private String fileTitle;

	// 파일경로
	private String filePath;

	// 파일확장자
	private String fileExt;

	// 파일크기
	private String fileByte;

	// 파일사이즈
	private long fileSize;

	// 파일형태
	private String fileContentType;

	// 썸네일경로
	private String thumbnailPath;

	// 로그인 사용자
	private int loginUserSeq;

	private String crawlUrl;
}
