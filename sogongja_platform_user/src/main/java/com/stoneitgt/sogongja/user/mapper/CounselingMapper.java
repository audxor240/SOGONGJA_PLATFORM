package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

@Mapper
public interface CounselingMapper {

	List<Map<String, Object>> getCounselingList(Map<String, Object> params);

	List<Map<String, Object>> getCounselingList(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getCounseling(int couSeq);

	int updateCounselingReadCnt(int couSeq);

	int selectTotalRecords();

}
