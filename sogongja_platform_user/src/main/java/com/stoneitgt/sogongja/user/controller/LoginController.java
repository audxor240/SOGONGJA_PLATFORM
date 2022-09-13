package com.stoneitgt.sogongja.user.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.HttpClient;
import com.stoneitgt.common.HttpResult;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.security.AuthSuccessHandler;
import com.stoneitgt.sogongja.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final AppProperties appProperties;
    private final UserService userService;

    private AuthenticationManager authenticationManager;

    private AuthSuccessHandler authSuccessHandler;

    @GetMapping("/kakao")
    public String loginByKakao(@RequestParam("code") String token, HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) throws UnsupportedEncodingException {

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

        User user = userService.socialID_check(uniqueId,"KAKAO");

        if(user == null){
            return "redirect:/signup/agree?type=KAKAO&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        }else{

            List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
            grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
            user.setAuthorities(grantedAuthorityList);

            Authentication authentication = new UsernamePasswordAuthenticationToken(user,"thrhdwk1!",user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);   //세션에 저장
            response.setStatus(HttpServletResponse.SC_OK);

            return "redirect:/";
        }

        //return "redirect:/signup/agree?type=KAKAO&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        //System.out.println("user.getId() :: "+user.getId());


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
