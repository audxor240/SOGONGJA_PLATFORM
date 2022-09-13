package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.EducationMapper;

@Service
public class EducationService extends BaseService {

	@Autowired
	private EducationMapper educationMapper;

	public List<Map<String, Object>> getEducationList(Map<String, Object> params) {
		return educationMapper.getEducationList(params);
	}

	public List<Map<String, Object>> getEducationList(Map<String, Object> params, Paging paging) {
		return educationMapper.getEducationList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return educationMapper.selectTotalRecords();
	}

	public Map<String, Object> getEducation(int eduSeq) {
		Map<String, Object> education = educationMapper.getEducation(eduSeq);
		educationMapper.updateEducationReadCnt(eduSeq);
		return education;
	}

}
