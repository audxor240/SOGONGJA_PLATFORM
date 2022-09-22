package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.properties.AppProperties;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
@AllArgsConstructor
public class MailService {

    private JavaMailSender jms;
    //private static final String FROM_ADDRESS = "audxor34@gmail.com";
    private final AppProperties appProperties;


    public void mailSend(String id, String email, String code){
        System.out.println("appProperties.getEmailAddress() :: "+appProperties.getEmailAddress());
        String content = new StringBuilder()
                .append("<div style=\"width: 100%; height: 100%;  text-align: center;\">")
                .append("<div style=\"width: 100%; max-width: 600px; height: auto; border: 2px solid #d5d5d5; border-radius: 10px; margin: 0 auto; padding: 20px;\">")
                .append("<div style=\"width: 100%; max-width: 153px; margin: 0 auto; margin-top: 30px; margin-bottom: 20px;\"><img src=\"/images/new/email/img_logo2.png\" alt=\"main logo\" style=\" width: 100%;\"></div>")
                .append("<h2 style=\"margin-bottom: 20px;\">비밀번호를 재설정 해주세요!</h2>")
                .append("<p style=\"margin-bottom: 20px;\">안녕하세요.<span style=\"font-weight: 700;\">")
                .append(email)
                .append("</span>님 <br>회원님의 계정 비밀번호 변경을 위해 <br>아래 비밀번호 재설정 버튼을 눌러주세요.<br>재설정하지 않으면 기존 비밀번호가 유지됩니다.</p>")
                .append("<span style=\"margin-bottom: 20px; font-size: 14px;\">* 본인이 보낸 메일이 아닌 경우 <br>고객센터로 문의해주세요.</span>")
                .append("<a href=\"")
                .append(appProperties.getHost())
                .append("/login/find/pw/comeback?email=")
                .append(email)
                .append("&emailtoken=")
                .append(code)
                .append("\" style=\"text-decoration: none;\">")
                .append("<div style=\"width: 100%; max-width: 200px; line-height: 50px; display: block; margin: 30px auto; font-size: 20px; font-weight: 700; color: #fff; background-color: #1001d9;\">비밀번호 재설정</div></a>")
                .append("</div><p> 이 메일은 발신전용으로 회신되지 않습니다. 더 궁금하신 사항은 고객센터로 문의 부탁드립니다.</p></div>")
                .toString();

        String title = "[안내] 소공자 비밀번호 재설정 이메일입니다.";
        MailThread thread = new MailThread(jms, appProperties.getEmailAddress(), email, title, content);
        thread.start();
    }

    @RequiredArgsConstructor
    private class MailThread extends Thread {

        private final JavaMailSender jms;
        private final String from;
        private final String to;
        private final String title;
        private final String contents;

        @Override
        public void run() {
            super.run();
            try {
                MimeMessage message = jms.createMimeMessage();
                message.setHeader("Content-Type", "text/html; charset=UTF-8");
                message.setContent(contents, "text/html; charset=UTF-8");

                MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
                helper.setFrom(from);
                helper.setTo(to);
                helper.setSubject(title);

                jms.send(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
