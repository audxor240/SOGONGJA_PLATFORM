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
import com.stoneitgt.sogongja.admin.mapper.ConsultingMapper;
import com.stoneitgt.sogongja.domain.Consulting;

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

	public Integer selectTotalRecords() {
		return consultingMapper.selectTotalRecords();
	}

	public Consulting getConsulting(int conSeq) {
		return consultingMapper.getConsulting(conSeq);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveConsulting(Consulting consulting) throws IOException {
		int result = 0;

		if (consulting.getConSeq() == 0) {
			result = consultingMapper.insertConsulting(consulting);
		} else {
			result = consultingMapper.updateConsulting(consulting);
		}

		if (consulting.getAttachFiles() != null && consulting.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : consulting.getAttachFiles()) {
				filesService.saveFiles(attachFile, FILE_REF_TYPE.CONSULTING, consulting.getConSeq(),
						consulting.getLoginUserSeq());
			}
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteConsulting(Map<String, Object> params) {
		int result = consultingMapper.deleteConsulting(params);
		//params.put("ref_type", FILE_REF_TYPE.CONSULTING.toUpperCase());
		//params.put("ref_seq", params.get("con_seq"));
		//filesService.deleteFileAll(params);
		return result;
	}

}
