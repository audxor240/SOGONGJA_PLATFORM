package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.CounselingMapper;

@Service
public class CounselingService extends BaseService {

	@Autowired
	private CounselingMapper consultingMapper;

	public List<Map<String, Object>> getCounselingList(Map<String, Object> params) {
		return consultingMapper.getCounselingList(params);
	}

	public List<Map<String, Object>> getCounselingList(Map<String, Object> params, Paging paging) {
		return consultingMapper.getCounselingList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return consultingMapper.selectTotalRecords();
	}

	public Map<String, Object> getCounseling(int couSeq) {
		Map<String, Object> counseling = consultingMapper.getCounseling(couSeq);
		consultingMapper.updateCounselingReadCnt(couSeq);
		return counseling;
	}

}
