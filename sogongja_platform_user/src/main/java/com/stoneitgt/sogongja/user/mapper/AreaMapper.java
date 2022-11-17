package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AreaMapper {

	List<Map<String, Object>> getTradingAreaList(Map<String, Object> params);

	List<Map<String, Object>> getTradingAreaMapList(String mapType);
	List<Map<String, Object>> getResearchAreaList();

	List<Map<String, Object>> getRegionAreaList(Map<String, Object> params);

	List<Map<String, Object>> getRegionAreaMapList(String mapType);

	List<Map<String, Object>> getResearchShopList(Map<String, Object> params);

	List<Map<String, Object>> countResearchShop(Map<String, Object> params);
	Map<String, Object> getResearchShopPublicTransport(Map<String, Object> params);

	List<Map<String, Object>> getTradingAreaMapPartList(Map<String, Object> params);
	Map<String, Object> getRecentMonth(String areaCd);
	List<Map<String, Object>> getResearchAreaComList(Map<String, Object> params);
	List<Map<String, Object>> getResearchAreaComDetail(Map<String, Object> params);


}
