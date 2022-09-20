package com.stoneitgt.sogongja.user.service;

import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MailService {

    private JavaMailSender javaMailSender;
    private static final String FROM_ADDRESS = "audxor34@gmail.com";


    public void mailSend(String id, String email, String code){

        //
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("audxor34@gmail.com");
        message.setTo(email);
        message.setSubject("소공자[안내] 비밀번호 재설정");
        message.setText("인증 코드 : "+code);
        javaMailSender.send(message);
    }

}
