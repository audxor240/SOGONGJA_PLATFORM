package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stoneitgt.sogongja.user.mapper.AreaMapper;
import com.stoneitgt.util.StringUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AreaService extends BaseService {

	@Autowired
	private AreaMapper areaMapper;

	public List<Map<String, Object>> getTradingAreaList(Map<String, Object> params) {
		return areaMapper.getTradingAreaList(params);
	}

	public List<Map<String, Object>> getTradingAreaListToJSON(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.getTradingAreaList(params);
		List<Map<String, Object>> mapPathList = areaMapper.getTradingAreaMapList("PATH");
		List<Map<String, Object>> mapHoleList = areaMapper.getTradingAreaMapList("HOLE");

		for (Map<String, Object> map : list) {
			int areaSeq = StringUtil.getIntValue(map.get("area_seq"));
			List<Map<String, Object>> path = (List<Map<String, Object>>) mapPathList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
			List<Map<String, Object>> hole = (List<Map<String, Object>>) mapHoleList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());

			map.put("path", path);
			map.put("hole", hole);
		}

		return list;
	}

	public List<Map<String, Object>> getTradingAreaMapList(String mapType) {
		return areaMapper.getTradingAreaMapList(mapType);
	}

}
