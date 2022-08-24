package com.stoneitgt.sogongja.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.CodeMapper;

@Service
public class CodeService {

	@Autowired
	private CodeMapper codeMapper;

	public List<Map<String, Object>> getCodeMasterList(Map<String, Object> params) {
		return codeMapper.getCodeMasterList(params);
	}

	public List<Map<String, Object>> getCodeMasterList(Map<String, Object> params, Paging paging) {
		return codeMapper.getCodeMasterList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getCodeDetailList(Map<String, Object> params) {
		return codeMapper.getCodeDetailList(params);
	}

	public List<Map<String, Object>> getCodeDetailList(Map<String, Object> params, Paging paging) {
		return codeMapper.getCodeDetailList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getCodeList(String groupCode) {
		return codeMapper.getCodeList(groupCode);
	}

	public List<Map<String, Object>> getCodeRefList(String groupCode, String refCode) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("groupCode", groupCode);
		params.put("refCode", refCode);
		return codeMapper.getCodeRefList(params);
	}

	public List<Map<String, Object>> getCodeRefList(Map<String, Object> params) {
		return codeMapper.getCodeRefList(params);
	}

	public Map<String, Object> getCodeMaster(Map<String, Object> params) {
		return codeMapper.getCodeMaster(params);
	}

	public Map<String, Object> getCodeDetail(Map<String, Object> params) {
		return codeMapper.getCodeDetail(params);
	}

	public int saveCodeMaster(Map<String, Object> params) {
		return codeMapper.saveCodeMaster(params);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteCodeMaster(Map<String, Object> params) {
		int result = codeMapper.deleteCodeMaster(params);
		result += codeMapper.deleteCodeMasterDetail(params);
		return result;
	}

	public int saveCodeDetail(Map<String, Object> params) {
		return codeMapper.saveCodeDetail(params);
	}

	public int deleteCodeDetail(Map<String, Object> params) {
		return codeMapper.deleteCodeDetail(params);
	}
}
