package com.stoneitgt.sogongja.admin.mapper;

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
	List<Map<String, Object>> getServiceMatchingList(Map<String, Object> params, RowBounds rowBounds);


	User getUserInfo(int userSeq);

	int existedUserId(String id);

	int existedUserNickName(String nickName);
	int existedUserNickNameWithoutMe(Map<String, Object> params);


	int saveUser(User user);

	int deleteUser(Map<String, Object> params);

	int selectTotalRecords();
}
