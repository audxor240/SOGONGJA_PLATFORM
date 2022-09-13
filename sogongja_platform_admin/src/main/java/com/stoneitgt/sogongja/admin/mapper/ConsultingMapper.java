package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Consulting;

@Mapper
public interface ConsultingMapper {

	List<Map<String, Object>> getConsultingList(Map<String, Object> params);

	List<Map<String, Object>> getConsultingList(Map<String, Object> params, RowBounds rowBounds);

	Consulting getConsulting(int conSeq);

	int insertConsulting(Consulting consulting);

	int updateConsulting(Consulting consulting);

	int deleteConsulting(Map<String, Object> params);

	int selectTotalRecords();
}
