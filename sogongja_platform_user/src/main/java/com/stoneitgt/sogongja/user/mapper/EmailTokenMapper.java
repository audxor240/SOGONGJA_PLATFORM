package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.EmailToken;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailTokenMapper {

    EmailToken getEmailToken(String token, String email);

    int addEmailToken(String token, String email);

    int deleteEmailToken(String token, String email);
}
