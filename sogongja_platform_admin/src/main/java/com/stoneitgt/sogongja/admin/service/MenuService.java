package com.stoneitgt.sogongja.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.MenuMapper;
import com.stoneitgt.util.StringUtil;

@Service
public class MenuService {

	@Autowired
	private MenuMapper menuMapper;

	public List<Map<String, Object>> getMenuList(Map<String, Object> params) {
		return menuMapper.getMenuList(params);
	}

	public List<Map<String, Object>> getMenuList(Map<String, Object> params, Paging paging) {
		return menuMapper.getMenuList(params, paging.getPaging());
	}

	public Map<String, Object> getBreadcrumb(String menuCode) {
		return menuMapper.getBreadcrumb(menuCode);
	}

	public List<Map<String, Object>> getUserMenuList(String auth) {
		return menuMapper.getUserMenuList(auth);
	}

	public List<Map<String, Object>> getParentMenuList(Map<String, Object> params) {
		return menuMapper.getParentMenuList(params);
	}

	public Map<String, Object> getMenu(String menuCode) {
		return menuMapper.getMenu(menuCode);
	}

	public List<Map<String, Object>> getAuthMenuList(String auth) {
		return menuMapper.getAuthMenuList(auth);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveAuthMenu(Map<String, Object> params) {
		int result = menuMapper.deleteAuthMenu(params);

		String auth = StringUtil.getString(params.get("auth"));
		int loginUserSeq = StringUtil.getIntValue(params.get("login_user_seq"));
		@SuppressWarnings("unchecked")
		List<String> values = (List<String>) params.get("values");

		for (String value : values) {
			Map<String, Object> menu = new HashMap<String, Object>();
			menu.put("auth", auth);
			menu.put("login_user_seq", loginUserSeq);
			menu.put("menu_code", value);
			result += menuMapper.saveAuthMenu(menu);
		}

		List<String> parentList = menuMapper.getAuthMenuParent(auth);

		for (String parent : parentList) {
			Map<String, Object> menu = new HashMap<String, Object>();
			menu.put("auth", auth);
			menu.put("login_user_seq", loginUserSeq);
			menu.put("menu_code", parent);
			result += menuMapper.saveAuthMenu(menu);
		}

		return result;
	}

	public int saveMenu(Map<String, Object> params) {
		return menuMapper.saveMenu(params);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteMenu(Map<String, Object> params) {
		int result = menuMapper.deleteMenu(params);
		if ("TOP".equals(StringUtil.getString(params.get("parent_menu_code")))) {
			result += menuMapper.deleteMenuParent(params);
		}
		return result;
	}

}
