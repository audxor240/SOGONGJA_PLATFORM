package com.stoneitgt.sogongja.domain;

import com.stoneitgt.common.Paging;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BaseParameter extends Paging {

	// 검색필드
	private String field;

	// 검색어
	private String keyword;

	// 정렬방식
	private String sortType;

	// 정렬필드
	private String sortName;

	// 년도
	private String year;

	// 카테고리
	private String category;

	// 기간시작일
	private String fromDate;

	// 기간종료일
	private String toDate;

	// 로그인 사용자
	private int loginUserSeq;

	// 메뉴코드
	private String menuCode;
}