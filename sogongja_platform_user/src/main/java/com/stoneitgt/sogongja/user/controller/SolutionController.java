package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.domain.CounselingParameter;
import com.stoneitgt.sogongja.user.service.*;
import com.stoneitgt.util.ScriptUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.PAGE_SIZE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.domain.EducationParameter;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/solution")
public class SolutionController extends BaseController {

	@Autowired
	private EducationService ecucationService;

	@Autowired
	private ConsultingService consultingService;

	@Autowired
	private EducationBookmarkService educationBookmarkService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private BoardService boardService;

	@Autowired
	private UserService userService;

	@GetMapping("/education")
	public String education(@ModelAttribute EducationParameter params, Model model, Authentication authentication, HttpServletResponse response) throws IOException {

		User user = new User();
		try {
			user = (User) authentication.getPrincipal();
			params.setLoginUserSeq(user.getUserSeq());

		} catch(NullPointerException e){
			//ScriptUtils.alert(response, "로그인이 필요합니다");
			ScriptUtils.alertAndMovePage(response, "로그인이 필요합니다","/login");
		}

		Paging paging = getUserPaging(params.getPage(), PAGE_SIZE.USER_EDUCATION_SOLUTION);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		paramsMap.put("order", "read_cnt");

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		List<Map<String, Object>> eduList = new ArrayList<>();
		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
			eduList = ecucationService.getEducationRecommendList(paramsMap, paging);    //다른 사용자가 자주 찾는 교육
		}

		Integer total = ecucationService.selectTotalRecords();
		paging.setTotal(total);

		List<Map<String, Object>> recommendList = new ArrayList<>();

		if (authenticationFacade.isAuthenticated()) {
			// 로그인했을 경우에는 관심사항을 가져온다
			String category = authenticationFacade.getLoginUser().getCategory();

			//if (StringUtil.isNotBlank(category)) {
			if (StringUtil.isNotBlank(category2Group) || StringUtil.isNotBlank(category3Group)) {
				paramsMap.put("order", "rand");
				// ArrayList 타입으로만 foreach 가능

				recommendList = ecucationService.getEducationRecommendList(paramsMap);	//추천 교육
				// 최대 12개만 보여준다.
				if (recommendList != null && recommendList.size() > 12) {
					recommendList = recommendList.subList(0, 12);
				}
			}
		}

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		/*if (recommendList == null || recommendList.size() == 0) {
			paramsMap.put("order", "");
			paramsMap.put("recommend", "Y");
			recommendList = ecucationService.getEducationList(paramsMap);
		}*/

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("list", eduList);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(eduList, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("recommendList", recommendList);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/solution/education";
	}

	@GetMapping("/consulting")
	public String consulting(@ModelAttribute CounselingParameter params, Model model, Authentication authentication, HttpServletResponse response) throws IOException {

		User user = new User();
		try {
			user = (User) authentication.getPrincipal();
			params.setLoginUserSeq(user.getUserSeq());
		} catch(NullPointerException e){
			//ScriptUtils.alert(response, "로그인이 필요합니다");
			ScriptUtils.alertAndMovePage(response, "로그인이 필요합니다","/login");
		}

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		Paging paging = getUserPaging(params.getPage(), params.getSize());
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("read_cnt", "N");
		List<Map<String, Object>> conList = new ArrayList<>();
		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
			paramsMap.put("order", "read_cnt");
			conList = consultingService.getConsultingRecommendList(paramsMap, paging);    //다른 사용자가 자주 찾는 컨설팅
		}

		//List<Map<String, Object>> conList = consultingService.getConsultingList(paramsMap, paging);
		Integer total = consultingService.selectTotalRecords();
		paging.setTotal(total);





		paramsMap.put("read_cnt", "Y");
		paramsMap.put("recommend", "Y");
		List<Map<String, Object>> recommendList = new ArrayList<>();

		if (authenticationFacade.isAuthenticated()) {
			// 로그인했을 경우에는 관심사항을 가져온다
			String category = authenticationFacade.getLoginUser().getCategory();

			//if (StringUtil.isNotBlank(category)) {
			if (StringUtil.isNotBlank(category2Group) || StringUtil.isNotBlank(category3Group)) {
				paramsMap.put("order", "rand");
				// ArrayList 타입으로만 foreach 가능

				recommendList = consultingService.getConsultingRecommendList(paramsMap, paging);	//추천 컨설팅
				// 최대 12개만 보여준다.
				if (recommendList != null && recommendList.size() > 12) {
					recommendList = recommendList.subList(0, 12);
				}
			}
		}

		//List<Map<String, Object>> recommendList = consultingService.getConsultingRecommendList(paramsMap, paging);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("list", conList);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(conList, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("recommendList", recommendList);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/solution/consulting";
	}

	@GetMapping("/question")
	public String question(Model model) {
		return "pages/solution/question";
	}

	@PostMapping("/recommend_con")
	public String getRecommendConsulting(Model model,@ModelAttribute CounselingParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		if(data.get("conWatchingView1").equals("Y")){
			params.setConWatchingView1(true);
		}
		/*if(data.get("conWatchingView1") == true){
			params.setConWatchingView1((Boolean) data.get("conWatchingView1"));
		}*/


		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("login_user_seq",authenticationFacade.getLoginUserSeq());
		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.DEFAULT_SIZE);

		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
		}
		//관심 컨설팅 정보 조회
		//list = userService.getRecommendConsultingList(paramsMap, paging);
		list = consultingService.getConsultingRecommendList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageType", "recommend_con");

		return "pages/solution/consulting :: .solution_edu";
	}

	@PostMapping("/recommend_edu")
	public String getRecommendEducation(Model model,@ModelAttribute EducationParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		if(data.get("eduWatchingView1").equals("Y")){
			params.setEduWatchingView1(true);
		}
		//params.setConWatchingView2((Boolean) data.get("conWatchingView2"));

		Paging paging = getUserPaging((Integer) data.get("page"), PAGE_SIZE.USER_EDUCATION_SOLUTION);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("login_user_seq",authenticationFacade.getLoginUserSeq());

		List<Map<String, Object>> recommendList = new ArrayList<>();
		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}

			recommendList = ecucationService.getEducationRecommendList(paramsMap);	//추천 교육
			// 최대 12개만 보여준다.
			if (recommendList != null && recommendList.size() > 12) {
				recommendList = recommendList.subList(0, 12);
			}
		}

		Integer total = ecucationService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("recommendList", recommendList);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageType", "recommend_edu");

		return "pages/solution/education :: .solution_edu";
	}

	@PostMapping("/frequently_recommend_edu")
	public String getFrequentlyRecommendEducation(Model model,@ModelAttribute EducationParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		if(data.get("eduWatchingView2").equals("Y")){
			params.setEduWatchingView2(true);
		}
		//params.setConWatchingView2((Boolean) data.get("conWatchingView2"));

		Paging paging = getUserPaging((Integer) data.get("page"), PAGE_SIZE.USER_EDUCATION_SOLUTION);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("login_user_seq",authenticationFacade.getLoginUserSeq());
		paramsMap.put("order", "read_cnt");

		List<Map<String, Object>> eduList = new ArrayList<>();
		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
			eduList = ecucationService.getEducationRecommendList(paramsMap, paging);    //다른 사용자가 자주 찾는 교육

		}

		Integer total = ecucationService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("eduList", eduList);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageType", "frequently_recommend_edu");

		return "pages/solution/education :: .edu_list_wrap";
	}

	@PostMapping("/frequently_recommend_con")
	public String getFrequentlyRecommendConsulting(Model model,@ModelAttribute CounselingParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		if(data.get("conWatchingView2").equals("Y")){
			params.setConWatchingView2(true);
		}
		//params.setConWatchingView2((Boolean) data.get("conWatchingView2"));

		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.DEFAULT_SIZE);

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("login_user_seq",authenticationFacade.getLoginUserSeq());
		paramsMap.put("read_cnt", "N");
		List<Map<String, Object>> conList = new ArrayList<>();
		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
			paramsMap.put("order", "read_cnt");

			conList = consultingService.getConsultingRecommendList(paramsMap, paging);    //다른 사용자가 자주 찾는 컨설팅
		}

		//List<Map<String, Object>> conList = consultingService.getConsultingList(paramsMap, paging);
		Integer total = consultingService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("conList", conList);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageType", "frequently_recommend_con");

		return "pages/solution/consulting :: .edu_list_wrap";
	}
}
