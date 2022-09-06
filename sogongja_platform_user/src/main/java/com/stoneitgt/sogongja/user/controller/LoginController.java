package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.HttpClient;
import com.stoneitgt.common.HttpResult;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Slf4j
@Controller
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final AppProperties appProperties;

    @GetMapping("/kakao")
    public String loginByKakao(@RequestParam("code") String token, HttpServletRequest request, RedirectAttributes redirectAttributes) throws UnsupportedEncodingException {
        String clientId = appProperties.getKakaoClientId();
        String redirectUri = appProperties.getHost() + "/login/kakao";
        HttpResult result = HttpClient.post(appProperties.getKakaoAccessTokenUri(), "grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + token);
        JSONObject tokenObject = JSONObject.fromObject(result.getData());
        String authKey = "Bearer " + tokenObject.getString("access_token");

        HttpResult objects = HttpClient.getWithAuthorize(appProperties.getKakaoApiUri() + "/user/me", authKey);

        JSONObject resultObject = JSONObject.fromObject(objects.getData());


        String uniqueId = resultObject.getString("id");
        String email = resultObject.getJSONObject("kakao_account").getString("email");
        String name = URLEncoder.encode(resultObject.getJSONObject("properties").getString("nickname"), "UTF-8");

        return "redirect:/signup/agree?type=KAKAO&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        /*
        if (accountSerivce.checkJoin(AccountJoinType.KAKAO, uniqueId)) {
            accountSerivce.setAuthentication(AccountJoinType.KAKAO, uniqueId);
            return "redirect:/";
        } else {
            if (accountSerivce.findByEmailToF(email)) {
                return "redirect:/login/email/already?email=" + email;
            } else {
                try {
                    String name = URLEncoder.encode(RandomStringUtils.randomAlphanumeric(10), "UTF-8");
                    try {
                        name = URLEncoder.encode(resultObject.getJSONObject("properties").getString("nickname"), "UTF-8");
                    } catch (JSONException e) {
                        System.out.println("unaccessible account");
                    }
                    return "redirect:/join/oauth2/term?type=" + AccountJoinType.KAKAO + "&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
                } catch (UnsupportedEncodingException e1) {
                    return "redirect:/";
                }
            }
        }
         */
    }
}
