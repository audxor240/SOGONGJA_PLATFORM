package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.domain.CommunityParameter;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.CommunityService;
import com.stoneitgt.sogongja.user.service.ReplyService;
import com.stoneitgt.sogongja.user.service.UserService;
import com.stoneitgt.util.ScriptUtils;
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

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
@RequestMapping("/community")
public class CommunityController extends BaseController {

    @Autowired
    private UserService userService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private CommunityService communityService;

    @Autowired
    private ReplyService replyService;

    @Autowired
    private AppProperties appProperties;
    
    @GetMapping("")
    public String communityList(@ModelAttribute CommunityParameter params, Model model) {
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

        //QNA게시판 시퀀스 정보
        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        model.addAttribute("list", list);
        model.addAttribute("params", params);
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("pageParams", getCommunityParameterString(params));
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);



        return "pages/board/community_list";
    }

    @PostMapping("/form")
    public String saveCommunity(@ModelAttribute("community") @Valid Community community, BindingResult bindingResult, Model model,
                                RedirectAttributes rttr) throws IOException {

        String returnUrl = "";

        if (community.getCommunitySeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
            returnUrl += community.getPageParams();
        }
        community.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        community.setRegionName3(community.getRegionName3().trim());        //공백제거

        communityService.saveCommunity(community);

        if(community.getCommunityType().equals("shop")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community?type=shop";	//상점 커뮤니티
        }else if(community.getCommunityType().equals("region")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community?type=region";	//지역 커뮤니티
        }

        return returnUrl;

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

        //QNA게시판 시퀀스 정보
        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
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
        List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
        Community community = communityService.getCommunityInfo(communitySeq);
        User user = new User();

        String returnUrl = "";

        Answer answer = null;
        //answer = answerService.getAnswerInfo(communitySeq);
        if(answer == null){
            answer = new Answer();
        }

        model.addAttribute("answer", answer);
        //로그인 상태일때
        if(authentication.getCredentials() != "") {
            user = userService.getUserInfo(authenticationFacade.getLoginUserSeq());
            //Community community = communityService.getCommunityInfo(communitySeq);
            if (user.getUserSeq() == community.getRegUserSeq()) {   //내가 작성한글

                model.addAttribute("detail", true);
                returnUrl = "pages/board/community_write";	//작성자 수정 form
            }else{
                model.addAttribute("detail", false);
                returnUrl = "pages/board/community_view";
            }
        }else{
            model.addAttribute("detail", false);
            returnUrl = "pages/board/community_view";
        }

        List<Map<String, Object>> researchShopGroupList = communityService.getResearchShopGroupList();			//업종 대분류
        List<Map<String, Object>> researchShopSubGroupList = communityService.getResearchShopSubGroupList();	//업종 중분류
        List<Map<String,Object>> replyList = replyService.getreplyList(community.getCommunitySeq());
        System.out.println("replyList >>> "+replyList);
        List<Boolean> myReplyList = new ArrayList<>();
        for (Map<String, Object> list: replyList) {
            if(list.get("reg_user_seq").equals(user.getUserSeq())){
                myReplyList.add(true);
            }else{
                myReplyList.add(false);
            }
        }

        //QNA게시판 시퀀스 정보
        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("fileList", getFileList(GlobalConstant.FILE_REF_TYPE.COMMUNITY, communitySeq));
        model.addAttribute("boardSettingList", boardSettingList);
        model.addAttribute("params", params);
        model.addAttribute("name", name);
        model.addAttribute("type", params.getType());

        model.addAttribute("community", community);
        model.addAttribute("researchShopGroupList", researchShopGroupList);
        model.addAttribute("researchShopSubGroupList", researchShopSubGroupList);
        model.addAttribute("replyList", replyList);
        model.addAttribute("myReplyList", myReplyList);

        return returnUrl;
    }

    @PostMapping("/delete")
    public String deleteCommunity(@RequestParam int communitySeq, @RequestParam String communityType,
                               Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("community_seq", communitySeq);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        communityService.deleteCommunity(params);

        String returnUrl = "";
        if(communityType.equals("shop")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community?type=shop";	//상점 커뮤니티
        }else {
            returnUrl = "redirect:"+appProperties.getHost()+"/community?type=region";	//지역 커뮤니티
        }

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
        return String.join("&", result);
    }

}
