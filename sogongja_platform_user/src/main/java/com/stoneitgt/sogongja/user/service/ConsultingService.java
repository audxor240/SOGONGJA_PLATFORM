package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.ConsultingWatching;
import com.stoneitgt.sogongja.domain.ConsultingWatching;
import com.stoneitgt.sogongja.user.mapper.ConsultingWatchingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.ConsultingMapper;

@Service
public class ConsultingService extends BaseService {

	@Autowired
	private ConsultingMapper consultingMapper;

	@Autowired
	private ConsultingWatchingMapper consultingWatchingMapper;

	public List<Map<String, Object>> getConsultingList(Map<String, Object> params) {
		return consultingMapper.getConsultingList(params);
	}

	public List<Map<String, Object>> getConsultingList(Map<String, Object> params, Paging paging) {
		return consultingMapper.getConsultingList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return consultingMapper.selectTotalRecords();
	}

	public Map<String, Object> getConsulting(int conSeq, int userSeq) {
		Map<String, Object> consulting = consultingMapper.getConsulting(conSeq);
		consultingMapper.updateConsultingReadCnt(conSeq);

		ConsultingWatching consultingWatching = consultingWatchingMapper.getConsultingWatching(conSeq,userSeq);

		if(consultingWatching == null){
			consultingWatchingMapper.addConsultingWatching(conSeq,userSeq);
		}
		return consulting;
	}

}
