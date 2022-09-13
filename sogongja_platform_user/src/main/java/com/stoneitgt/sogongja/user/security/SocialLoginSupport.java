package com.stoneitgt.sogongja.user.security;

import com.stoneitgt.sogongja.user.properties.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.math.BigInteger;
import java.security.SecureRandom;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SocialLoginSupport {

    private final AppProperties appProperties;

    public String getSocialOauthUrl(String redirectUri, String state) {
        /*if (accountJoinType.isGoogle()) {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(appProperties.getGoogleRequestTokenUri())
                    .queryParam("client_id", appProperties.getGoogleClientId())
                    .queryParam("scope", "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("response_type", "code")
                    .queryParam("state", state);
            return builder.toUriString();
        } else if (accountJoinType.isNaver()) {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(appProperties.getNaverRequestTokenUri())
                    .queryParam("client_id", appProperties.getNaverClientId())
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("response_type", "code")
                    .queryParam("state", state);
            return builder.toUriString();
        } else if (accountJoinType.isKakao()) {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(appProperties.getKakaoRequestTokenUri())
                    .queryParam("client_id", appProperties.getKakaoClientId())
                    .queryParam("redirect_uri", redirectUri)
                    .queryParam("response_type", "code")
                    .queryParam("state", state);
            return builder.toUriString();
        }
        return null;

         */

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(appProperties.getKakaoRequestTokenUri())
                .queryParam("client_id", appProperties.getKakaoClientId())
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("state", state);
        return builder.toUriString();
    }

    public void setSocialOauthUrl(HttpServletRequest request, Model model) {
        String state = generateState();
        request.getSession().setAttribute("state", state);

        //model.addAttribute("oauthUrlForGoogle", getSocialOauthUrl(appProperties.getHost() + "/login/google", state));
        //model.addAttribute("oauthUrlForNaver", getSocialOauthUrl(appProperties.getHost() + "/login/naver/", state));
        model.addAttribute("oauthUrlForKakao", getSocialOauthUrl(appProperties.getHost()+"/login/kakao", state));
        System.out.println("oauthUrlForKakao :: "+getSocialOauthUrl(appProperties.getHost()+"/login/kakao", state));

    }

    public static String generateState() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }
}

