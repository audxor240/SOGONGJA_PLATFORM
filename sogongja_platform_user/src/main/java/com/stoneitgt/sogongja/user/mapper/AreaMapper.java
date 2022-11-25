package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AreaMapper {

	List<Map<String, Object>> getTradingAreaList(Map<String, Object> params);

	// 지역연구
	List<Map<String, Object>> getRegionAreaList(Map<String, Object> params);
	// 지역연구
	List<Map<String, Object>> getRegionAreaMapList(String mapType);
	// 지역연구
	List<Map<String, Object>> getRegionAreaInfoList(Map<String, Object> params);
	// 지역연구
	List<Map<String, Object>> getRegionAreaDetail(Map<String, Object> params);


	// 상점연구
	List<Map<String, Object>> getResearchShopList(Map<String, Object> params);
	// 상점연구
	List<Map<String, Object>> countResearchShop(Map<String, Object> params);
	// 상점연구
	Map<String, Object> getResearchShopPublicTransport(Map<String, Object> params);

	// 상권연구
	List<Map<String, Object>> getTradingAreaMapPartList(Map<String, Object> params);
	// 상권연구
	List<Map<String, Object>> getTradingAreaMapList(String mapType);
	// 상권연구
//	List<Map<String, Object>> getTradingAreaList();
	// 상권연구
	List<Map<String, Object>> getTradingAreaGroupByList();
	// 상권연구
	List<Map<String, Object>> getTradingAreaAllList();
	// 상권연구
	List<Map<String, Object>> getTest(String scope);
	// 상권연구
	List<Map<String, Object>> getTradingAreaCountList(Map<String, Object> params);
	//상권연구
	List<Map<String, Object>> getTradingAreaShopList(Map<String, Object> params);


//	Map<String, Object> getRecentMonth(String areaCd);
//	List<Map<String, Object>> getResearchAreaComList(Map<String, Object> params);
//	List<Map<String, Object>> getResearchAreaComDetail(Map<String, Object> params);
	Map<String, Object> getTradingAreaDetails(Map<String, Object> params);
	List<Map<String, Object>> getTradingAreaStaIdx(String areaCd);
	List<Map<String, Object>> getTradingAreaMapSingle(Map<String, Object> params);



}
