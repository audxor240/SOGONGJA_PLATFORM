package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.stoneitgt.sogongja.domain.Board;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.GlobalConstant.BOARD_TYPE;
import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.user.domain.BoardParameter;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.util.StoneUtil;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/board")
public class BoardController extends BaseController {

	@Autowired
	private BoardService boardService;

	@GetMapping("/{boardType:news|notice|faq|community|qna}")
	public String boardList(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {
		System.out.println("boardType :: "+boardType);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("board_type", boardType);

		List<Map<String, Object>> list = null;

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			list = boardService.getBoardList(paramsMap);
			model.addAttribute("categoryCount", boardService.getBoardCategoryCount(paramsMap));
		} else {
			Paging paging = getUserPaging(params.getPage(), params.getSize());
			list = boardService.getBoardList(paramsMap, paging);
			Integer total = boardService.selectTotalRecords();
			paging.setTotal(total);
			//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
			model.addAttribute("paging", paging);
		}
		System.out.println("list --------------- "+list);
		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("boardType", boardType);
		model.addAttribute("pageParams", getBaseParameterString(params));

		String pageName = "";

		switch (boardType.toLowerCase()) {
		case BOARD_TYPE.NEWS:
		case BOARD_TYPE.NOTICE:
		case BOARD_TYPE.COMMUNITY:
		case BOARD_TYPE.QNA:
			pageName = "board_list";
			break;
		default:
			pageName = boardType.toLowerCase();
			break;
		}

		return "pages/board/" + pageName;
	}

	@GetMapping("/{boardType}/{boardSeq}")
	public String boardView(@PathVariable String boardType, @PathVariable int boardSeq,
			@ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("data", boardService.getBoard(boardSeq));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.BOARD, boardSeq));
		model.addAttribute("boardType", boardType);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/board/board_view";
	}


	@PostMapping("/form")
	public String saveBoard(@RequestParam(required = false) String menuCode,
							@ModelAttribute("board") @Valid Board board, BindingResult bindingResult, Model model,
							RedirectAttributes rttr) throws IOException {

		System.out.println("board >>>> "+board);
		System.out.println("board.getAttachFiles().get(0).getName() ::: "+board.getAttachFiles().get(0).getName());
		System.out.println("board.getAttachFiles().get(0).getOriginalFilename() ::: "+board.getAttachFiles().get(0).getOriginalFilename());
		System.out.println("board.getAttachFiles().get(0).getContentType() ::: "+board.getAttachFiles().get(0).getContentType());

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", board.getPageParams());

			if (BOARD_TYPE.FAQ.equals(board.getBoardType())) {
				model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
				//return "pages/board/board_form_faq";
			} else {
				model.addAttribute("fileList", getFileList(FILE_REF_TYPE.BOARD, board.getBoardSeq()));
				return "pages/board/board_write";
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

		//return "";
	}

	@PostMapping("/popup/notice")
	@ResponseBody
	public Map<String, Object> popNotice(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();

		List<Map<String, Object>> noticeList = boardService.getPopNoticeBoard();
		if (noticeList != null && noticeList.size() > 0) {
			result.put("noticeData", noticeList.get(0));
		} else {
			result.put("noticeData", null);
		}
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);

		return result;
	}

	@GetMapping("/project")
	public String boardProjectList(@ModelAttribute BoardParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		Paging paging = getUserPaging(params.getPage(), params.getSize());
		List<Map<String, Object>> list = boardService.getBoardProjectList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);

		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("boardType", "project");
		model.addAttribute("projectType", getCodeList("PROJECT_TYPE", "전체"));
		model.addAttribute("place", getCodeList("SIDO", "전체"));

		return "pages/board/project_list";
	}

	@GetMapping("/project/{projectSeq}")
	public String projectView(@PathVariable int projectSeq, @ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("data", boardService.getProject(projectSeq));
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("boardType", "project");
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.PROJECT, projectSeq));
		return "pages/board/project_view";
	}

	@GetMapping("/law")
	public String boardLawList(@ModelAttribute BoardParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		Paging paging = getUserPaging(params.getPage(), params.getSize());
		List<Map<String, Object>> list = boardService.getBoardLawList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);

		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("boardType", "law");
		model.addAttribute("lawType", getCodeList("LAW_TYPE", "전체"));
		model.addAttribute("lawClass", getCodeList("LAW_CLASS", "전체"));

		return "pages/board/law_list";
	}

	@GetMapping("/law/{lawSeq}")
	public String LawView(@PathVariable int lawSeq, @ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("data", boardService.getLaw(lawSeq));
		model.addAttribute("boardType", "law");
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("fileList", getFileList(FILE_REF_TYPE.LAW, lawSeq));
		return "pages/board/law_view";
	}

	@GetMapping("/QnaWriteForm")
	public String QnaWriteForm(Model model) {

		Board board = new Board();
		board.setBoardType("qna");
		model.addAttribute("board", board);
		return "pages/board/board_write";
	}

}
