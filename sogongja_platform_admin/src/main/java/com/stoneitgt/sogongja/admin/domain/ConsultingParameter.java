package com.stoneitgt.sogongja.admin.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ConsultingParameter extends BaseParameter {

	private String conType;

	private String conClass;

	private String category1;

	private String category2;

	private String category3;

	private String supportOrg;

}