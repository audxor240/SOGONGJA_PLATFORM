package com.stoneitgt.sogongja.user.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.mapper.UserMapper;
import com.stoneitgt.util.StringUtil;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

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

	public User getUserInfo(int userSeq) {
		User user = userMapper.getUserInfo(userSeq);
		user.setPassword("");
		return user;
	}

	public int existedUserId(String id) {
		return userMapper.existedUserId(id);
	}

	public int saveUser(User user) {
		if (StringUtil.isNotBlank(user.getPassword())) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		}
		if (StringUtil.isNotBlank(user.getBirthDay())) {
			user.setBirthDay(user.getBirthDay().replaceAll("[^0-9]", ""));
		}

		if (user.getCategoryList() != null && user.getCategoryList().size() > 0) {
			user.setCategory(String.join(",", user.getCategoryList()));
		}
		return userMapper.saveUser(user);
	}

	public int updatePassword(User user) {
		user.setNewPassword(passwordEncoder.encode(user.getNewPassword()));
		return userMapper.updatePassword(user);
	}

	public int deleteUser(Map<String, Object> params) {
		return userMapper.deleteUser(params);
	}

	public boolean isCorrectPassword(int userSeq, String currentPassword) {
		String password = userMapper.getUserPassword(userSeq);
		if (StringUtil.isBlank(password) || !passwordEncoder.matches(currentPassword, password)) {
			return false;
		}
		return true;
	}

	public int withdrawUser(int userSeq) {
		int cnt = userMapper.withdrawUser(userSeq);
		return cnt;
	}

	public String findUserId(User user) {
		return userMapper.findUserId(user);
	}

	public int findUserPassword(User user) {
		Integer userSeq = userMapper.findUserPassword(user);
		if (userSeq == null) {
			userSeq = 0;
		}
		return userSeq.intValue();
	}

}
