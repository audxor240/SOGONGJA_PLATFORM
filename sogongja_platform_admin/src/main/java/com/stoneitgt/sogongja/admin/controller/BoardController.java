package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Law;
import com.stoneitgt.sogongja.domain.Project;
import com.stoneitgt.util.StoneUtil;

@Controller
@RequestMapping("/board")
public class BoardController extends BaseController {

	@Autowired
	private BoardService boardService;

	@GetMapping("/{boardType}")
	public String boardList(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("board_type", boardType);

		List<Map<String, Object>> list = boardService.getBoardList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("boardType", boardType);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		switch (boardType){
			case "notice": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "공지사항 관리"); break;
			case "news": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "보도자료"); break;
			case "faq": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "FAQ 관리"); break;
			case "community": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "커뮤니티 관리"); break;
		}
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			model.addAttribute("category", getCodeList("FAQ_TYPE"));
			return "pages/board/board_list_faq";
		} else {
			return "pages/board/board_list";
		}

	}

	@GetMapping("/{boardType}/{boardSeq}")
	public String boardView(@PathVariable String boardType, @PathVariable int boardSeq,
			@ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("board", boardService.getBoard(boardSeq));
		model.addAttribute("menuCode", params.getMenuCode());
		model.addAttribute("boardType", boardType);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		switch (boardType){
			case "notice": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "공지사항 관리"); break;
			case "news": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "보도자료"); break;
			case "faq": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "FAQ 관리"); break;
			case "community": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "커뮤니티 관리"); break;
		}
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
			return "pages/board/board_form_faq";
		} else {
			model.addAttribute("fileList", getFileList(FILE_REF_TYPE.BOARD, boardSeq));
			return "pages/board/board_form";
		}
	}

	@GetMapping("/{boardType}/form")
	public String boardForm(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {
		Board board = new Board();
		board.setBoardType(boardType);

		model.addAttribute("board", board);
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		Map<String, Object> breadcrumb = new HashMap<String, Object>();

		switch (boardType){
			case "notice": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "공지사항 관리"); break;
			case "news": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "보도자료"); break;
			case "faq": breadcrumb.put("parent_menu_name", "콘텐츠 관리"); breadcrumb.put("menu_name", "FAQ 관리"); break;
			case "community": breadcrumb.put("parent_menu_name", "게시판 관리"); breadcrumb.put("menu_name", "커뮤니티 관리"); break;
		}
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
			return "pages/board/board_form_faq";
		} else {
			return "pages/board/board_form";
		}
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

		String returnUrl = "redirect:/board/" + board.getBoardType() + "?";

		if (board.getBoardSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += board.getPageParams();
		}
		board.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		boardService.saveBoard(board);

		return returnUrl;
	}

	@PostMapping("/delete")
	public String deleteBoard(@RequestParam String boardType, @RequestParam int boardSeq,
			@RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("board_seq", boardSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		boardService.deleteBoard(params);
		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
		return "redirect:/board/" + boardType + "?menuCode=" + menuCode;
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

}
