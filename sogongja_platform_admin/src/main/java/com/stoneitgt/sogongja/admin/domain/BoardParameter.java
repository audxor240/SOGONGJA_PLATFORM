package com.stoneitgt.sogongja.admin.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BoardParameter extends BaseParameter {

	private String lawType;

	private String lawClass;

	private String projectType;

	private String place;

}