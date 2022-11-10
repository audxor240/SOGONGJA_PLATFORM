package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommunityService;
import com.stoneitgt.sogongja.user.service.UserService;
import com.stoneitgt.util.ScriptUtils;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/community")
public class CommunityController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private CommunityService communityService;

    @GetMapping("")
    public String communityList(@ModelAttribute BaseParameter params, Model model) {
        System.out.println("params >> "+params);
        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = null;

        Paging paging = getUserPaging(params.getPage(), params.getSize());
        list = communityService.getCommunityList(paramsMap, paging);
        Integer total = communityService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("paging", paging);

        List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류
        System.out.println("list >> "+list);
        model.addAttribute("list", list);
        model.addAttribute("params", params);
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);



        return "pages/board/community_list";
    }

    @PostMapping("/form")
    public String saveCommunity(@RequestParam(required = false) String menuCode,
                                @ModelAttribute("community") @Valid Community community, BindingResult bindingResult, Model model,
                                RedirectAttributes rttr) throws IOException {

        System.out.println("community :: "+community);

        /*
        if (bindingResult.hasErrors()) {
            model.addAttribute("menuCode", menuCode);
            //model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
            model.addAttribute("pageParams", community.getPageParams());

            if (GlobalConstant.BOARD_TYPE.FAQ.equals(board.getBoardType())) {
                model.addAttribute("category", getCodeList("FAQ_TYPE", ""));
                //return "pages/board/board_form_faq";
            } else {
                model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.BOARD, board.getBoardSeq()));
                return "pages/board/board_write";
            }
        }
        *?
         */

        String returnUrl = "";

        if (community.getCommunitySeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
            returnUrl += "menuCode=" + menuCode;
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
            returnUrl += community.getPageParams();
        }
        community.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        //BoardSetting boardSetting = boardService.getboardSettingInfo(board.getBoardSettingSeq());
        communityService.saveCommunity(community);

        if(community.getCommunityType().equals("shop")){
            returnUrl = "redirect:/community?type=shop";	//상점 커뮤니티
        }else if(community.getCommunityType().equals("region")){
            returnUrl = "redirect:/community?type=region";	//지역 커뮤니티
        }
        System.out.println("returnUrl >> "+returnUrl);
        return returnUrl;

        //return "";
    }

    @GetMapping("/communityWriteForm")
    public String communityWriteForm(Model model, @RequestParam String type,
                                     Authentication authentication, HttpServletResponse response) throws IOException {

        User user = new User();
        try {
            user = (User) authentication.getPrincipal();

        } catch(NullPointerException e){
            //ScriptUtils.alert(response, "로그인이 필요합니다");
            ScriptUtils.alertAndMovePage(response, "로그인이 필요합니다","/login");
        }

        Community community = new Community();
        Answer answer = new Answer();
        List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류
        System.out.println("researchShopGroupList :: "+researchShopGroupList);
        System.out.println("researchShopGroupList.size() :: "+researchShopGroupList.size());

        model.addAttribute("community", community);
        model.addAttribute("answer", answer);
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("detail", false);
        model.addAttribute("type", type);
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);
        return "pages/board/community_write";
    }

    @GetMapping("/{communitySeq}")
    public String communityView(@PathVariable int communitySeq, @RequestParam(required=false) String name,
                            @ModelAttribute BaseParameter params, Model model) {
        System.out.println("params :::: "+params);
        Authentication authentication = authenticationFacade.getAuthentication();
        //BoardSetting boardSetting = boardService.getboardSettingInfo(boardSettingSeq);
        List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
        Community community = communityService.getCommunityInfo(communitySeq);

        //model.addAttribute("boardSettingSeq", boardSettingSeq);
        //model.addAttribute("boardSetting", boardSetting);

        Answer answer = null;
        //answer = answerService.getAnswerInfo(communitySeq);
        if(answer == null){
            answer = new Answer();
        }
        System.out.println("answer :::: "+answer);
        model.addAttribute("answer", answer);
        //내가 쓴글이고 답변이 없으면
        /*if(authentication.getCredentials() != "") {
            User user = userService.getUserInfo(authenticationFacade.getLoginUserSeq());

            Community community = communityService.getBoardDetail(communitySeq);
            if (user.getUserSeq() == community.getRegUserSeq()) {
                board.setBoardType("qna");

                model.addAttribute("community", community);
                model.addAttribute("detail", true);
                return "pages/board/board_write";	//작성자 수정 form
            }
        }
        //System.out.println("boardSetting ::: "+boardSetting);
        Map<String, Object> board = communityService.getBoard(communitySeq);


        model.addAttribute("data", board);
*/
        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류

        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.COMMUNITY, communitySeq));
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("params", params);
        model.addAttribute("name", name);
        model.addAttribute("type", params.getType());
        model.addAttribute("detail", true);
        System.out.println("community >> "+community);
        model.addAttribute("community", community);
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);

        return "pages/board/community_write";
    }

}
