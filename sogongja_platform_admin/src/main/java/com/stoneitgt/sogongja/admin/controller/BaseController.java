package com.stoneitgt.sogongja.admin.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.admin.component.AuthenticationFacade;
import com.stoneitgt.sogongja.admin.properties.SystemProperties;
import com.stoneitgt.sogongja.admin.service.CodeService;
import com.stoneitgt.sogongja.admin.service.FilesService;
import com.stoneitgt.sogongja.admin.service.MenuService;
import com.stoneitgt.sogongja.component.MessageByLocaleService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.util.StringUtil;

import lombok.extern.slf4j.Slf4j;

/**
 * 기본 컨트롤러.
 *
 * @author yh.kim
 */
@Slf4j
public class BaseController {

	@Autowired
	public AuthenticationFacade authenticationFacade;

	@Autowired
	public SystemProperties systemProperties;

	@Autowired
	public MessageByLocaleService messageByLocaleService;

	@Autowired
	private CodeService codeService;

	@Autowired
	private MenuService menuService;

	@Autowired
	private FilesService filesService;

	/**
	 * 사용자 IP 정보를 가져온다.
	 *
	 * @param request
	 * @return
	 */
	public String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("X-FORWARDED-FOR");
		if (ip == null) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	public Map<String, Object> getBreadcrumb(String menuCode) {
		return menuService.getBreadcrumb(menuCode);
	}

	public List<Map<String, Object>> getCodeList(String groupCode) {
		return getCodeList(groupCode, "선택하세요");
	}

	public List<Map<String, Object>> getCodeList(String groupCode, String strEmpty) {
		List<Map<String, Object>> list = codeService.getCodeList(groupCode);
		if (StringUtil.isNotBlank(strEmpty)) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("code", "");
			map.put("code_name", strEmpty);
			map.put("ref_value", "");
			list.add(0, map);
		}
		return list;
	}

	public List<Map<String, Object>> getCodeRefList(String groupCode, String refCode) {
		return getCodeRefList(groupCode, refCode, "선택하세요");
	}

	public List<Map<String, Object>> getCodeRefList(String groupCode, String refCode, String strEmpty) {
		List<Map<String, Object>> list = codeService.getCodeRefList(groupCode, refCode);
		if (StringUtil.isNotBlank(strEmpty)) {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("code", "");
			map.put("code_name", strEmpty);
			map.put("ref_value", "");
			list.add(0, map);
		}
		return list;
	}

	public int getSessionLoginUserSeq(HttpServletRequest request) {
		if (request.getSession() != null) {
			User user = (User) request.getSession().getAttribute(GlobalConstant.SESSION_ADMIN_KEY);
			return user.getUserSeq();
		} else {
			return -1;
		}
	}

	public String getBaseParameterString(BaseParameter params) {
		List<String> result = new ArrayList<String>();
		result.add("page=" + params.getPage());
		result.add("size=" + params.getSize());
		result.add("year=" + StringUtil.defaultString(params.getYear()));
		result.add("field=" + StringUtil.defaultString(params.getField()));
		try {
			result.add("keyword="
					+ URLEncoder.encode(StringUtil.defaultString(params.getKeyword()), StandardCharsets.UTF_8.name()));
		} catch (UnsupportedEncodingException e) {
			log.error("", e);
		}
		result.add("sortName=" + StringUtil.defaultString(params.getSortName()));
		result.add("sortType=" + StringUtil.defaultString(params.getSortType()));
		result.add("menuCode=" + StringUtil.defaultString(params.getMenuCode()));
		return String.join("&", result);
	}

	public List<Map<String, Object>> getFileList(String refType, int refSeq) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("ref_type", refType.toUpperCase());
		params.put("ref_seq", refSeq);
		return filesService.getFileList(params);
	}

	public List<String> getTimeHourList() {
		return getTimeList(23);
	}

	public List<String> getTimeHourList(int start, int end) {
		return getTimeList(start, end);
	}

	public List<String> getTimeMinList() {
		return getTimeList(59);
	}

	public List<String> getTimeMinList(int interval) {
		return getTimeList(0, 59, interval, true);
	}

	public List<String> getTimeList(int end) {
		return getTimeList(0, end, 0, true);
	}

	public List<String> getTimeList(int start, int end) {
		return getTimeList(start, end, 0, true);
	}

	public List<String> getTimeList(int start, int end, int interval, boolean addEmpty) {
		List<String> list = new ArrayList<String>();

		if (addEmpty) {
			list.add("");
		}
		for (int i = start; i < end + 1; i++) {
			if (interval > 0) {
				if (i % interval == 0) {
					list.add(StringUtil.leftPad("" + i, 2, "0"));
				}
			} else {
				list.add(StringUtil.leftPad("" + i, 2, "0"));
			}
		}
		return list;
	}
}
