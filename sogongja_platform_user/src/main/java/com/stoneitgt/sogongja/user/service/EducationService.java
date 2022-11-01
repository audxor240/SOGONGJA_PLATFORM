package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.EducationWatching;
import com.stoneitgt.sogongja.user.mapper.EducationWatchingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.EducationMapper;

@Service
public class EducationService extends BaseService {

	@Autowired
	private EducationMapper educationMapper;

	@Autowired
	private EducationWatchingMapper educationWatchingMapper;

	public List<Map<String, Object>> getEducationList(Map<String, Object> params) {
		return educationMapper.getEducationList(params);
	}

	public List<Map<String, Object>> getEducationList(Map<String, Object> params, Paging paging) {
		return educationMapper.getEducationList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getEducationRecommendList(Map<String, Object> params) {
		return educationMapper.getEducationRecommendList(params);
	}

	public List<Map<String, Object>> getEducationRecommendList(Map<String, Object> params, Paging paging) {
		return educationMapper.getEducationRecommendList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return educationMapper.selectTotalRecords();
	}

	public Map<String, Object> getEducation(int eduSeq, int userSeq) {
		Map<String, Object> education = educationMapper.getEducation(eduSeq);
		educationMapper.updateEducationReadCnt(eduSeq);

		EducationWatching educationWatching = educationWatchingMapper.getEducationWatching(eduSeq,userSeq);

		if(educationWatching == null){
			educationWatchingMapper.addEducationWatching(eduSeq,userSeq);
		}

		return education;
	}


}
