package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.net.URI;
import java.util.*;

import javax.validation.Valid;

import com.fasterxml.jackson.core.JsonProcessingException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.stoneitgt.sogongja.admin.properties.AppProperties;
import com.stoneitgt.sogongja.domain.*;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.json.JSONArray;
//import org.springframework.boot.configurationprocessor.json.JSONException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.GlobalConstant.BOARD_TYPE;
import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.BoardParameter;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/board")
public class BoardController extends BaseController {

	@Autowired
	private BoardService boardService;

	@Autowired
	private AppProperties appProperties;

	@GetMapping("/type/{boardType}")
	public String boardList(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("board_type", boardType);

		String url = "";
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		//List<Map<String, Object>> list = new ArrayList<Map<String, Object>>;

		if(BOARD_TYPE.SETTING.equals(boardType)) {
			list = boardService.getBoardSettingList(paramsMap, paging);
			breadcrumb.put("parent_menu_name", "게시판 관리");
			breadcrumb.put("menu_name", "게시판 관리");
			url = "pages/board/board_setting_list";
		}else{
			paramsMap.put("board_setting_seq", boardType);
			list = boardService.getBoardList2(paramsMap, paging);

			switch (boardType) {
				case "notice": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "공지사항 관리"); break;
				case "news":  breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "보도자료"); break;
				case "faq":  breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "FAQ 관리"); break;
				case "community":  breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "커뮤니티 관리"); break;
			}

			if (BOARD_TYPE.FAQ.equals(boardType)) {
				model.addAttribute("category", getCodeList("FAQ_TYPE"));
				url = "pages/board/board_list_faq";
			} else {
				url = "pages/board/community_list";
			}
		}
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("boardType", boardType);

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return url;
	}


	@GetMapping("/settingList")
	public String boardSettingList(@ModelAttribute BaseParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		list = boardService.getBoardSettingList(paramsMap, paging);
		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", "게시판 관리");

		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/board/board_setting_list";
	}
	@GetMapping("/{boardSettingSeq}")
	public String boardList2(@PathVariable String boardSettingSeq, @ModelAttribute BaseParameter params, Model model) {
		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("boardSettingSeq",boardSettingSeq);
		//paramsMap.put("board_type", boardType);

		BoardSetting boardSetting = boardService.getBoardSetting(Integer.parseInt(boardSettingSeq));
		String url = "";
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		//List<Map<String, Object>> list = new ArrayList<Map<String, Object>>;

		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", boardSetting.getName()+" 관리");


		list = boardService.getBoardList(paramsMap, paging);


		url = "pages/board/board_list";

		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("boardSettingSeq", boardSettingSeq);
		model.addAttribute("boardSetting", boardSetting);

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return url;
	}

	@GetMapping("/{boardSettingSeq}/{boardSeq}")
	public String boardView(@PathVariable String boardSettingSeq, @PathVariable int boardSeq,
			@ModelAttribute BaseParameter params, Model model) {

		String url = "";

		model.addAttribute("menuCode", params.getMenuCode());
		model.addAttribute("boardSettingSeq", boardSettingSeq);

		BoardSetting boardSetting = boardService.getBoardSetting(Integer.parseInt(boardSettingSeq));


		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", boardSetting.getName()+" 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		Board board = boardService.getBoard(boardSeq);
		Answer answer = boardService.getAnswerInfo(boardSeq);

		if(answer != null){
			board.setAnswerSeq(answer.getAnswerSeq());
			board.setComment(answer.getComment());
		}
		model.addAttribute("board", board);
		model.addAttribute("fileList", getFileList(boardSetting.getFileDirectoryName(), boardSeq));
		model.addAttribute("boardSetting", boardSetting);

		//답변 사용인 게시판이면
		if(boardSetting.getAnswerUse() == 1){
			url = "pages/board/board_form_02";
		}else{
			url = "pages/board/board_form";
		}
		return url;
	}

	@GetMapping("/setting/detail/{boardSettingSeq}")
	public String boardSettingView(@PathVariable int boardSettingSeq,
							@ModelAttribute BaseParameter params, Model model) {

		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", "게시판관리");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		BoardSetting boardSetting = boardService.getBoardSetting(boardSettingSeq);
		model.addAttribute("boardSetting", boardSetting);
		System.out.println("boardSetting >>>>>>>> "+model.getAttribute("boardSetting"));
		return "pages/board/board_setting_form";

	}

	@GetMapping("/{boardSettingSeq}/form")
	public String boardForm(@PathVariable int boardSettingSeq, @ModelAttribute BaseParameter params, Model model) {

		Board board = new Board();
		board.setBoardSettingSeq(boardSettingSeq);
		model.addAttribute("board", board);

		model.addAttribute("menuCode", params.getMenuCode());

		BoardSetting boardSetting = boardService.getBoardSetting(boardSettingSeq);
		System.out.println("boardSetting :: "+boardSetting);
		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", boardSetting.getName()+" 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("boardSetting", boardSetting);

		return "pages/board/board_form";
	}

	@GetMapping("/type/{boardType}/form")
	public String boardForm2(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {
		System.out.println("boardType ::: "+boardType);
		Board board = new Board();
		board.setBoardType(boardType);

		model.addAttribute("board", board);
		model.addAttribute("menuCode", params.getMenuCode());
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", "커뮤니티 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
			return "pages/board/board_form_faq";
		} else {
			return "pages/board/community_form";
		}
	}

	@GetMapping("/setting/form")
	public String boardSettingForm(@ModelAttribute BaseParameter params, Model model) {

		BoardSetting boardSetting = new BoardSetting();
		model.addAttribute("boardSetting", boardSetting);


		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "게시판 관리");
		breadcrumb.put("menu_name", "게시판 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/board/board_setting_form";
	}

	@PostMapping("/form")
	public String saveBoard(@RequestParam(required = false) String menuCode,
			@ModelAttribute("board") @Valid Board board, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", board.getPageParams());

			if (BOARD_TYPE.FAQ.equals(board.getBoardType())) {
				model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
				return "pages/board/board_form_faq";
			} else {
				model.addAttribute("fileList", getFileList(FILE_REF_TYPE.BOARD, board.getBoardSeq()));
				return "pages/board/board_form";
			}
		}

		String returnUrl = "";
		if(BOARD_TYPE.COMMUNITY.equals(board.getBoardType())){
			returnUrl = "redirect:/board/type/" + board.getBoardType() + "?";
		}else{
			returnUrl = "redirect:/board/" + board.getBoardSettingSeq() + "?";
		}


		if (board.getBoardSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += board.getPageParams();
		}
		board.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		BoardSetting boardSetting = boardService.getBoardSetting(board.getBoardSettingSeq());
		boardService.saveBoard(board, boardSetting);

		return returnUrl;
	}

	@PostMapping("/settingForm")
	public String saveBoardSetting(@RequestParam(required = false) String menuCode,
							@ModelAttribute("boardSetting") @Valid BoardSetting boardSetting, BindingResult bindingResult, Model model,
							RedirectAttributes rttr) throws IOException {
		System.out.println("boardSetting >>> "+boardSetting);
		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", boardSetting.getPageParams());

			return "pages/board/board_setting_form";
		}

		String returnUrl = "redirect:/board/settingList?";

		if (boardSetting.getBoardSettingSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += boardSetting.getPageParams();
		}
		boardSetting.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		boardService.saveBoardSetting(boardSetting);

		return returnUrl;
	}

	@PostMapping("/delete")
	public String deleteBoard(@RequestParam String boardSettingSeq, @RequestParam int boardSeq,
			@RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("board_seq", boardSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoard(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:"+appProperties.getHost()+"/board/" + boardSettingSeq + "?menuCode=" + menuCode;
	}

	@PostMapping("/settingDelete")
	public String deleteBoardSetting(@RequestParam int boardSettingSeq,
							  @RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws SftpException , JSchException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("board_setting_seq", boardSettingSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoardSetting(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:"+appProperties.getHost()+"/board/settingList";
	}

	@GetMapping("/project")
	public String boardProjectList(@ModelAttribute BoardParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		System.out.println("params >> "+params);
		System.out.println("paramsMap >> "+paramsMap);
		List<Map<String, Object>> list = boardService.getBoardProjectList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);

		model.addAttribute("list", list);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "지원 및 정책관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
		model.addAttribute("place", getCodeList("SIDO"));

		return "pages/board/project_list";
	}

	@GetMapping("/project/form")
	public String projectForm(@ModelAttribute BaseParameter params, Model model) {
		Project project = new Project();

		model.addAttribute("project", project);
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
		model.addAttribute("place", getCodeList("SIDO"));
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "지원 및 정책관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/board/project_form";
	}

	@PostMapping("/project/form")
	public String saveProject(@RequestParam(required = false) String menuCode,
			@ModelAttribute("project") @Valid Project project, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
			breadcrumb.put("parent_menu_name", "콘텐츠 관리");
			breadcrumb.put("menu_name", "지원 및 정책관리");
			model.addAttribute("breadcrumb", breadcrumb);
			model.addAttribute("pageParams", project.getPageParams());

			model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
			model.addAttribute("place", getCodeList("SIDO"));

			return "pages/board/project_form";
		}

		String returnUrl = "redirect:"+appProperties.getHost()+"/board/project?";

		if (project.getProjectSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += project.getPageParams();
		}
		project.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		boardService.saveProject(project);

		return returnUrl;
	}

	@GetMapping("/project/{projectSeq}")
	public String projectView(@PathVariable int projectSeq, @ModelAttribute BaseParameter params, Model model) {

		model.addAttribute("project", boardService.getProject(projectSeq));
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
		model.addAttribute("place", getCodeList("SIDO"));
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "지원 및 정책관리");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.PROJECT, projectSeq));
		return "pages/board/project_form";
	}

	@PostMapping("/project/delete")
	public String deleteProject(@RequestParam String projectStr, @RequestParam(required = false) String menuCode,
			Model model, RedirectAttributes rttr) throws IOException {

		List<String> proSeqArr = Arrays.asList(projectStr.split(","));

		for(int i =0; i < proSeqArr.size();i++) {
			int projectSeq = Integer.parseInt(proSeqArr.get(i));
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("project_seq", projectSeq);
			params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
			boardService.deleteProject(params);
		}
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:"+appProperties.getHost()+"/board/project?menuCode=" + menuCode;
	}

	@GetMapping("/law")
	public String boardLawList(@ModelAttribute BoardParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = boardService.getBoardLawList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);

		model.addAttribute("list", list);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "법령및 조례");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("lawType", getCodeList("LAW_TYPE"));
		model.addAttribute("lawClass", getCodeList("LAW_CLASS"));

		return "pages/board/law_list";
	}

	@GetMapping("/law/form")
	public String lawForm(@ModelAttribute BaseParameter params, Model model) {
		Law law = new Law();

		model.addAttribute("law", law);
		model.addAttribute("lawType", getCodeList("LAW_TYPE"));
		model.addAttribute("lawClass", getCodeList("LAW_CLASS"));
		model.addAttribute("lawDiv", getCodeList("LAW_DIV"));
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "법령 및 조례");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/board/law_form";
	}

	@PostMapping("/law/form")
	public String saveLaw(@RequestParam(required = false) String menuCode, @ModelAttribute("law") @Valid Law law,
			BindingResult bindingResult, Model model, RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
			breadcrumb.put("parent_menu_name", "콘텐츠 관리");
			breadcrumb.put("menu_name", "법령 및 조례");
			model.addAttribute("breadcrumb", breadcrumb);
			model.addAttribute("pageParams", law.getPageParams());

			model.addAttribute("lawType", getCodeList("LAW_TYPE"));
			model.addAttribute("lawClass", getCodeList("LAW_CLASS"));
			model.addAttribute("lawDiv", getCodeList("LAW_DIV"));

			return "pages/board/law_form";
		}

		String returnUrl = "redirect:/board/law?";

		if (law.getLawSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += law.getPageParams();
		}
		law.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		boardService.saveLaw(law);

		return returnUrl;
	}

	@GetMapping("/law/{lawSeq}")
	public String LawView(@PathVariable int lawSeq, @ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("law", boardService.getLaw(lawSeq));
		model.addAttribute("lawType", getCodeList("LAW_TYPE"));
		model.addAttribute("lawClass", getCodeList("LAW_CLASS"));
		model.addAttribute("lawDiv", getCodeList("LAW_DIV"));
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "법령 및 조례");
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.LAW, lawSeq));
		return "pages/board/law_form";
	}

	@PostMapping("/law/delete")
	public String deleteLaw(@RequestParam int lawSeq, @RequestParam(required = false) String menuCode, Model model,
			RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("law_seq", lawSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoard(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/board/law?menuCode=" + menuCode;
	}

	@PostMapping("/saveAnswer")
	public String saveAnswer(@RequestParam(required = false) String menuCode,
							@ModelAttribute("board") @Valid Board board, BindingResult bindingResult, Model model,
							RedirectAttributes rttr) throws IOException {

		String returnUrl = "redirect:"+appProperties.getHost()+"/board/" + board.getBoardSettingSeq() + "?";

		if (board.getBoardSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += board.getPageParams();
		}
		board.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		BoardSetting boardSetting = boardService.getboardSettingInfo(board.getBoardSettingSeq());
		boardService.saveAnswer(board, boardSetting);

		return returnUrl;
	}

	@GetMapping("/project_update")
	public String boardProjectUpdateList(@ModelAttribute BoardParameter params, Model model) {

		System.out.println("params >> "+params);

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());
		Object objValue = null;

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = boardService.getBoardProjectList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);

		model.addAttribute("list", list);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "지원 및 정책관리");

		System.out.println("objValue >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+objValue);

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
		model.addAttribute("place", getCodeList("SIDO"));
		model.addAttribute("objValue", objValue);

		return "pages/board/project_list_update";
	}

	@GetMapping("/project/api")
	public String apiProject(@ModelAttribute BoardParameter params, Model model) throws JsonProcessingException, JSONException{

		//ObjectMapper objectMapper = new ObjectMapper();
		//Object objValue = null;

		String URL = "";
		String type = "";
		switch (params.getProjectType()){
			case "1" : URL = "https://www.sbiz.or.kr/sup/policy/json/policyfound.do"; type = "정책자금"; break;	//정책자금
			case "2" : URL = "https://www.sbiz.or.kr/sup/policy/json/policygrow.do"; type = "성장지원"; break;		//성장지원
			case "3" : URL = "https://www.sbiz.or.kr/sup/policy/json/policycomeback.do"; type = "재기지원"; break;	//재기지원
			case "4" : URL = "https://www.sbiz.or.kr/sup/policy/json/policystartup.do"; type = "창업지원"; break;	//창업지원
			case "5" : URL = "https://www.sbiz.or.kr/sup/policy/json/policymarket.do"; type = "전통시장활성화"; break;	//전통시장활성화
			case "6" : URL = "https://www.sbiz.or.kr/sup/policy/json/policygrnty.do"; type = "보증지원"; break;	//보증지원
		}

		String content = "";
		try {
			URI uri = new URI(URL);
			uri = new URIBuilder(uri)
					//.addParameter("key", "key")
					//.addParameter("targetDt", "20210201")
					.build();

			CloseableHttpClient httpClient = HttpClients.custom()
					.setMaxConnTotal(100)
					.setMaxConnPerRoute(100)
					.build();

			HttpResponse httpResponse = httpClient.execute(new HttpGet(uri));
			HttpEntity entity = httpResponse.getEntity();
			content = EntityUtils.toString(entity);
			//System.out.println("content = " + content);
			//objValue = objectMapper.readValue(content, Object.class);
			//System.out.println("objValue = " + objValue);

		} catch (Exception e) {

		}
		System.out.println("params :: "+params);
		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		int startPage = (paging.getPage() * paging.getSize()) - paging.getSize();	//10
		int endPage	  = paging.getPage() * paging.getSize();						//20

		JSONObject jsonParse = new JSONObject(content);
		JSONObject jsonObj = jsonParse;
		org.json.JSONArray item =  jsonObj.getJSONArray("item");

		//JSONArray newData = new JSONArray();
		List<Map<String, Object>> newData = new ArrayList<>();
		int newDataTotal = 0;	//총개수
		int num = 0;			//추가된 count저장

		for(int i =0; i < item.length();i++){
			JSONObject index = (JSONObject) item.get(i);

			if(!index.get("itemCnt").equals(0)){
				JSONArray items = (JSONArray) index.get("items");
				for(int j =0; j < items.length();j++){
					newDataTotal++;

					if(newDataTotal <= startPage && startPage != 0){	//데이터의 n번째 까지는 패스시킨다
						continue;
					}

					//row개수가 채워지면 더이상 추가하지 않는다
					if(num == paging.getSize()){
						continue;
					}

					JSONObject data = (JSONObject) items.get(j);
					Map<String, Object> map;
					map = new ObjectMapper().readValue(data.toString(), Map.class);
					map.put("areaNm",index.get("areaNm"));
					newData.add(map);
					num ++;

				}
			}
		}

		List<Map<String, Object>> list2 = new ArrayList<>();
		if (newData != null) {
			int jsonSize = newData.size();
			for (int i = 0; i < jsonSize; i++) {
				Map<String, Object> data = newData.get(i);
				Map<String, Object> map = data;
				list2.add(map);	//List로 변환
			}
		}
		paging.setTotal(newDataTotal);

		Map<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "콘텐츠 관리");
		breadcrumb.put("menu_name", "지원 및 정책관리");

		Project project = new Project();

		model.addAttribute("params", params);
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE"));
		model.addAttribute("paging", paging);
		model.addAttribute("type", type);
		model.addAttribute("list2", list2);
		model.addAttribute("project", project);

		//return ResponseEntity.ok(objValue);
		return "pages/board/project_list_update";

	}

	@PostMapping("/project/add")
	public String addProject(@RequestParam(required = false) Map<String,Object> data,
							   Model model,
							  RedirectAttributes rttr) throws IOException {

		String dataString = data.get("projectList").toString();
		JSONObject jsonParse = new JSONObject(dataString);
		org.json.JSONArray item =  jsonParse.getJSONArray("projectList");
		int loginUserSeq = authenticationFacade.getLoginUserSeq();

		String returnUrl = "redirect:"+appProperties.getHost()+"/board/project";

		boardService.addProject(item, loginUserSeq);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);

		return returnUrl;
	}

}
