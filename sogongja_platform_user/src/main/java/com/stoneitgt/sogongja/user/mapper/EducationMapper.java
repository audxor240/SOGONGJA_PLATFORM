package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

@Mapper
public interface EducationMapper {

	List<Map<String, Object>> getEducationList(Map<String, Object> params);

	List<Map<String, Object>> getEducationList(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getEducation(int eduSeq);

	int updateEducationReadCnt(int eduSeq);
}
