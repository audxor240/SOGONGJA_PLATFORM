package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.service.AnswerService;
import com.stoneitgt.sogongja.user.service.UserService;
import org.apache.ibatis.jdbc.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.GlobalConstant.BOARD_TYPE;
import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.domain.BoardParameter;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.util.StoneUtil;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/board")
public class BoardController extends BaseController {

	@Autowired
	private BoardService boardService;

	@Autowired
	private UserService userService;

	@Autowired
	private AnswerService answerService;

	@Autowired
	private AppProperties appProperties;

	@GetMapping("/type/{boardType:faq|community}")
	public String boardList(@PathVariable String boardType, @ModelAttribute BaseParameter params, Model model) {
		System.out.println("boardType :: "+boardType);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("board_type", boardType);

		List<Map<String, Object>> list = null;

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			list = boardService.getBoardList2(paramsMap);
			model.addAttribute("categoryCount", boardService.getBoardCategoryCount(paramsMap));
		} else {
			Paging paging = getUserPaging(params.getPage(), params.getSize());
			list = boardService.getBoardList2(paramsMap, paging);
			Integer total = boardService.selectTotalRecords();
			paging.setTotal(total);
			//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
			model.addAttribute("paging", paging);
		}

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("boardType", boardType);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("pageParams", getBaseParameterString(params));

		String pageName = "";

		switch (boardType.toLowerCase()) {
		case BOARD_TYPE.COMMUNITY:
			pageName = "community_list";
			break;
		default:
			pageName = boardType.toLowerCase();
			break;
		}

		return "pages/board/" + pageName;
	}


	@GetMapping("/{boardSettingSeq}")
	public String boardList(@PathVariable String boardSettingSeq, @RequestParam(required=false) String name, @ModelAttribute BaseParameter params, Model model) {
		System.out.println("params >> "+params);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("boardSettingSeq", boardSettingSeq);

		BoardSetting boardSetting = boardService.getboardSettingInfo(Integer.parseInt(boardSettingSeq));

		if(boardSetting.getName().equals("?????? ??? ?????? ??????")){
			return "redirect:"+appProperties.getHost()+"/board/project?name="+name;
		}

		paramsMap.put("board_type", boardSetting.getFileDirectoryName());
		List<Map<String, Object>> list = null;

		Paging paging = getUserPaging(params.getPage(), params.getSize());

		list = boardService.getBoardList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("paging", paging);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("name", name);
		model.addAttribute("boardSettingSeq", boardSettingSeq);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("pageParams", getBaseParameterString(params));

		String pageName = "";

		pageName = "board_list";
		return "pages/board/" + pageName;
	}

	@GetMapping("/{boardSettingSeq}/{boardSeq}")
	public String boardView(@PathVariable int boardSettingSeq, @PathVariable int boardSeq, @RequestParam(required=false) String name,
			@ModelAttribute BaseParameter params, Model model) {

		Authentication authentication = authenticationFacade.getAuthentication();
		BoardSetting boardSetting = boardService.getboardSettingInfo(boardSettingSeq);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("fileList", getFileList(boardSetting.getFileDirectoryName(), boardSeq));
		model.addAttribute("boardSettingSeq", boardSettingSeq);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("name", name);

		Answer answer = null;
		answer = answerService.getAnswerInfo(boardSeq);
		if(answer == null){
			answer = new Answer();
		}
		System.out.println("answer :::: "+answer);
		model.addAttribute("answer", answer);
		//?????? ???????????? ????????? ?????????
		if(authentication.getCredentials() != "" && answer.getAnswerSeq() == 0) {
			User user = userService.getUserInfo(authenticationFacade.getLoginUserSeq());

			Board board = boardService.getBoardDetail(boardSeq, boardSettingSeq);
			if (user.getUserSeq() == board.getRegUserSeq()) {
				board.setBoardType("qna");

				model.addAttribute("board", board);
				model.addAttribute("detail", true);
				return "pages/board/board_write";	//????????? ?????? form
			}
		}

		Map<String, Object> board = boardService.getBoard(boardSeq, boardSettingSeq);
		model.addAttribute("data", board);

		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/board/board_view";
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
			case "notice": breadcrumb.put("parent_menu_name", "????????? ??????"); breadcrumb.put("menu_name", "???????????? ??????"); break;
			case "news": breadcrumb.put("parent_menu_name", "????????? ??????"); breadcrumb.put("menu_name", "????????????"); break;
			case "faq": breadcrumb.put("parent_menu_name", "????????? ??????"); breadcrumb.put("menu_name", "FAQ ??????"); break;
			case "community": breadcrumb.put("parent_menu_name", "????????? ??????"); breadcrumb.put("menu_name", "???????????? ??????"); break;
		}
		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		if (BOARD_TYPE.FAQ.equals(boardType)) {
			model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
			return "pages/board/board_form_faq";
		} else {
			return "pages/board/board_write";
		}
	}


	@PostMapping("/form")
	public String saveBoard(@RequestParam(required = false) String menuCode,
							@ModelAttribute("board") @Valid Board board, BindingResult bindingResult, Model model,
							RedirectAttributes rttr) throws IOException {

		if (bindingResult.hasErrors()) {
			model.addAttribute("menuCode", menuCode);
			//model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", board.getPageParams());

			if (BOARD_TYPE.FAQ.equals(board.getBoardType())) {
				model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
				//return "pages/board/board_form_faq";
			} else {
				model.addAttribute("fileList", getFileList(FILE_REF_TYPE.BOARD, board.getBoardSeq()));
				//return "pages/board/board_write";
			}
		}

		String returnUrl = "";
		if(board.getMyPage() == true){
			returnUrl = "redirect:" + appProperties.getHost() + "/mypage/qna/"+board.getBoardSettingSeq();
		}else {
			returnUrl = "redirect:" + appProperties.getHost() + "/board/" + board.getBoardSettingSeq() + "?";

			if (board.getBoardSeq() == 0) {
				rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
				returnUrl += "menuCode=" + menuCode;
			} else {
				rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
				returnUrl += board.getPageParams();
			}
		}
		board.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		BoardSetting boardSetting = boardService.getboardSettingInfo(board.getBoardSettingSeq());
		boardService.saveBoard(board, boardSetting);

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
	public String boardProjectList(@ModelAttribute BoardParameter params,@RequestParam(required=false) String name, Model model) {

		//System.out.println("name :: "+name);
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		Paging paging = getUserPaging(params.getPage(), params.getSize());
		System.out.println("paramsMap >> "+paramsMap);
		List<Map<String, Object>> list = boardService.getBoardProjectList(paramsMap, paging);
		Integer total = boardService.selectTotalRecords();
		paging.setTotal(total);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		BoardSetting boardSetting = new BoardSetting();
		boardSetting.setName("?????? ??? ????????????");

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("paging", paging);
		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("boardType", "project");
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("name", name);

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
		model.addAttribute("lawType", getCodeList("LAW_TYPE", "??????"));
		model.addAttribute("lawClass", getCodeList("LAW_CLASS", "??????"));

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
	public String QnaWriteForm(Model model, @RequestParam int boardSettingSeq) {

		Board board = new Board();
		Answer answer = new Answer();
		board.setBoardSettingSeq(boardSettingSeq);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		BoardSetting boardSetting = boardService.getboardSettingInfo(boardSettingSeq);

		//QNA????????? ????????? ??????
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("board", board);
		model.addAttribute("answer", answer);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("name", boardSetting.getName());
		model.addAttribute("detail", false);
		return "pages/board/board_write";
	}

	@PostMapping("/delete")
	public String deleteBoard(@RequestParam int boardSeq, @RequestParam int boardSettingSeq, @RequestParam boolean mypage,
							  @RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws IOException {
		Map<String, Object> params = new HashMap<String, Object>();
		BoardSetting boardSetting = boardService.getboardSettingInfo(boardSettingSeq);

		params.put("board_seq", boardSeq);
		params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
		params.put("fileDirectoryName", boardSetting.getFileDirectoryName());

		boardService.deleteBoard(params);
		//rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);

		String returnUrl = "";

		if(mypage){
			returnUrl = "redirect:" + appProperties.getHost() + "/mypage/qna/"+boardSettingSeq;
		}else{
			returnUrl = "redirect:"+appProperties.getHost()+"/board/"+boardSettingSeq;
		}

		return returnUrl;
	}

}
