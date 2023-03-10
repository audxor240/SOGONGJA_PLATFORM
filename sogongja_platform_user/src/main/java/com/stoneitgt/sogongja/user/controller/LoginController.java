package com.stoneitgt.sogongja.user.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.HttpClient;
import com.stoneitgt.common.HttpResult;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.EmailToken;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.security.AuthSuccessHandler;
import com.stoneitgt.sogongja.user.service.BoardService;
import com.stoneitgt.sogongja.user.service.MailService;
import com.stoneitgt.sogongja.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final AppProperties appProperties;
    private final UserService userService;

    private final BoardService boardService;

    private AuthenticationManager authenticationManager;

    private AuthSuccessHandler authSuccessHandler;

    private final MailService mailService;

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();


    @GetMapping("/kakao")
    public String loginByKakao(HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes,
                               @RequestParam("code") String token, @RequestParam("state") String state) throws IOException, ServletException {

        String clientId = appProperties.getKakaoClientId();
        String redirectUri = appProperties.getHost() + "/login/kakao";
        HttpResult result = HttpClient.post(appProperties.getKakaoAccessTokenUri(), "grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri + "&code=" + token);
        JSONObject tokenObject = JSONObject.fromObject(result.getData());
        String authKey = "Bearer " + tokenObject.getString("access_token");

        HttpResult objects = HttpClient.getWithAuthorize(appProperties.getKakaoApiUri() + "/user/me", authKey);
        System.out.println(objects.getData());
        JSONObject resultObject = JSONObject.fromObject(objects.getData());


        String uniqueId = resultObject.getString("id");
        String email = resultObject.getJSONObject("kakao_account").getString("email");
        String name = URLEncoder.encode(resultObject.getJSONObject("properties").getString("nickname"), "UTF-8");

        User user = userService.socialID_check(uniqueId,"KAKAO");

        if(user == null){
            return "redirect:"+appProperties.getHost()+"/signup/agree?type=KAKAO&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        }else{

            if (state.contains("_true")) {
                String jwtToken = JWT.create()
                        .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(appProperties.getJwtLimit())))
                        .withClaim("key", user.getId())
                        .sign(Algorithm.HMAC512(appProperties.getJwtSecret()));

                Cookie myCookie = new Cookie("obscure-remember-me", jwtToken);
                myCookie.setPath("/");
                myCookie.setMaxAge(Integer.parseInt(appProperties.getJwtLimit()));  // 7????????? ??????
                response.addCookie(myCookie);
            }

            List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
            grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
            user.setAuthorities(grantedAuthorityList);

            Authentication authentication = new UsernamePasswordAuthenticationToken(user,"thrhdwk1!",user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);   //????????? ??????
            response.setStatus(HttpServletResponse.SC_OK);


            return "redirect:"+appProperties.getHost();
        }
    }

    @GetMapping("/google")
    public String loginByGoogle(@RequestParam("code") String token, @RequestParam("state") String state,
                                HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) throws UnsupportedEncodingException {

        String clientId = appProperties.getGoogleClientId();
        String clientSecret = appProperties.getGoogleClientSecret();
        String redirectUri = appProperties.getHost() + "/login/google";

        // ????????? ????????? ?????????
        HttpResult result = HttpClient.post(appProperties.getGoogleAccessTokenUri(), "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=" + redirectUri + "&code=" + token + "&grant_type=authorization_code");

        JSONObject tokenObj = JSONObject.fromObject(result.getData());
        String authKey = "Bearer " + tokenObj.getString("access_token");

        // ???????????? ????????? ????????? ?????????
        HttpResult objects = HttpClient.getWithAuthorize(appProperties.getGoogleApiUri() + "/userinfo", authKey);
        JSONObject resultObject = JSONObject.fromObject(objects.getData()); // ????????? ??????

        String uniqueId = resultObject.getString("sub");
        String email = resultObject.getString("email");

        //String name = resultObject.getString("name");
        String name = URLEncoder.encode(resultObject.getString("name"), "UTF-8");

        User user = userService.socialID_check(uniqueId,"GOOGLE");

        if(user == null){
            return "redirect:"+appProperties.getHost()+"/signup/agree?type=GOOGLE&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        }else{

            if (state.contains("_true")) {
                String jwtToken = JWT.create()
                        .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(appProperties.getJwtLimit())))
                        .withClaim("key", user.getId())
                        .sign(Algorithm.HMAC512(appProperties.getJwtSecret()));

                Cookie myCookie = new Cookie("obscure-remember-me", jwtToken);
                myCookie.setPath("/");
                myCookie.setMaxAge(Integer.parseInt(appProperties.getJwtLimit()));  // 7????????? ??????
                response.addCookie(myCookie);
            }

            List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
            grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
            user.setAuthorities(grantedAuthorityList);

            Authentication authentication = new UsernamePasswordAuthenticationToken(user,"thrhdwk1!",user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);   //????????? ??????
            response.setStatus(HttpServletResponse.SC_OK);

            return "redirect:"+appProperties.getHost();
        }

    }

    @GetMapping("/naver")
    public String loginByNaver(@RequestParam("code") String token, @RequestParam("state") String state
            , HttpServletRequest request, HttpServletResponse response, RedirectAttributes redirectAttributes) throws UnsupportedEncodingException {
        String clientId = appProperties.getNaverClientId();
        String clientSecret = appProperties.getNaverClientSecret();
        String redirectUri = appProperties.getHost() + "/login/naver";
        System.out.println(":::state:::" + state);

        HttpResult result = HttpClient.post(appProperties.getNaverAccessTokenUri(),
                "grant_type=authorization_code&client_id=" + clientId + "&client_secret=" + clientSecret +
                        "&code=" + token + "&state=" + state);
        JSONObject tokenObject = JSONObject.fromObject(result.getData());

        String authKey = "Bearer ";
        try {
            authKey += tokenObject.getString("access_token");
        } catch (JSONException e) {
            return "redirect:"+appProperties.getHost();
        }

        HttpResult objects = HttpClient.getWithAuthorize(appProperties.getNaverApiUri() + "/nid/me", authKey);

        JSONObject resultObject = JSONObject.fromObject(objects.getData()).getJSONObject("response");

        String uniqueId = resultObject.getString("id");
        String email = resultObject.getString("email");

        String name = URLEncoder.encode(resultObject.getString("name"), "UTF-8");

        User user = userService.socialID_check(uniqueId,"NAVER");

        if(user == null){
            return "redirect:"+appProperties.getHost()+"/signup/agree?type=NAVER&uniqueId=" + uniqueId + "&email=" + email + "&name=" + name;
        }else{

            if (state.contains("_true")) {
                String jwtToken = JWT.create()
                        .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(appProperties.getJwtLimit())))
                        .withClaim("key", user.getId())
                        .sign(Algorithm.HMAC512(appProperties.getJwtSecret()));

                Cookie myCookie = new Cookie("obscure-remember-me", jwtToken);
                myCookie.setPath("/");
                myCookie.setMaxAge(Integer.parseInt(appProperties.getJwtLimit()));  // 7????????? ??????
                response.addCookie(myCookie);
            }

            List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
            grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
            user.setAuthorities(grantedAuthorityList);

            Authentication authentication = new UsernamePasswordAuthenticationToken(user,"thrhdwk1!",user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);   //????????? ??????
            response.setStatus(HttpServletResponse.SC_OK);

            return "redirect:"+appProperties.getHost();
        }
    }

    // ??????????????? ???????????? ????????? ????????? ?????????
    @GetMapping("/find/pw/comeback")
    public String findPwComback(@RequestParam String email,
                                @RequestParam String emailtoken,
                                Model model) {

        EmailToken emailToken = mailService.checkEmailToken(emailtoken, email);
        if(emailToken == null){
            throw new RuntimeException("????????? ???????????????. ????????? ?????? ???????????????..");
        }

        //QNA????????? ????????? ??????
        BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

        model.addAttribute("qnaBoardSetting", qnaBoardSetting);
        model.addAttribute("email", email);
        model.addAttribute("token", emailtoken);

        return "pages/user/password_change";
    }
}
