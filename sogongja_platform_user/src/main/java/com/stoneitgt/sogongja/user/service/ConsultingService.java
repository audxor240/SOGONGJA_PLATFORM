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

	public List<Map<String, Object>> getConsultingRecommendList(Map<String, Object> params, Paging paging) {
		return consultingMapper.getConsultingRecommendList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return consultingMapper.selectTotalRecords();
	}

	public Map<String, Object> getConsulting(int conSeq, int userSeq) {
		Map<String, Object> consulting = consultingMapper.getConsulting(conSeq);
		consultingMapper.updateConsultingReadCnt(conSeq);

		//컨설팅 상세보기 페이지 이동시 수강완료 처리 안함
		// 상세보기에서 URL페이지 이동시 수강완료처리하기 위해 주석처리
		/*if(userSeq != 0) {
			ConsultingWatching consultingWatching = consultingWatchingMapper.getConsultingWatching(conSeq, userSeq);

			if (consultingWatching == null) {
				consultingWatchingMapper.addConsultingWatching(conSeq, userSeq);
			}
		}*/
		return consulting;
	}


}
