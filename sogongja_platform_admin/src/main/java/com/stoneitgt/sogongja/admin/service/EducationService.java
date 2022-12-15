package com.stoneitgt.sogongja.admin.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.Faq;
import com.stoneitgt.sogongja.domain.Files;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.EducationMapper;
import com.stoneitgt.sogongja.domain.Education;

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

	public Education getEducation(int eduSeq) {
		return educationMapper.getEducation(eduSeq);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveEducation(Education education) throws IOException {
		int result = 0;

		if (education.getEduSeq() == 0) {
			result = educationMapper.insertEducation(education);
		} else {
			result = educationMapper.updateEducation(education);
		}

		if (education.getImageFile() != null && education.getImageFile().getSize() > 0) {

			Map<String, Object> params = new HashMap<String, Object>();
			params.put("ref_type", FILE_REF_TYPE.EDUCATION_IMAGE);
			params.put("ref_seq", education.getEduSeq());
			params.put("login_user_seq", education.getLoginUserSeq());

			// 이미 등록된 썸네일 파일을 삭제
			filesService.deleteFile(params);

			// 이미지 등록 후 썸네일 이미지 생성
			filesService.saveFiles(education.getImageFile(), FILE_REF_TYPE.EDUCATION_IMAGE, education.getEduSeq(),
					education.getLoginUserSeq(), true);
		}

		if (education.getAttachFiles() != null && education.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : education.getAttachFiles()) {
				filesService.saveFiles(attachFile, FILE_REF_TYPE.EDUCATION, education.getEduSeq(),
						education.getLoginUserSeq());
			}
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteEducation(Map<String, Object> params) {
		int result = educationMapper.deleteEducation(params);
		params.put("ref_type", FILE_REF_TYPE.EDUCATION_IMAGE.toUpperCase());
		params.put("ref_seq", params.get("edu_seq"));
		//filesService.deleteFile(params);
		filesService.deleteFileByTypeAndSeq(params);
		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public void insertEducationExcel(List<Education> education) throws IOException {
		educationMapper.insertEducationExcel(education);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public void insertEducationExcelFile(List<Files> files) throws IOException {
		System.out.println("CHECK--insertEducationExcelFile");
		educationMapper.insertEducationExcelFile(files);
	}


	public Education getLastEducationInfo() {
		return educationMapper.getLastEducationInfo();
	}

}
