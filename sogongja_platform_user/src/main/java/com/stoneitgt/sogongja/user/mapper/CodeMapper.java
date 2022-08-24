package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CodeMapper {

	List<Map<String, Object>> getCodeList(String groupCode);

	List<Map<String, Object>> getCodeClassList(String groupCode);

	List<Map<String, Object>> getCodeRefList(Map<String, Object> params);

}
