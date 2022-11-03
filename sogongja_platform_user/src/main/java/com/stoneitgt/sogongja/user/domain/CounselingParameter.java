package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class CounselingParameter extends BaseParameter {

	private String couType;

	private String couClass;

	private String category1;

	private String category2;

	private String category3;

	private String field;

	private String supportOrg;

	private String year;

	private boolean conWatchingView1 = false;

	private boolean conWatchingView2 = false;

	private List<String> fieldList;

	private List<String> supportOrgList;

	private List<String> yearList;

}