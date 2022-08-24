package com.stoneitgt.sogongja.user.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.sogongja.user.mapper.CodeMapper;

@Service
public class CodeService {

	@Autowired
	private CodeMapper codeMapper;

	public List<Map<String, Object>> getCodeList(String groupCode) {
		return codeMapper.getCodeList(groupCode);
	}

	public List<Map<String, Object>> getCodeClassList(String groupCode) {
		return codeMapper.getCodeClassList(groupCode);
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

}
