package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

@Mapper
public interface CodeMapper {

	List<Map<String, Object>> getCodeMasterList(Map<String, Object> params);

	List<Map<String, Object>> getCodeMasterList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getCodeDetailList(Map<String, Object> params);

	List<Map<String, Object>> getCodeDetailList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getCodeList(String groupCode);

	List<Map<String, Object>> getCodeRefList(Map<String, Object> params);

	Map<String, Object> getCodeMaster(Map<String, Object> params);

	Map<String, Object> getCodeDetail(Map<String, Object> params);

	int saveCodeMaster(Map<String, Object> params);

	int deleteCodeMaster(Map<String, Object> params);

	int deleteCodeMasterDetail(Map<String, Object> params);

	int saveCodeDetail(Map<String, Object> params);

	int deleteCodeDetail(Map<String, Object> params);
}
