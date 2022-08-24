package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class SupportOrg {

	private int orgSeq;

	private String orgName;

	private String orgType;

	private String orgTel;

	private String orgFax;

	private String orgEmail;

	private String orgSite;

	private String addrRoad;

	private String addrLotNo;

	private String addrDetail;

	private String zipCode;

	private String place1;

	private String place2;

	private String introduce;

	// 등록일
	private String regDt;

	// 로그인 사용자
	private int loginUserSeq;

	private String pageParams;

	private String regUsername;
}
