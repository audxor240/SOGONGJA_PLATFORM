package com.stoneitgt.sogongja.user.service;

import java.util.ArrayList;
import java.util.HashMap;
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

//	public List<Map<String, Object>> getTradingAreaListToJSON(Map<String, Object> params) {
//
//		List<Map<String, Object>> list = areaMapper.getTradingAreaList(params);
//		List<Map<String, Object>> mapPathList = areaMapper.getTradingAreaMapList("PATH");
//		List<Map<String, Object>> mapHoleList = areaMapper.getTradingAreaMapList("HOLE");
//
//		for (Map<String, Object> map : list) {
//			int areaSeq = StringUtil.getIntValue(map.get("area_seq"));
//			List<Map<String, Object>> path = (List<Map<String, Object>>) mapPathList.stream()
//					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
//			List<Map<String, Object>> hole = (List<Map<String, Object>>) mapHoleList.stream()
//					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
//
//			map.put("path", path);
//			map.put("hole", hole);
//		}
//
//		return list;
//	}

	// 상점연구
	public List<Map<String, Object>> getResearchShopToJSON(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.getResearchShopList(params);


		return list;
	}

	// 상점연구
	public List<Map<String, Object>> countResearchShopToJSON(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.countResearchShop(params);


		return list;
	}

	// 상점연구 - 대중교통
	public Map<String, Object> getResearchShopPublicTransport(Map<String, Object> params) {

		return areaMapper.getResearchShopPublicTransport(params);

	}

	// 상권연구
	public List<Map<String, Object>> getTradingAreaListToJSON(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.getTradingAreaMapPartList(params);
		int zoom = Integer.parseInt(params.get("zoom").toString());
		System.out.println("list size :" + list.size() );
		List<Map<String, Object>> mapPathList = areaMapper.getTradingAreaMapList("PATH");
		List<Map<String, Object>> mapHoleList = areaMapper.getTradingAreaMapList("HOLE");

		List<Map<String, Object>> areaRecentlyList = new ArrayList<>();

		if (zoom > 5) {
//			areaRecentlyList = areaMapper.getTradingAreaGroupByList();
		} else {
			areaRecentlyList = areaMapper.getTradingAreaAllList();
		}


		for (Map<String, Object> map : list) {
			int areaSeq = StringUtil.getIntValue(map.get("area_seq"));
			List<Map<String, Object>> path = (List<Map<String, Object>>) mapPathList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
			List<Map<String, Object>> hole = (List<Map<String, Object>>) mapHoleList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());

			int areaCd = Integer.parseInt(map.get("area_cd").toString());
			List<Map<String, Object>> info = (List<Map<String, Object>>) areaRecentlyList.stream()
					.filter(m -> Integer.parseInt(m.get("area_cd").toString()) == areaCd).collect(Collectors.toList());

			map.put("path", path);
			map.put("hole", hole);
			map.put("info", info);
		}

		return list;
	}

	// 상권연구
	public List<Map<String, Object>> getTradingAreaShopList(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.getTradingAreaShopList(params);

		return list;
	}

	public List<Map<String, Object>> getResearchAreaComList(Map<String, Object> params) {
		String areaCd = params.get("area_cd").toString();
		Map<String, Object> recentMonth = areaMapper.getRecentMonth(areaCd);
		int year = Integer.parseInt(recentMonth.get("year").toString());
		int qrt = Integer.parseInt(recentMonth.get("qrt").toString());
		params.put("year", year);
		params.put("qrt", qrt);
//		return areaMapper.getResearchAreaComList(params);
		List<Map<String, Object>> list = areaMapper.getResearchAreaComList(params);
		List<Map<String, Object>> details = areaMapper.getResearchAreaComDetail(params);

		for (Map<String, Object> map : list) {
			String typeCd = map.get("type1_cd").toString();
			List<Map<String, Object>> detail = (List<Map<String, Object>>) details.stream()
					.filter(m -> m.get("type1_cd").equals(typeCd)).collect(Collectors.toList());
			map.put("details", detail);

		}
		return list;
	}

	public List<Map<String, Object>> getRegionAreaListToJSON(Map<String, Object> params) {
		System.out.println(params.toString());

		List<Map<String, Object>> list = areaMapper.getRegionAreaList(params);
		List<Map<String, Object>> mapPathList = areaMapper.getRegionAreaMapList("PATH");
		List<Map<String, Object>> mapHoleList = areaMapper.getRegionAreaMapList("HOLE");
		List<Map<String, Object>> regionList = areaMapper.getRegionAreaInfoList(params);


		for (Map<String, Object> map : list) {
			int areaSeq = StringUtil.getIntValue(map.get("area_seq"));
			List<Map<String, Object>> path = (List<Map<String, Object>>) mapPathList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
			List<Map<String, Object>> hole = (List<Map<String, Object>>) mapHoleList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());

			String emdCd = map.get("emd_cd").toString();

			List<Map<String, Object>> info = (List<Map<String, Object>>) regionList.stream()
					.filter(m -> m.get("emd_cd").equals(emdCd)).collect(Collectors.toList());

			map.put("path", path);
			map.put("hole", hole);
			map.put("info", info);
		}

		return list;
	}

	public List<Map<String, Object>> getRegionAreaDetailListToJSON(Map<String, Object> params) {

		return areaMapper.getRegionAreaDetail(params);
	}

	public List<Map<String, Object>> getTradingAreaMapList(String mapType) {
		return areaMapper.getTradingAreaMapList(mapType);
	}

}
