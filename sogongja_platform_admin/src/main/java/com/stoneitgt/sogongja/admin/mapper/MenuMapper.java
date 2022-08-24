package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

@Mapper
public interface MenuMapper {

	List<Map<String, Object>> getUserMenuList(String auth);

	Map<String, Object> getBreadcrumb(String menuCode);

	List<Map<String, Object>> getMenuList(Map<String, Object> params);

	List<Map<String, Object>> getMenuList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getAuthMenuList(String auth);

	int deleteAuthMenu(Map<String, Object> params);

	int saveAuthMenu(Map<String, Object> params);

	List<String> getAuthMenuParent(String auth);

	List<Map<String, Object>> getParentMenuList(Map<String, Object> params);

	int saveMenu(Map<String, Object> params);

	int deleteMenu(Map<String, Object> params);

	int deleteMenuParent(Map<String, Object> params);

	Map<String, Object> getMenu(String menuCode);
}
