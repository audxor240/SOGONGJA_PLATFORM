package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

@Mapper
public interface ConsultingMapper {

	List<Map<String, Object>> getConsultingList(Map<String, Object> params);

	List<Map<String, Object>> getConsultingList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getConsultingRecommendList(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getConsulting(int conSeq);

	int updateConsultingReadCnt(int conSeq);

	int selectTotalRecords();

}
