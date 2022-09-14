package com.stoneitgt.sogongja.domain;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
public class User implements UserDetails {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;

	private Collection<? extends GrantedAuthority> authorities;

	private boolean accountNonExpired;

	private boolean accountNonLocked;

	private boolean credentialsNonExpired;

	private boolean enabled;

	// 사용자 순번
	private int userSeq;

	// 아이디
	@NotBlank(message = "{field.required}")
	@Size(min = 5, max = 20)
	@Pattern(regexp = "^[a-z0-9]{5,20}$", message = "{id.illeal_match}")
	private String id;

	private String checkedId;

	// 비밀번호
	private String password;

	// 비밀번호 확인
	private String passwordConfirm;

	// 사용자명
	@NotBlank(message = "{field.required}")
	@Size(min = 2, max = 50)
	private String username;

	// 영문이름
	private String usernameEng;

	// 전화번호
	@Size(min = 10, max = 20)
	@Pattern(regexp = "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$", message = "{tel.illeal_match}")
	private String tel;

	private String tel1;
	private String tel2;
	private String tel3;

	// 휴대폰번호
	@Size(min = 10, max = 20)
	@Pattern(regexp = "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$", message = "{tel.illeal_match}")
	private String hp;

	private String hp1;
	private String hp2;
	private String hp3;

	// 이메일
	@NotBlank(message = "{field.required}")
	@Email(regexp = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$")
	private String email;

	private String email1;
	private String email2;
	private String email3;

	private String agree1;
	private String agree2;

	// 부서
	private String dept;

	// 직업
	private String position;

	// 권한
	private String auth;

	// 사용자 구분
	private String userType;

	// 소속
	private String company;

	// 소속명
	private String companyName;

	// 생년월일
	private String birthDay;

	// 성별
	private String gender;

	// 면허번호
	private String licenseNo;

	// 은행
	private String bank;

	// 계좌번호
	private String accountNo;

	// 비고
	private String description;

	// 잠김여부
	private int lockFlag;

	// 탈퇴여부
	private int withdrawFlag;

	// 탈퇴일자
	private String withdrawDt;

	// 변경 비밀번호
	private String newPassword;

	// 권한
	private List<Map<String, Object>> authMenu;

	private int loginUserSeq;

	private String pageParams;

	private String category;

	private List<String> categoryList;

	private String uniqueId;

	private String socialType;

	private String type01;

	private String type02;

	private String age;

	private String serviceType;

	private String googleId;

	private String kakaoId;

	private String naverId;

	private String type;

	private String ageGroup;


}
