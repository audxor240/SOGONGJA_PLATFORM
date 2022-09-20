package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.service.MailService;
import com.stoneitgt.sogongja.user.service.UserService;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @Autowired
    private UserService userService;

    @PostMapping("/mail/sendCode")
    @ResponseBody
    public JSONObject execMail(@RequestBody Map<String, Object> params) {
        JSONObject jsonObject = new JSONObject();

        String code = UUID.randomUUID().toString();

        User user = userService.getFindPwUserInfo((String) params.get("id"), (String) params.get("email"));
        if(user == null){
            jsonObject.put("message", "notMatching");
            return jsonObject;
        }

        //메일 보내기
        mailService.mailSend((String) params.get("id"), (String) params.get("email"), code);

        jsonObject.put("message", "success");
        jsonObject.put("code", code);
        return jsonObject;
    }

}
