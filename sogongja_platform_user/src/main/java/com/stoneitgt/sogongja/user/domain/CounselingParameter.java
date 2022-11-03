package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CounselingParameter extends BaseParameter {

	private String couType;

	private String couClass;

	private String category1;

	private String category2;

	private String category3;

	private String supportOrg;

	private boolean conWatchingView1 = false;

	private boolean conWatchingView2 = false;

}