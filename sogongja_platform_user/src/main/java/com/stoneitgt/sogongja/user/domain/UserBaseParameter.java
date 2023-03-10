package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserBaseParameter extends BaseParameter {

	// κ²μμΌμ
	private String searchDay;

	private String searchMonth;

	private String userType;

	private String searchDate;

	private String status;
}