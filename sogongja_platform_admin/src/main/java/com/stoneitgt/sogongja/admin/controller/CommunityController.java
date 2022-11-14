package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.service.BoardService;
import com.stoneitgt.sogongja.admin.service.CommunityService;
import com.stoneitgt.sogongja.admin.service.ReplyService;
import com.stoneitgt.sogongja.admin.service.UserService;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Controller
@Slf4j
@RequestMapping("/community")
public class CommunityController extends BaseController {

    @Autowired
    private CommunityService communityService;

    @Autowired
    private ReplyService replyService;

    @Autowired
    private UserService userService;

    @Autowired
    private BoardService boardService;

    @GetMapping("{communityType}")
    public String communityList(@PathVariable String communityType, @ModelAttribute CommunityParameter params, Model model) {

        params.setType(communityType);
        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = null;
        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "게시판 관리");
        breadcrumb.put("menu_name", "커뮤니티 관리");

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        list = communityService.getCommunityList(paramsMap, paging);
        Integer total = communityService.selectTotalRecords();
        paging.setTotal(total);

        String returnUrl = "";
        if(communityType.equals("shop")){
            returnUrl = "pages/board/community_list";
        }else{
            returnUrl = "pages/board/community_list02";
        }

        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류

        model.addAttribute("paging", paging);
        model.addAttribute("list", list);
        model.addAttribute("params", params);
        model.addAttribute("pageParams", getCommunityParameterString(params));
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);
        model.addAttribute("breadcrumb", breadcrumb);

        return returnUrl;
    }

    @GetMapping("/form")
    public String communityForm(@ModelAttribute CommunityParameter params, Model model) {

        Community community = new Community();
        //board.setBoardSettingSeq(boardSettingSeq);
        model.addAttribute("community", community);

        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류

        model.addAttribute("menuCode", params.getMenuCode());

        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "게시판 관리");
        breadcrumb.put("menu_name", "커뮤니티 관리");

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getCommunityParameterString(params));
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);
        model.addAttribute("detail", false);
        model.addAttribute("communityType", params.getType());
        //model.addAttribute("boardSetting", boardSetting);
        String returnUrl = "";
        if(params.getType().equals("shop")){
            returnUrl = "pages/board/community_form";
        }else{
            returnUrl = "pages/board/community_form02";
        }

        return returnUrl;
    }

    @PostMapping("/form")
    public String saveCommunity(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("community") @Valid Community community, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {

        model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.COMMUNITY, community.getCommunitySeq()));

        String returnUrl = "";
        if(community.getCommunityType().equals("shop")){
            returnUrl = "redirect:/community/shop";
        }else{
            returnUrl = "redirect:/community/region";
        }

        if (community.getCommunitySeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
        }
        community.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        community.setRegionName3(community.getRegionName3().trim());        //공백제거

        communityService.saveCommunity(community);

        return returnUrl;
    }

    @GetMapping("/detail/{communitySeq}")
    public String communityView(@PathVariable int communitySeq, @RequestParam(required=false) String name,
                                @ModelAttribute CommunityParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Authentication authentication = authenticationFacade.getAuthentication();
        Community community = communityService.getCommunityInfo(communitySeq);
        User user = new User();

        String returnUrl = "";

        Answer answer = null;
        //answer = answerService.getAnswerInfo(communitySeq);
        if(answer == null){
            answer = new Answer();
        }

        model.addAttribute("answer", answer);

        if(params.getType().equals("shop")){
            returnUrl = "pages/board/community_form";
        }else{
            returnUrl = "pages/board/community_form02";
        }


        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류
        List<Map<String,Object>> replyList = replyService.getreplyList(community.getCommunitySeq(), paging);

        List<Boolean> myReplyList = new ArrayList<>();
        for (Map<String, Object> list: replyList) {
            if(list.get("reg_user_seq").equals(user.getUserSeq())){
                myReplyList.add(true);
            }else{
                myReplyList.add(false);
            }
        }
        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "게시판 관리");
        breadcrumb.put("menu_name", "커뮤니티 관리");

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("detail", true);
        model.addAttribute("pageParams", getCommunityParameterString(params));
        model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.COMMUNITY, communitySeq));
        model.addAttribute("params", params);
        model.addAttribute("name", name);
        model.addAttribute("type", params.getType());
        model.addAttribute("communityType", params.getType());

        model.addAttribute("community", community);
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);
        model.addAttribute("replyList", replyList);
        model.addAttribute("myReplyList", myReplyList);

        return returnUrl;
    }

    public String getCommunityParameterString(CommunityParameter params) {
        List<String> result = new ArrayList<String>();
        result.add("page=" + params.getPage());
        result.add("size=" + params.getSize());
        result.add("year=" + StringUtil.defaultString(params.getYear()));
        result.add("field=" + StringUtil.defaultString(params.getField()));
        try {
            result.add("keyword="
                    + URLEncoder.encode(StringUtil.defaultString(params.getKeyword()), StandardCharsets.UTF_8.name()));
        } catch (UnsupportedEncodingException e) {
            log.error("", e);
        }
        result.add("sortName=" + StringUtil.defaultString(params.getSortName()));
        result.add("sortType=" + StringUtil.defaultString(params.getSortType()));
        result.add("menuCode=" + StringUtil.defaultString(params.getMenuCode()));
        result.add("type=" + StringUtil.defaultString(params.getType()));
        return String.join("&", result);
    }

    @PostMapping("/delete")
    public String deleteCommunity(@RequestParam int communitySeq, @RequestParam String communityType,
                                  Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("community_seq", communitySeq);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        communityService.deleteCommunity(params);



        return "redirect:/community/"+communityType;
    }

    @PostMapping("/batchDelete")
    public String deleteBatchCommunity(@RequestParam String comStr, @RequestParam(required = false) String communityType,
                                   Model model, RedirectAttributes rttr) throws IOException {

        List<String> comSeqArr = Arrays.asList(comStr.split(","));

        for(int i =0; i < comSeqArr.size();i++) {
            int comSeq = Integer.parseInt(comSeqArr.get(i));
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("community_seq", comSeq);
            params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
            communityService.deleteCommunity(params);
        }
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        return "redirect:/community/"+communityType;
    }
}
