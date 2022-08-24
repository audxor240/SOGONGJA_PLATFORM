package com.stoneitgt.util;

import org.springframework.core.env.Environment;

public class PropertyUtil {

	public static String[] getPropertyArray(Environment env, String str) {
		String[] result = null;
		if (StringUtil.isNotBlank(env.getProperty(str))) {
			result = env.getProperty(str).split("\\|");
		}
		return result;
	}

	public static boolean getPropertyIsBoolean(Environment env, String str) {
		boolean result = false;
		if (StringUtil.isNotBlank(env.getProperty(str))) {
			result = Boolean.parseBoolean(env.getProperty(str));
		}
		return result;
	}
}
