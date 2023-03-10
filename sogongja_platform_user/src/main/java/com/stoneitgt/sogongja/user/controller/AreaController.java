package com.stoneitgt.sogongja.user.controller;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.DataBuffer;
import java.awt.image.DataBufferByte;
import java.io.*;
import java.net.URL;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.user.component.AuthenticationFacade;
import com.stoneitgt.sogongja.user.domain.MapParameter;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommunityService;
import com.stoneitgt.sogongja.user.service.ReplyService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.user.service.AreaService;
import com.stoneitgt.util.StoneUtil;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;

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
		System.out.println(paramsMap);
//		List<Map<String, Object>> tradingAreaListToJSON = areaService.getTradingAreaListToJSON(paramsMap);
//		System.out.println("==========================================================");
//		for (Map<String, Object> t : tradingAreaListToJSON) {
//			System.out.println(t);
//		}
//		System.out.println("==========================================================");
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//List<Map<String, Object>> shopCommunityList = communityService.getShopCommunityList("shop");

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		//model.addAttribute("shopCommunityList", shopCommunityList);
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
		String scope = Arrays.stream(codeType1).collect(Collectors.joining("', '", "'", "'"));
		paramsMap.put("scope", scope);

		List<Map<String, Object>> results = new ArrayList<>();
		if (params.getZoom() > 0 && params.getZoom() < 4) {
			// ?????????
			results = areaService.getResearchShopToJSON(paramsMap);
		} else {
			results = areaService.countResearchShopToJSON(paramsMap);
			//?????????
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

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		paramsMap.put("zoom", 5);
		paramsMap.put("scope", "'A'");
		System.out.println("paramsMap >>>>>>>>>>>>:::: "+paramsMap);
		model.addAttribute("areaJson", areaService.getTradingAreaToJson(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("isAuthenticated", authenticationFacade.isAuthenticated());
		long afterTime = System.currentTimeMillis(); // ?????? ?????? ?????? ?????? ????????????
		long secDiffTime = (afterTime - beforeTime)/1000; //??? ????????? ??? ??????
		System.out.println("????????????(m) : "+secDiffTime);
		return "pages/area/trading_area_analysis";
	}

	@GetMapping("/test")
	public String mapTest(@ModelAttribute MapParameter params, Model model) throws IOException {

		return "pages/area/trading_area_test";
	}

	@GetMapping(
			value = "/get-image-with-media-type",
			produces = MediaType.IMAGE_JPEG_VALUE
	)
	public @ResponseBody
	void getImageWithMediaType(HttpServletResponse response) throws IOException {
		System.out.println("zzz");
		URL url = new URL("https://www.shutterstock.com/image-vector/vector-illustration-sample-red-grunge-260nw-2065712915.jpg");
		BufferedImage image3 = ImageIO.read(url);
		ByteArrayOutputStream outStreamObj = new ByteArrayOutputStream();
		ImageIO.write(image3, "jpg", outStreamObj);
		response.setHeader("Content-Type", "image/png");
		response.getOutputStream().write(outStreamObj.toByteArray());
//		return Base64.getEncoder().encodeToString(outStreamObj.toByteArray());
	}

	// ?????? ?????? ????????? ?????? polygon ????????? api
	@PostMapping("/analysis/area")
	public @ResponseBody List<Map<String, Object>> analysisAreaList(@RequestBody MapParameter params, Model model) {
		long beforeTime = System.currentTimeMillis();

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		List<Map<String, Object>> results = new ArrayList<>();
		System.out.println(paramsMap.toString());
		results = areaService.getTradingAreaToJson(paramsMap);

		long afterTime = System.currentTimeMillis(); // ?????? ?????? ?????? ?????? ????????????
		long secDiffTime = (afterTime - beforeTime)/1000; //??? ????????? ??? ??????
		System.out.println("????????????(m) : "+secDiffTime);
		return results;
	}


	@PostMapping("/analysis/shop")
	public @ResponseBody List<Map<String, Object>> analysisShopList(@RequestBody MapParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		String[] codeType1 = params.getCodeType1();
		String scope = Arrays.stream(codeType1).collect(Collectors.joining("', '", "'", "'"));
		paramsMap.put("scope", scope);

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
		//List<Map<String, Object>> regionCommunityList = communityService.getShopCommunityList("region");

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("areaJson", areaService.getRegionAreaListToJSON(paramsMap));
		//model.addAttribute("regionCommunityList",regionCommunityList);
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

		String returnUrl = "";
		if(params.get("type").equals("shop")){
			returnUrl = "pages/area/trading_area_shop :: .reply_list";
		}else{
			returnUrl = "pages/area/trading_area_regional :: .reply_list";
		}
		List<Map<String, Object>> replyList = replyService.getCommunityReplyList(params);
		model.addAttribute("replyList", replyList);

		return returnUrl;
	}

	@PostMapping("/reply/add")
	public String addReply(Model model,@RequestBody Map<String, Object> params) throws IOException {

		String returnUrl = "";
		if(params.get("type").equals("shop")){
			returnUrl = "pages/area/trading_area_shop :: .reply_list";
		}else{
			returnUrl = "pages/area/trading_area_regional :: .reply_list";
		}
		params.put("loginUserSeq",authenticationFacade.getLoginUserSeq());
		replyService.addReply(params);
		List<Map<String, Object>> replyList = replyService.getCommunityReplyList(params);
		model.addAttribute("replyList", replyList);

		return returnUrl;
	}

	@PostMapping("/map/communityList")
	public String getMapCommunityList(Model model,@ModelAttribute BaseParameter params, @RequestBody Map<String, Object> data){

		String type = (String) data.get("type");

		//?????? ?????? ????????? ???????????? ??????
		List<Map<String, Object>> mapCommunityList = communityService.getShopCommunityList(data);

		model.addAttribute("mapCommunityList", mapCommunityList);

		String returnUrl = "";
		if(type.equals("shop")){
			returnUrl = "pages/area/trading_area_shop :: .community_pop_list";
		}else{
			returnUrl = "pages/area/trading_area_regional :: .community_pop_list";
		}

		return returnUrl;
	}
}
