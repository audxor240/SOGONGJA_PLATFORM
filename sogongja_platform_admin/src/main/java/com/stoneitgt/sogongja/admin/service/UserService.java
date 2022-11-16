package com.stoneitgt.sogongja.admin.service;

import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.domain.BoardSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.mapper.UserMapper;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private PasswordEncoder passwEncoder;

	@Autowired
	private BoardMapper boardMapper;

	@Override
	public User loadUserByUsername(String id) throws UsernameNotFoundException {
		return userMapper.findByUserId(id);
	}

	public int updateLastLoginDate(int userSeq) {
		return userMapper.updateLastLoginDate(userSeq);
	}

	public List<Map<String, Object>> getUserList(Map<String, Object> params) {
		return userMapper.getUserList(params);
	}

	public List<Map<String, Object>> getUserList(Map<String, Object> params, Paging paging) {
		return userMapper.getUserList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getServiceMatchingList(Map<String, Object> params, Paging paging) {
		return userMapper.getServiceMatchingList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return userMapper.selectTotalRecords();
	}

	public User getUserInfo(int userSeq) {
		User user = userMapper.getUserInfo(userSeq);
		if (StringUtil.isNotBlank(user.getBirthDay())) {
			user.setBirthDay(StoneUtil.dateToFormatString(user.getBirthDay()));
		}
		return user;
	}

	public int existedUserId(String id) {
		return userMapper.existedUserId(id);
	}

	public int existedUserNickName(String nickName) {
		return userMapper.existedUserNickName(nickName);
	}

	public int existedUserNickNameWithoutMe(Map<String, Object> params) {
		return userMapper.existedUserNickNameWithoutMe(params);
	}

	public int saveUser(User user) {
		if (StringUtil.isNotBlank(user.getPassword())) {
			user.setPassword(passwEncoder.encode(user.getPassword()));
		}
		if (StringUtil.isNotBlank(user.getBirthDay())) {
			user.setBirthDay(user.getBirthDay().replaceAll("[^0-9]", ""));
		}
		return userMapper.saveUser(user);
	}

	public void deleteUser(Map<String, Object> params) {

		//교육/컨설팅 관심, 수강완료 삭제
		userMapper.deleteAllEducationBookmark(params);
		userMapper.deleteAllEducationWatching(params);
		userMapper.deleteAllConsultingBookmark(params);
		userMapper.deleteAllConsultingWatching(params);

		//문의글 삭제
		BoardSetting boardSetting = boardMapper.getboardSettingQnaInfo();	//게시판관리의 QNA시퀀스 조회
		params.put("boardSettingSeq",boardSetting.getBoardSettingSeq());
		userMapper.deleteAllQna(params);

		//상점 커뮤니티, 지역 커뮤니티 글,댓글 삭제
		userMapper.deleteAllCommunity(params);
		userMapper.deleteAllReply(params);

		//설문지 삭제
		userMapper.deleteAllUserSurvey(params);
		userMapper.deleteAllUserQuestion(params);
		userMapper.deleteAllUserAnswer1(params);
		userMapper.deleteAllUserAnswer2(params);
		userMapper.deleteAllUserKeyword(params);
		
		userMapper.deleteUser(params);
	}

}
