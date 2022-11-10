package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class BoardParameter extends BaseParameter {

	private String lawType;

	private String lawClass;

	private String projectType;

	private String place;

	private List<String> projectTypeList;

	private List<String> placeList;

}