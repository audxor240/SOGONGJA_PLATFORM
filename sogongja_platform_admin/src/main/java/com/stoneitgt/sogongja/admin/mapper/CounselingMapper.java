package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Counseling;

@Mapper
public interface CounselingMapper {

	List<Map<String, Object>> getCounselingList(Map<String, Object> params);

	List<Map<String, Object>> getCounselingList(Map<String, Object> params, RowBounds rowBounds);

	Counseling getCounseling(int couSeq);

	int insertCounseling(Counseling counseling);

	int updateCounseling(Counseling counseling);

	int deleteCounseling(Map<String, Object> params);

	int selectTotalRecords();
}
