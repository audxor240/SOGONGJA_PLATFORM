package com.stoneitgt.sogongja.user.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.domain.MapParameter;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommunityService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.user.service.AreaService;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/trading-area")
public class AreaController extends BaseController {

	@Autowired
	private AreaService areaService;

	@Autowired
	private BoardService boardService;

	@Autowired
	private CommunityService communityService;

	@GetMapping("/shop")
	public String shopArea(@ModelAttribute BaseParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//		List<Map<String, Object>> tradingAreaListToJSON = areaService.getTradingAreaListToJSON(paramsMap);
//		System.out.println("==========================================================");
//		for (Map<String, Object> t : tradingAreaListToJSON) {
//			System.out.println(t);
//		}
//		System.out.println("==========================================================");
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		List<Map<String, Object>> shopCommunityList = communityService.getShopCommunityList("shop");

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("shopCommunityList", shopCommunityList);
//		model.addAttribute("areaJson", areaService.getTradingAreaListToJSON(paramsMap));
		paramsMap.put("zoom", 6);
		paramsMap.put("scope", "'Q','N','L','F','D','O','P','R'");
		paramsMap.put("x1", 37.47629323368353);
		paramsMap.put("x2", 37.5362047082041);
		paramsMap.put("y1", 126.95351224208618);
		paramsMap.put("y2", 127.12726465022845);
		model.addAttribute("researchShop", areaService.countResearchShopToJSON(paramsMap));
//		model.addAttribute("researchShop", areaService.getResearchShopToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_shop";
	}

	@PostMapping("/shop/details")
	public @ResponseBody List<Map<String, Object>> shopAreaCountOrList(@RequestBody MapParameter params, Model model) {

		if (params.getZoom() > 8) params.setZoom(14);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		String[] codeType1 = params.getCodeType1();
		String scope = "";
		for (int i = 0; i < codeType1.length; i++) {
			scope += "'" + codeType1[i] + "',";
		}
		scope = StringUtils.removeEnd(scope, ",");
		if (scope.length() == 0) {
			paramsMap.put("scope", "''");
		} else {
			paramsMap.put("scope", scope);

		}
		List<Map<String, Object>> results = new ArrayList<>();
		if (params.getZoom() > 0 && params.getZoom() < 4) {
			// 리스트
			results = areaService.getResearchShopToJSON(paramsMap);
		} else {
			results = areaService.countResearchShopToJSON(paramsMap);
			//카운트
		}

		return results;
	}

	@PostMapping("/shop/pubTrans")
	public @ResponseBody Map<String, Object> shopPublicTransportInfo(@RequestBody Map<String, Object> params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		return areaService.getResearchShopPublicTransport(paramsMap);
	}

	@GetMapping("/analysis")
	public String analysis(@ModelAttribute MapParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		paramsMap.put("zoom", 6);
		paramsMap.put("scope", "'A','D','R','U'");
		paramsMap.put("x1", 37.47629323368353);
		paramsMap.put("x2", 37.5362047082041);
		paramsMap.put("y1", 126.95351224208618);
		paramsMap.put("y2", 127.12726465022845);
//		model.addAttribute("areaJson", areaService.getTradingAreaListToJSON(paramsMap));
		model.addAttribute("areaJson", areaService.getTradingAreaPartListToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_analysis";
	}

	@PostMapping("/analysis/area")
	public @ResponseBody List<Map<String, Object>> analysisList(@RequestBody MapParameter params, Model model) {

		// 줌에 따라 뒤에 데이터 내릴지 안내릴지

		List<Map<String, Object>> results = new ArrayList<>();
		return results;
	}

	@PostMapping("/analysis/details")
	public @ResponseBody List<Map<String, Object>> analysisDetail(@RequestBody MapParameter params, Model model) {
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		return areaService.getResearchAreaComList(paramsMap);
	}

	@GetMapping("/regional")
	public String regionalArea(@ModelAttribute BaseParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//		List<Map<String, Object>> tradingAreaListToJSON = areaService.getTradingAreaListToJSON(paramsMap);
//		System.out.println("==========================================================");
//		for (Map<String, Object> t : tradingAreaListToJSON) {
//			System.out.println(t);
//		}
//		System.out.println("==========================================================");
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("areaJson", areaService.getRegionAreaListToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_regional";
	}

	@GetMapping("/info")
	public String info(Model model) {
		return "pages/area/trading_area_info";
	}
}
