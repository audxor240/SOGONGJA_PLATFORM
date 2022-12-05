package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.service.*;
import com.stoneitgt.util.ScriptUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.GlobalConstant.PAGE_SIZE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.domain.ConsultingParameter;
import com.stoneitgt.sogongja.user.domain.CounselingParameter;
import com.stoneitgt.sogongja.user.domain.EducationParameter;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/study")
public class StudyController extends BaseController {

	@Autowired
	private EducationService educationService;

	@Autowired
	private ConsultingService consultingService;

	@Autowired
	private CounselingService counselingService;

	@Autowired
	private EducationBookmarkService educationBookmarkService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private SupportService supportService;

	@Autowired
	private BoardService boardService;

	@GetMapping("/education")
	public String education(@ModelAttribute EducationParameter params, Model model, Authentication authentication) {
		User user = new User();
		try {
			user = (User) authentication.getPrincipal();
			params.setLoginUserSeq(user.getUserSeq());
		} catch(NullPointerException e){

		}

		Paging paging = getUserPaging(params.getPage(), PAGE_SIZE.USER_EDUCATION);

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);

		Integer total = educationService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (StringUtil.isBlank(params.getCategory1())) {
			params.setCategory1("");
		}

		if (StringUtil.isBlank(params.getCategory2())) {
			params.setCategory2("");
		}

		if (StringUtil.isBlank(params.getCategory3())) {
			params.setCategory3("");
		}

		if (StringUtil.isBlank(params.getSupportOrg())) {
			params.setSupportOrg("");
		}

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		List<Map<String, Object>> category2List = null;
		List<Map<String, Object>> category3List = null;

		Map<String, Object> param2 = new HashMap<String, Object>();
		param2.put("category1Seq",params.getCategory1());
		category2List = categoryService.getCategory2(param2);

		Map<String, Object> param3 = new HashMap<String, Object>();
		param2.put("category2Seq",params.getCategory2());
		category3List = categoryService.getCategory3(param3);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("category1", category1List);
		model.addAttribute("category2", category2List);
		model.addAttribute("category3", category3List);
		model.addAttribute("supportOrg", supportList);
		model.addAttribute("boardSettingList", boardSettingList);


		return "pages/study/education";
	}

	@GetMapping("/consulting")
	public String consulting(@ModelAttribute ConsultingParameter params, Model model, Authentication authentication) {

		User user = new User();
		try {
			user = (User) authentication.getPrincipal();
			params.setLoginUserSeq(user.getUserSeq());

		} catch(NullPointerException e){

		}

		Paging paging = getUserPaging(params.getPage(), params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		System.out.println("paramsMap :: "+paramsMap);
		List<Map<String, Object>> list = consultingService.getConsultingList(paramsMap, paging);
		Integer total = consultingService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		List<Map<String, Object>> category2List = null;
		List<Map<String, Object>> category3List = null;

		Map<String, Object> param2 = new HashMap<String, Object>();
		param2.put("category1Seq",params.getCategory1());
		category2List = categoryService.getCategory2(param2);

		Map<String, Object> param3 = new HashMap<String, Object>();
		param2.put("category2Seq",params.getCategory2());
		category3List = categoryService.getCategory3(param3);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("category1", category1List);
		model.addAttribute("category2", category2List);
		model.addAttribute("category3", category3List);
		model.addAttribute("supportOrg", supportList);

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/study/consulting";
	}

	@GetMapping("/consulting/{conSeq}")
	public String consultingView(@PathVariable int conSeq, @RequestParam int num,@ModelAttribute BaseParameter params, Model model, Authentication authentication, HttpServletResponse response) throws IOException {

		User user = new User();
		try {
			user = (User) authentication.getPrincipal();
			params.setLoginUserSeq(user.getUserSeq());

		} catch(NullPointerException e){
			//ScriptUtils.alert(response, "로그인이 필요합니다");
			//ScriptUtils.alertAndMovePage(response, "로그인이 필요합니다","/login");
			//return "/";
		}
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("data", consultingService.getConsulting(conSeq, user.getUserSeq()));
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("num", num);
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.CONSULTING, conSeq));

		model.addAttribute("boardSettingList", boardSettingList);
		return "pages/study/consulting_view";
	}

	@GetMapping("/counseling")
	public String counseling(@ModelAttribute CounselingParameter params, Model model) {

		Paging paging = getUserPaging(params.getPage(), params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = counselingService.getCounselingList(paramsMap, paging);
		Integer total = counselingService.selectTotalRecords();
		paging.setTotal(total);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		List<Map<String, Object>> supportList = supportService.getSupportList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));

		model.addAttribute("couType", getCodeList("COU_TYPE", "전체"));
		model.addAttribute("couClass", getCodeRefList("COU_CLASS", params.getCouType(), "전체"));
		model.addAttribute("supportOrg", supportList);

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/study/counseling";
	}

	@GetMapping("/counseling/{couSeq}")
	public String counselingView(@PathVariable int couSeq, @ModelAttribute BaseParameter params, Model model) {

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		Map<String, Object> data = counselingService.getCounseling(couSeq);

		String nlString = System.getProperty("line.separator").toString();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("data", data);
		model.addAttribute("nlString", nlString);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.COUNSELING, couSeq));

		model.addAttribute("boardSettingList", boardSettingList);
		return "pages/study/counseling_view";
	}
}
