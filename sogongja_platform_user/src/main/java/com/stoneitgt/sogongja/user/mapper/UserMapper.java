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

	int existedUserEmail(String email);

	int saveUser(User user);

	int updatePassword(User user);

	int deleteUser(int userSeq);

	int withdrawUser(int userSeq);

	String findUserId(User user);

	Integer findUserPassword(User user);

	void updateUserTypeAndSubType(User user);

	List<Map<String, Object>> getQnaList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getLikeEducationList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getRecommendEducationList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getLikeConsultingList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getRecommendConsultingList(Map<String, Object> params, RowBounds rowBounds);
	int selectTotalRecords();

	void deleteAllEducationBookmark(int userSeq);
	void deleteAllEducationWatching(int userSeq);
	void deleteAllConsultingBookmark(int userSeq);
	void deleteAllConsultingWatching(int userSeq);
	void deleteAllQna(int userSeq, int boardSettingSeq);
	void deleteAllCommunity(int userSeq);
	void deleteAllReply(int userSeq);
	void deleteAllUserSurvey(int userSeq);
	void deleteAllUserQuestion(int userSeq);
	void deleteAllUserAnswer1(int userSeq);
	void deleteAllUserAnswer2(int userSeq);
	void deleteAllUserKeyword(int userSeq);
}
