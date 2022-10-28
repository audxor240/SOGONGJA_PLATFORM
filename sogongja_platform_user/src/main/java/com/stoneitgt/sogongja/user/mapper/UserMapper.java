package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.User;

@Mapper
public interface UserMapper {

	User findByUserId(String userId);

	int updateLastLoginDate(int userSeq);

	List<Map<String, Object>> getUserMenuList(String auth);

	List<Map<String, Object>> getUserList(Map<String, Object> params);

	List<Map<String, Object>> getUserList(Map<String, Object> params, RowBounds rowBounds);

	User getUserInfo(int userSeq);

	User getUserInfo(String userId);

	User getUserInfo2(String email);

	User getFindPwUserInfo(String email);

	String getUserPassword(int userSeq);

	int existedUserId(String id);

	int existedUserNickName(String nickName);

	int saveUser(User user);

	int updatePassword(User user);

	int deleteUser(Map<String, Object> params);

	int withdrawUser(int userSeq);

	String findUserId(User user);

	Integer findUserPassword(User user);

	void updateUserTypeAndSubType(User user);
}
