package com.stoneitgt.sogongja.admin.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
public class BoardParameter extends BaseParameter {

	private String lawType;

	private String lawClass;

	private String projectType;

	private String place;

	private Map<String,Object> projectList;

}