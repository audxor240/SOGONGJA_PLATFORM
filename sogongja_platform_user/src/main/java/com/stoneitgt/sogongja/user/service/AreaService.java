package com.stoneitgt.sogongja.user.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
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
		if (zoom > 5) {
			System.out.println(params.toString());
			return areaMapper.getTradingAreaCountList(params);
		}

		List<Map<String, Object>> mapPathList = areaMapper.getTradingAreaMapList("PATH");
		List<Map<String, Object>> mapHoleList = areaMapper.getTradingAreaMapList("HOLE");

		List<Map<String, Object>> areaRecentlyList = new ArrayList<>();


		areaRecentlyList = areaMapper.getTradingAreaAllList();


		List<String> temp = new ArrayList();
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

	// 상권연구  테스트
	public List<Map<String, Object>> getTest(Map<String, Object> params) {

		int zoom = Integer.parseInt(params.get("zoom").toString());
		if (zoom > 5) {
			System.out.println(params.toString());
			return areaMapper.getTradingAreaCountList(params);
		}

		List<Map<String, Object>> list = areaMapper.getTradingAreaMapPartList(params);


		System.out.println("list size :" + list.size() );
		List<Map<String, Object>> mapPathList = areaMapper.getTradingAreaMapList("PATH");
		List<Map<String, Object>> mapHoleList = areaMapper.getTradingAreaMapList("HOLE");

		List<Map<String, Object>> areaRecentlyList = new ArrayList<>();


		List<String> temp = new ArrayList();
		for (Map<String, Object> map : list) {
			int areaSeq = StringUtil.getIntValue(map.get("area_seq"));
			List<Map<String, Object>> path = (List<Map<String, Object>>) mapPathList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());
			List<Map<String, Object>> hole = (List<Map<String, Object>>) mapHoleList.stream()
					.filter(m -> StringUtil.getIntValue(m.get("area_seq")) == areaSeq).collect(Collectors.toList());

			String areaCd = map.get("area_cd").toString();
			temp.add(areaCd);

			map.put("path", path);
			map.put("hole", hole);
		}

		String scope = new String();
		for (String tem : temp) {
			scope +=  tem + ",";
		}
		scope = StringUtils.removeEnd(scope, ",");
		areaRecentlyList = areaMapper.getTest(scope);

		for (Map<String, Object> map : list) {
			String areaCd = map.get("area_cd").toString();
			List<Map<String, Object>> info = (List<Map<String, Object>>) areaRecentlyList.stream()
					.filter(m -> m.get("area_cd").toString().equals(areaCd)).collect(Collectors.toList());

			map.put("info", info);
		}

		return list;
	}



	// 상권연구
	public List<Map<String, Object>> getTradingAreaShopList(Map<String, Object> params) {

		List<Map<String, Object>> list = areaMapper.getTradingAreaShopList(params);

		return list;
	}

	public Map<String, Object> getResearchAreaComList(Map<String, Object> params) {
		String areaCd = params.get("area_cd").toString();
		calculateRadius(params);
		Map<String, Object> tradingAreaDetails = areaMapper.getTradingAreaDetails(params);
		tradingAreaDetails.put("graph", areaMapper.getTradingAreaStaIdx(areaCd));


		return tradingAreaDetails;
//		Map<String, Object> recentMonth = areaMapper.getRecentMonth(areaCd);
//		int year = Integer.parseInt(recentMonth.get("year").toString());
//		int qrt = Integer.parseInt(recentMonth.get("qrt").toString());
//		params.put("year", year);
//		params.put("qrt", qrt);
////		return areaMapper.getResearchAreaComList(params);
//		List<Map<String, Object>> list = areaMapper.getResearchAreaComList(params);
//		List<Map<String, Object>> details = areaMapper.getResearchAreaComDetail(params);
//
//		for (Map<String, Object> map : list) {
//			String typeCd = map.get("type1_cd").toString();
//			List<Map<String, Object>> detail = (List<Map<String, Object>>) details.stream()
//					.filter(m -> m.get("type1_cd").equals(typeCd)).collect(Collectors.toList());
//			map.put("details", detail);
//
//		}
//		return list;
	}

	public void calculateRadius(Map<String, Object> params) {
		double max = 0;
		List<Map<String, Object>> mapList = areaMapper.getTradingAreaMapSingle(params);
		double lat1 = Double.parseDouble(params.get("lat").toString());
		double lng1 = Double.parseDouble(params.get("lng").toString());
		for (Map<String, Object> map : mapList) {
			double lat2 = Double.parseDouble(map.get("latitude").toString());
			double lng2 = Double.parseDouble(map.get("longitude").toString());

			double dLat = Math.toRadians(lat2 - lat1);
			double dLon = Math.toRadians(lng2 - lng1);

			double a = Math.sin(dLat/2)* Math.sin(dLat/2)+ Math.cos(Math.toRadians(lat1))* Math.cos(Math.toRadians(lat2))* Math.sin(dLon/2)* Math.sin(dLon/2);
			double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			double d =6371* c * 1000;    // Distance in m
			System.out.println(d + "m");
			if (d > max) {
				max = d;
			}

		}
		params.put("meter", ((int) max + 200));
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
