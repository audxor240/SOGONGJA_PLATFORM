package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Education;

@Mapper
public interface EducationMapper {

	List<Map<String, Object>> getEducationList(Map<String, Object> params);

	List<Map<String, Object>> getEducationList(Map<String, Object> params, RowBounds rowBounds);

	Education getEducation(int eduSeq);

	int insertEducation(Education education);

	int updateEducation(Education education);

	int deleteEducation(Map<String, Object> params);

	int selectTotalRecords();
}
