package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.net.URI;
import java.util.*;

import javax.validation.Valid;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.stoneitgt.sogongja.domain.*;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
		return "redirect:/board/" + boardSettingSeq + "?menuCode=" + menuCode;
	}

	@PostMapping("/settingDelete")
	public String deleteBoardSetting(@RequestParam int boardSettingSeq,
							  @RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws SftpException , JSchException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("board_setting_seq", boardSettingSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoardSetting(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/board/" + boardSettingSeq + "?menuCode=" + menuCode;
	}

	@GetMapping("/project")
	public String boardProjectList(@ModelAttribute BoardParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

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

		String returnUrl = "redirect:/board/project?";

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
	public String deleteProject(@RequestParam int projectSeq, @RequestParam(required = false) String menuCode,
			Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("project_seq", projectSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoard(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/board/project?menuCode=" + menuCode;
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

		String returnUrl = "redirect:/board/" + board.getBoardSettingSeq() + "?";

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
	public String apiProject(@ModelAttribute BoardParameter params, Model model) throws JSONException {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = boardService.getBoardProjectList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		System.out.println("paging :: "+paging);
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

		ObjectMapper objectMapper = new ObjectMapper();
		Object objValue = null;

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
			objValue = objectMapper.readValue(content, Object.class);
			//System.out.println("objValue = " + objValue);


			//System.out.println("jsonObj :: "+jsonObj);
			//System.out.println("jsonObj.getClass().getName() :: "+jsonObj.getClass().getName());
			//System.out.println("jsonObj.item :: "+jsonObj.get("item"));
			//System.out.println("item ---- "+item);
			//System.out.println("jObject ---------> "+jObject);
			//System.out.println("jObject.item ---------> "+jObject.get("item"));
			//System.out.println("jObject.item ---------> "+jObject.get("item"));
			//페이징 처리를 위해 데이터 재정의
			/*for(int i =0; i < objValue['item']){

			}*/
		} catch (Exception e) {

		}
		paging.setPage(2);
		paging.setSize(10);
		int startPage = (paging.getPage() * paging.getSize()) - paging.getSize();	//10
		int endPage	  = paging.getPage() * paging.getSize();						//20
		System.out.println("startPage :: "+startPage);
		System.out.println("endPage :: "+endPage);

		JSONObject jsonParse = new JSONObject(content);
		JSONObject jsonObj = (JSONObject) jsonParse;
		JSONArray item =  jsonObj.getJSONArray("item");


		JSONArray newData = new JSONArray();
		int num = 0;
		for(int i =0; i < item.length();i++){
			JSONObject index = (JSONObject) item.get(i);
			if(num == paging.getSize()){
				break;
			}
			if(!index.get("itemCnt").equals(0)){
				JSONArray items = (JSONArray) index.get("items");
				for(int j =0; j < items.length();j++){
					if(j >= startPage && j <= endPage) {
						System.out.println("j >>> "+j);
						JSONObject data = (JSONObject) items.get(j);
						//배열에 저장
						newData.put(data);
						num ++;
						if(num == paging.getSize()){
							break;
						}
					}
				}
			}

		}
		//paging.setPage(params.getPage());
		//paging.setSize(params.getSize());


		System.out.println("newData :: "+newData);
		System.out.println("newData.length() >> "+newData.length());
		System.out.println("check------------------1");
		paging.setTotal(newData.length());
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		System.out.println("paging :: "+paging);
		model.addAttribute("paging", paging);

		System.out.println("objValue :: "+objValue);
		model.addAttribute("objValue", objValue);
		model.addAttribute("type", type);
		//return ResponseEntity.ok(objValue);
		return "pages/board/project_list_update";
	}

}
