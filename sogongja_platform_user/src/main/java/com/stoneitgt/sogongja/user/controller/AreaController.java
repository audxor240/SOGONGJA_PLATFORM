package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.*;

import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.sogongja.user.component.AuthenticationFacade;
import com.stoneitgt.sogongja.user.domain.MapParameter;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommunityService;
import com.stoneitgt.sogongja.user.service.ReplyService;
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

	@Autowired
	private ReplyService replyService;
	@Autowired
	private AuthenticationFacade authenticationFacade;


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
		paramsMap.put("zoom", 3);
		paramsMap.put("scope", "'Q','N','L','F','D','O','P','R'");
		paramsMap.put("x1", 37.50658952070604);
		paramsMap.put("x2", 37.512142525036836);
		paramsMap.put("y1", 127.03342091976654);
		paramsMap.put("y2", 127.05079677392048);
		model.addAttribute("researchShop", areaService.getResearchShopToJSON(paramsMap));
//		model.addAttribute("researchShop", areaService.getResearchShopToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_shop";
	}

	@PostMapping("/shop/details")
	public @ResponseBody List<Map<String, Object>> shopAreaCountOrList(@RequestBody MapParameter params, Model model) {
		System.out.println("params-------"+params);
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
		Map<String, Object> result = areaService.getResearchShopPublicTransport(paramsMap);
		return result == null ?  new HashMap<String, Object>() : result;
	}

	@GetMapping("/analysis")
	public String analysis(@ModelAttribute MapParameter params, Model model) {

		long beforeTime = System.currentTimeMillis();
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		paramsMap.put("zoom", 5);
		paramsMap.put("scope", "'A'");
		paramsMap.put("x1", 37.49345754382203);
		paramsMap.put("x2", 37.51567561625099);
		paramsMap.put("y1", 126.99710515824563);
		paramsMap.put("y2", 127.0666010904294);
		model.addAttribute("areaJson", areaService.getTradingAreaToJson(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("isAuthenticated", authenticationFacade.isAuthenticated());
		long afterTime = System.currentTimeMillis(); // 코드 실행 후에 시간 받아오기
		long secDiffTime = (afterTime - beforeTime)/1000; //두 시간에 차 계산
		System.out.println("시간차이(m) : "+secDiffTime);
		return "pages/area/trading_area_analysis";
	}

//	@GetMapping("/analysis/test")
//	public String analysisTest(@ModelAttribute MapParameter params, Model model) {
//		long beforeTime = System.currentTimeMillis();
//		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//
//		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
//
//		//QNA게시판 시퀀스 정보
//		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
//		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
//		model.addAttribute("boardSettingList", boardSettingList);
//		paramsMap.put("zoom", 5);
//		paramsMap.put("scope", "'A'");
//		paramsMap.put("x1", 37.49345754382203);
//		paramsMap.put("x2", 37.51567561625099);
//		paramsMap.put("y1", 126.99710515824563);
//		paramsMap.put("y2", 127.0666010904294);
//		model.addAttribute("areaJson", areaService.getTest(paramsMap));
//		model.addAttribute("params", params);
//		model.addAttribute("pageParams", getBaseParameterString(params));
//		long afterTime = System.currentTimeMillis(); // 코드 실행 후에 시간 받아오기
//		long secDiffTime = (afterTime - beforeTime)/1000; //두 시간에 차 계산
//		System.out.println("시간차이(m) : "+secDiffTime);
//		return "pages/area/trading_area_test";
//	}


	// 중심 좌표 이동에 따른 polygon 데이터 api
	@PostMapping("/analysis/area")
	public @ResponseBody List<Map<String, Object>> analysisAreaList(@RequestBody MapParameter params, Model model) {
		long beforeTime = System.currentTimeMillis();

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		List<Map<String, Object>> results = new ArrayList<>();
		System.out.println(paramsMap.toString());
		results = areaService.getTradingAreaToJson(paramsMap);

		long afterTime = System.currentTimeMillis(); // 코드 실행 후에 시간 받아오기
		long secDiffTime = (afterTime - beforeTime)/1000; //두 시간에 차 계산
		System.out.println("시간차이(m) : "+secDiffTime);
		return results;
	}


	@PostMapping("/analysis/shop")
	public @ResponseBody List<Map<String, Object>> analysisShopList(@RequestBody MapParameter params, Model model) {

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
		System.out.println(paramsMap.toString());
		results = areaService.getTradingAreaShopList(paramsMap);
		return results;
	}

	@PostMapping("/analysis/details")
	public @ResponseBody Map<String, Object> analysisDetail(@RequestBody MapParameter params, Model model) {
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		return areaService.getResearchAreaComList(paramsMap);

	}

	@GetMapping("/regional")
	public String regionalArea(@ModelAttribute MapParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		List<Map<String, Object>> regionCommunityList = communityService.getShopCommunityList("region");

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("areaJson", areaService.getRegionAreaListToJSON(paramsMap));
		model.addAttribute("regionCommunityList",regionCommunityList);
		model.addAttribute("regionStandard", areaService.getRegionAreaStandardToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_regional";
	}

	@PostMapping("/regional/type")
	public @ResponseBody List<Map<String, Object>> regionsType(@RequestBody MapParameter params, Model model) {
		System.out.println(params.toString());
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		return areaService.getRegionAreaListToJSON(paramsMap);
	}

	@PostMapping("/regional/details")
	public @ResponseBody List<Map<String, Object>> regionsDetail(@RequestBody MapParameter params, Model model) {
		System.out.println(params.toString());
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		return areaService.getRegionAreaDetailListToJSON(paramsMap);
	}

	@GetMapping("/info")
	public String info(Model model) {
		return "pages/area/trading_area_info";
	}

	@PostMapping("/reply")
	public String getReplyList(Model model,@RequestBody Map<String, Object> params) throws IOException {


		List<Map<String, Object>> replyList = replyService.getCommunityReplyList(params);
		model.addAttribute("replyList", replyList);

		return "pages/area/trading_area_shop :: .reply_list";
	}

	@PostMapping("/reply/add")
	public String addReply(Model model,@RequestBody Map<String, Object> params) throws IOException {

		params.put("loginUserSeq",authenticationFacade.getLoginUserSeq());
		replyService.addReply(params);
		List<Map<String, Object>> replyList = replyService.getCommunityReplyList(params);
		model.addAttribute("replyList", replyList);

		return "pages/area/trading_area_shop :: .reply_list";
	}
}
