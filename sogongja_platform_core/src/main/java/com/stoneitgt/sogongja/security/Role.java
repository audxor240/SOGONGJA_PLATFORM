package com.stoneitgt.sogongja.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {

	SUPER("ROLE_SUPER"), ADMIN("ROLE_ADMIN"), USER("ROLE_USER");

	private String value;

}
