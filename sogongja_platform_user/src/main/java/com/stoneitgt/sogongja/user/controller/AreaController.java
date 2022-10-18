package com.stoneitgt.sogongja.user.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.user.service.AreaService;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/trading-area")
public class AreaController extends BaseController {

	@Autowired
	private AreaService areaService;

	@GetMapping("/shop")
	public String shopArea(@ModelAttribute BaseParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//		List<Map<String, Object>> tradingAreaListToJSON = areaService.getTradingAreaListToJSON(paramsMap);
//		System.out.println("==========================================================");
//		for (Map<String, Object> t : tradingAreaListToJSON) {
//			System.out.println(t);
//		}
//		System.out.println("==========================================================");
		model.addAttribute("areaJson", areaService.getTradingAreaListToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_shop";
	}

	@GetMapping("/analysis")
	public String analysis(@ModelAttribute BaseParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//		List<Map<String, Object>> tradingAreaListToJSON = areaService.getTradingAreaListToJSON(paramsMap);
//		System.out.println("==========================================================");
//		for (Map<String, Object> t : tradingAreaListToJSON) {
//			System.out.println(t);
//		}
//		System.out.println("==========================================================");
		model.addAttribute("areaJson", areaService.getTradingAreaListToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_analysis";
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
		model.addAttribute("areaJson", areaService.getTradingAreaListToJSON(paramsMap));
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/area/trading_area_regional";
	}

	@GetMapping("/info")
	public String info(Model model) {
		return "pages/area/trading_area_info";
	}
}
