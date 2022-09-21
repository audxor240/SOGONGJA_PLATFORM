package com.stoneitgt.sogongja.user.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.EducationBookmark;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.service.EducationBookmarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.stoneitgt.common.GlobalConstant.PAGE_SIZE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.user.domain.EducationParameter;
import com.stoneitgt.sogongja.user.service.ConsultingService;
import com.stoneitgt.sogongja.user.service.EducationService;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

@Controller
@RequestMapping("/solution")
public class SolutionController extends BaseController {

	@Autowired
	private EducationService ecucationService;

	@Autowired
	private ConsultingService consultingService;

	@Autowired
	private EducationBookmarkService educationBookmarkService;

	@GetMapping("/education")
	public String education(@ModelAttribute EducationParameter params, Model model, Authentication authentication) {

		User user = new User();
		try {
			user = (User) authentication.getPrincipal();

		} catch(NullPointerException e){

		}

		Paging paging = getUserPaging(params.getPage(), PAGE_SIZE.USER_EDUCATION_SOLUTION);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("order", "read_cnt");
		List<Map<String, Object>> eduList = ecucationService.getEducationList(paramsMap, paging);
		Integer total = ecucationService.selectTotalRecords();
		paging.setTotal(total);

		for (Map<String, Object> entry : eduList) {

			EducationBookmark educationBookmark = educationBookmarkService.getEducationBookmark((Integer) entry.get("edu_seq"), user.getUserSeq());

			if(educationBookmark != null){	//관심교육 추가되어있음
				entry.put("favorite",true);
			}else{
				entry.put("favorite",false);
			}
		}

		List<Map<String, Object>> recommendList = null;

		if (authenticationFacade.isAuthenticated()) {
			// 로그인했을 경우에는 관심사항을 가져온다
			String category = authenticationFacade.getLoginUser().getCategory();

			if (StringUtil.isNotBlank(category)) {
				paramsMap.put("order", "rand");
				// ArrayList 타입으로만 foreach 가능
				paramsMap.put("category", Arrays.asList(category.split(",")));
				recommendList = ecucationService.getEducationList(paramsMap);

				// 최대 12개만 보여준다.
				if (recommendList != null && recommendList.size() > 12) {
					recommendList = recommendList.subList(0, 12);
				}
			}
		}

		if (recommendList == null || recommendList.size() == 0) {
			paramsMap.put("order", "");
			paramsMap.put("recommend", "Y");
			recommendList = ecucationService.getEducationList(paramsMap);
		}

		model.addAttribute("list", eduList);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(eduList, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("recommendList", recommendList);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/solution/education";
	}

	@GetMapping("/consulting")
	public String consulting(@ModelAttribute BaseParameter params, Model model) {

		Paging paging = getUserPaging(params.getPage(), params.getSize());
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("read_cnt", "Y");
		List<Map<String, Object>> conList = consultingService.getConsultingList(paramsMap, paging);
		Integer total = consultingService.selectTotalRecords();
		paging.setTotal(total);

		paramsMap.put("read_cnt", "N");
		paramsMap.put("recommend", "Y");
		List<Map<String, Object>> recommendList = ecucationService.getEducationList(paramsMap);

		model.addAttribute("list", conList);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(conList, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("recommendList", recommendList);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/solution/consulting";
	}

	@GetMapping("/question")
	public String question(Model model) {
		return "pages/solution/question";
	}
}
