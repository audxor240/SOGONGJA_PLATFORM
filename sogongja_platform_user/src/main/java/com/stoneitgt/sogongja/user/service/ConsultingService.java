package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.ConsultingMapper;

@Service
public class ConsultingService extends BaseService {

	@Autowired
	private ConsultingMapper consultingMapper;

	public List<Map<String, Object>> getConsultingList(Map<String, Object> params) {
		return consultingMapper.getConsultingList(params);
	}

	public List<Map<String, Object>> getConsultingList(Map<String, Object> params, Paging paging) {
		return consultingMapper.getConsultingList(params, paging.getPaging());
	}

	public Map<String, Object> getConsulting(int conSeq) {
		Map<String, Object> consulting = consultingMapper.getConsulting(conSeq);
		consultingMapper.updateConsultingReadCnt(conSeq);
		return consulting;
	}

}
