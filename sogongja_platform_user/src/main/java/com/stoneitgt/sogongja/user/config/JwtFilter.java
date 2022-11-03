package com.stoneitgt.sogongja.user.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.mapper.UserMapper;
import com.stoneitgt.sogongja.user.properties.AppProperties;
import com.stoneitgt.sogongja.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JwtFilter extends OncePerRequestFilter {

    private AppProperties app;
    private UserMapper userMapper;
    public JwtFilter(AppProperties appProperties, UserMapper userMapper) {
        this.app = appProperties;
        this.userMapper = userMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("Enter JwtFilter");

        Cookie[] cookies = request.getCookies();
        String jwt = null;
        if(cookies!=null) {
            for (Cookie c : cookies) {
                String name = c.getName(); // 쿠키 이름 가져오기
                if (name.equals("obscure-remember-me")) {
                    jwt = c.getValue();
                    break;
                }
            }
        }

        if (jwt != null) {
            try {
                String key = JWT.require(Algorithm.HMAC512(app.getJwtSecret())).build().verify(jwt)
                        .getClaim("key").asString();
                System.out.println(key);
                User user = userMapper.findByUserId(key);

                List<GrantedAuthority> grantedAuthorityList = new ArrayList<>();
                grantedAuthorityList.add(new SimpleGrantedAuthority("ROLE_USER"));
                user.setAuthorities(grantedAuthorityList);

                Authentication authentication = new UsernamePasswordAuthenticationToken(user,"thrhdwk1!",user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);   //세션에 저장
            } catch (RuntimeException e) {
                System.out.println("Token expired and requires re-login.");
                Cookie remove = new Cookie("obscure-remember-me", null);
                remove.setMaxAge(0);
                response.addCookie(remove);
            }

        }


        filterChain.doFilter(request, response);

    }
}
