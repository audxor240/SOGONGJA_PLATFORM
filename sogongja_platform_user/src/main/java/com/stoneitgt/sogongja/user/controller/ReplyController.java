package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.Reply;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/reply")
public class ReplyController extends BaseController {

    @Autowired
    private ReplyService replyService;

    @Autowired
    private AppProperties appProperties;

    @PostMapping("/replyWrite")
    public String saveReply(@ModelAttribute("reply") @Valid Reply reply, BindingResult bindingResult, Model model,
                            RedirectAttributes rttr) throws IOException {

        String returnUrl = "";

        if (reply.getReplySeq() == 0) {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        } else {
            rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
        }
        reply.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        replyService.saveReply(reply);

        if(reply.getCommunityType().equals("shop")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community/"+reply.getCommunitySeq()+"?type=shop";	//상점 커뮤니티
        }else if(reply.getCommunityType().equals("region")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community/"+reply.getCommunitySeq()+"?type=region";	//지역 커뮤니티
        }
        System.out.println("returnUrl >> "+returnUrl);
        return returnUrl;

        //return "";
    }

    @PostMapping("/replyDelete")
    public String deleteReply(@RequestParam String replySeq, @RequestParam String communityType, @RequestParam String communitySeq,
                              @RequestParam(required = false) String menuCode, Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("replySeq", replySeq);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        replyService.deleteReply(params);
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);

        String returnUrl = "";
        if(communityType.equals("shop")){
            returnUrl = "redirect:"+appProperties.getHost()+"/community/"+communitySeq+"?type=shop";	//상점 커뮤니티
        }else {
            returnUrl = "redirect:"+appProperties.getHost()+"/community"+communitySeq+"?type=region";	//지역 커뮤니티
        }

        return returnUrl;
    }
}
