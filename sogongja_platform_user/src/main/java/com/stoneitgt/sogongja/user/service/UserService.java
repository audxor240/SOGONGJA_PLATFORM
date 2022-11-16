package com.stoneitgt.sogongja.user.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.config.DataSourceConfig;
import com.stoneitgt.sogongja.user.controller.SurveyService;
import com.stoneitgt.sogongja.user.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.UserMapper;
import com.stoneitgt.util.StringUtil;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private SurveyService surveyService;

	@Autowired
	private BoardMapper boardMapper;

	@Override
	public User loadUserByUsername(String id) throws UsernameNotFoundException {
		System.out.println("loadUserByUsername !!!!!!!!!!!!!!!!!!!!! ");
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

	public User getUserInfo(String email) {
		User user = userMapper.getUserInfo2(email);
		return user;
	}

	public User getFindPwUserInfo(String email) {
		User user = userMapper.getFindPwUserInfo(email);
		return user;
	}

	public int existedUserId(String id) {
		return userMapper.existedUserId(id);
	}

	public int existedUserNickName(String nickName) {
		return userMapper.existedUserNickName(nickName);
	}

	public int existedUserEmail(String email) {
		return userMapper.existedUserEmail(email);
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

	/*public int deleteUser(Map<String, Object> params) {
		return userMapper.deleteUser(params);
	}*/

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

	public User socialID_check(String uniqueId,String type){
		return userMapper.findByUserId(uniqueId);
	}

	@Transactional
	public void saveUserSurvey(UserSurvey userSurvey, List<Map<String, Object>> questionList){

		int loginUserSeq = userSurvey.getLoginUserSeq();

		if(userSurvey.getUserSurveySeq() != 0){
			//기존 설문지 내용 전체 삭제
			surveyService.deleteAllSurvey(loginUserSeq);
		}


		surveyService.insertUserSurvey(userSurvey);		//사용자 설문 insert

		for(int i =0 ; i < questionList.size();i++){

			Map<String, Object> List = questionList.get(i);
			UserQuestion userQuestion = new UserQuestion();

			Integer questionSettingSeq = Integer.parseInt((String) List.get("questionSettingSeq"));
			List<String> category3Arr = (java.util.List<String>) List.get("category3Arr");
			List<String> addressArr = (java.util.List<String>) List.get("addressArr");
			List<List<String>> keywordArr = (java.util.List<java.util.List<String>>) List.get("keywordArr");
			List<List<String>> keyworSeqdArr = (java.util.List<java.util.List<String>>) List.get("keywordSeqArr");
			List<String> rankArr = (java.util.List<String>) List.get("rankArr");
			List<String> answerArr = (java.util.List<String>) List.get("answerArr");
			List<List<String>> category2Arr = (java.util.List<java.util.List<String>>) List.get("category2Arr");
			List<List<String>> answerSeqArr = (java.util.List<java.util.List<String>>) List.get("answerSeqArr");

			userQuestion.setUserSurveySeq(userSurvey.getUserSurveySeq());
			userQuestion.setQuestionSettingSeq(questionSettingSeq);
			userQuestion.setLoginUserSeq(loginUserSeq);

			surveyService.insertUserQuestion(userQuestion);		// 사용자 질문 insert

			//추가형[업종] 답변 추가
			if(category3Arr != null) {
				for (int j = 0; j < category3Arr.size(); j++) {
					UserAnswer1 userAnswer1 = new UserAnswer1();
					int category3 = Integer.parseInt(category3Arr.get(j));

					userAnswer1.setLoginUserSeq(loginUserSeq);
					userAnswer1.setCategory3Seq(category3);
					userAnswer1.setAddress(null);
					userAnswer1.setUserQuestionSeq(userQuestion.getUserQuestionSeq());

					if(rankArr != null){
						int rank = Integer.parseInt(rankArr.get(j));
						userAnswer1.setRank(rank);
					}else{
						userAnswer1.setRank(0);
					}

					userAnswer1.setType(1);	//업종 : 1, 주소 : 2

					surveyService.insertUserAnswer1(userAnswer1);	//업종 insert
				}
			}

			//추가형[주소] 답변 추가
			if(addressArr != null){
				for(int p = 0;p < addressArr.size();p++){
					UserAnswer1 userAnswer1 = new UserAnswer1();
					String address = addressArr.get(p);

					userAnswer1.setLoginUserSeq(loginUserSeq);
					userAnswer1.setCategory3Seq(0);
					userAnswer1.setAddress(address);
					userAnswer1.setUserQuestionSeq(userQuestion.getUserQuestionSeq());

					List<String> keyword_array = keywordArr.get(p);	//키워드
					List<String> keyword_seq_array = keyworSeqdArr.get(p);	//키워드 시퀀스

					if(rankArr != null){
						int rank = Integer.parseInt(rankArr.get(p));
						userAnswer1.setRank(rank);
					}else{
						userAnswer1.setRank(0);
					}

					userAnswer1.setType(2);	//업종 : 1, 주소 : 2
					surveyService.insertUserAnswer1(userAnswer1);	//주소 insert

					for(int k =0 ; k < keyword_array.size(); k++){
						UserKeyword userKeyword = new UserKeyword();
						String keyword = keyword_array.get(k);
						int keywordSeq = Integer.parseInt(keyword_seq_array.get(k));

						userKeyword.setLoginUserSeq(loginUserSeq);
						userKeyword.setUserAnswer1Seq(userAnswer1.getUserAnswer1Seq());
						userKeyword.setQuestionSettingKeywordSeq(keywordSeq);
						userKeyword.setKeyword(keyword);
						surveyService.insertUserKeyword(userKeyword);	//키워드 insert

					}
				}
			}

			//선택형 답변 추가
			if(answerArr != null){
				//답변 루프
				for(int h =0; h < answerArr.size();h++){
					UserAnswer2 userAnswer2 = new UserAnswer2();
					String answer = answerArr.get(h);
					userAnswer2.setLoginUserSeq(loginUserSeq);
					userAnswer2.setAnswer(answer);										//답변
					userAnswer2.setUserQuestionSeq(userQuestion.getUserQuestionSeq());	//질문 시퀀스


					if(rankArr != null){
						int rank = Integer.parseInt(rankArr.get(h));
						userAnswer2.setRank(rank);
					}else{
						userAnswer2.setRank(0);
					}

					List<String> cate2Arr = category2Arr.get(h);	//카테고리2 시퀀스
					List<String> an_Arr = answerSeqArr.get(h);	//답변 시퀀스
					//카테고리2 루프
					for(int n=0;n < cate2Arr.size();n++){
						int category2 = Integer.parseInt(cate2Arr.get(n));
						int answerSeq = Integer.parseInt(an_Arr.get(n));
						userAnswer2.setCategory2Seq(category2);
						userAnswer2.setAnswerSeq(answerSeq);
						surveyService.insertUserAnswer2(userAnswer2);	//선택형 insert
					}
				}
			}
		}
	}

	public UserSurvey getUserSurvey(int userSeq){

		return surveyService.getUserSurvey(userSeq);
	}

	public void updateUserTypeAndSubType(User user){
		userMapper.updateUserTypeAndSubType(user);
	}

	public List<Map<String, Object>> getQnaList(Map<String, Object> params, Paging paging) {
		return userMapper.getQnaList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return userMapper.selectTotalRecords();
	}

	public List<Map<String, Object>> getLikeEducationList(Map<String, Object> params, Paging paging) {
		return userMapper.getLikeEducationList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getRecommendEducationList(Map<String, Object> params, Paging paging) {
		return userMapper.getRecommendEducationList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getLikeConsultingList(Map<String, Object> params, Paging paging) {
		return userMapper.getLikeConsultingList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getRecommendConsultingList(Map<String, Object> params, Paging paging) {
		return userMapper.getRecommendConsultingList(params, paging.getPaging());
	}

	@Transactional
	public void deleteUser(int userSeq){

		//교육/컨설팅 관심, 수강완료 삭제
		userMapper.deleteAllEducationBookmark(userSeq);
		userMapper.deleteAllEducationWatching(userSeq);
		userMapper.deleteAllConsultingBookmark(userSeq);
		userMapper.deleteAllConsultingWatching(userSeq);

		//문의글 삭제
		BoardSetting boardSetting = boardMapper.getboardSettingQnaInfo();	//게시판관리의 QNA시퀀스 조회
		userMapper.deleteAllQna(userSeq, boardSetting.getBoardSettingSeq());

		//상점 커뮤니티, 지역 커뮤니티 글,댓글 삭제
		userMapper.deleteAllCommunity(userSeq);
		userMapper.deleteAllReply(userSeq);

		//설문지 삭제
		userMapper.deleteAllUserSurvey(userSeq);
		userMapper.deleteAllUserQuestion(userSeq);
		userMapper.deleteAllUserAnswer1(userSeq);
		userMapper.deleteAllUserAnswer2(userSeq);
		userMapper.deleteAllUserKeyword(userSeq);
		//회원 삭제
		userMapper.deleteUser(userSeq);
	}
}

