package com.stoneitgt.sogongja.admin.config;

import org.springframework.security.web.authentication.WebAuthenticationDetails;

import javax.servlet.http.HttpServletRequest;

public class FormWebAuthenticationDetails extends WebAuthenticationDetails {

    private boolean remember;

    public FormWebAuthenticationDetails(HttpServletRequest request) {
        super(request);
        remember = Boolean.parseBoolean(request.getParameter("remember-me"));
    }
    public boolean getRemember() {
        return remember;}
}
