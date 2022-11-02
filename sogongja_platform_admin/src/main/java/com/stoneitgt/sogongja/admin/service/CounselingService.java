package com.stoneitgt.sogongja.admin.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.CounselingMapper;
import com.stoneitgt.sogongja.domain.Counseling;

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

	public Counseling getCounseling(int couSeq) {
		return consultingMapper.getCounseling(couSeq);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveCounseling(Counseling consulting) throws IOException {
		int result = 0;

		if (consulting.getCouSeq() == 0) {
			result = consultingMapper.insertCounseling(consulting);
		} else {
			result = consultingMapper.updateCounseling(consulting);
		}

		if (consulting.getAttachFiles() != null && consulting.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : consulting.getAttachFiles()) {
				filesService.saveFiles(attachFile, FILE_REF_TYPE.COUNSELING, consulting.getCouSeq(),
						consulting.getLoginUserSeq());
			}
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteCounseling(Map<String, Object> params) {
		int result = consultingMapper.deleteCounseling(params);
		//params.put("ref_type", FILE_REF_TYPE.COUNSELING.toUpperCase());
		//params.put("ref_seq", params.get("con_seq"));
		//filesService.deleteFileAll(params);
		return result;
	}

}
