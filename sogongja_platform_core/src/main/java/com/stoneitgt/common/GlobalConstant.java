package com.stoneitgt.common;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class GlobalConstant {

	public static final String SESSION_ADMIN_KEY = "ss_admin";
	public static final String SESSION_USER_KEY = "ss_user";

	public static List<Map<String, Object>> ALLOWED_IP_ADDRESS = new ArrayList<>();

	public static final String[] BLACK_ID_LIST = { "admin", "super", "root" };

	public static final class PAGE_SIZE {
		public static final int DEFAULT_SIZE = 10;
		public static final int MYPAGE_HISTORY = 5;
		public static final int USER_PAGE_GROUP_SIZE = 5;
		public static final int USER_EDUCATION= 9;
		public static final int USER_EDUCATION_SOLUTION= 6;
	}

	public static final class API_STATUS {
		public static final int SUCCESS = 200;
		public static final int FAIL = -100;
		public static final int AUTH_DENY = -999;
		public static final int NO_AUTH = -900;
	}

	public static final class CRUD_TYPE {
		public static final String INSERT = "1";
		public static final String UPDATE = "2";
		public static final String DELETE = "3";
		public static final String SAVE = "4";
	}

	public static final class FILE_REF_TYPE {
		public static final String BOARD = "board";
		public static final String BANNER_PC = "banner_pc";
		public static final String BANNER_MOBILE = "banner_mobile";

		public static final String PROJECT = "project";
		public static final String COMMUNITY = "community";
		public static final String LAW = "law";
		public static final String EDUCATION = "education";
		public static final String EDUCATION_IMAGE = "education_image";
		public static final String CONSULTING = "consulting";
		public static final String COUNSELING = "counseling";
		public static final String BANNER_IMAGE_PC = "banner_image_pc";
		public static final String BANNER_IMAGE_MOBILE = "banner_image_mobile";
		public static final String EVENT_POP = "event_pop";
	}

	public static final class BOARD_TYPE {
		public static final String NOTICE = "notice";
		public static final String NEWS = "news";
		public static final String FAQ = "faq";
		public static final String COMMUNITY = "community";

		public static final String QNA = "qna";

		public static final String SETTING = "setting";
	}

}
