package com.stoneitgt.sogongja.user.controller;

import java.io.IOException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.domain.BoardParameter;
import com.stoneitgt.sogongja.user.security.SocialLoginSupport;
import com.stoneitgt.sogongja.user.service.*;
import lombok.RequiredArgsConstructor;
import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.user.component.PasswordConstraintValidator;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

@Controller
@RequiredArgsConstructor
public class UserController extends BaseController {

	@Autowired
	private UserService userService;

	@Autowired
	private BoardService boardService;

	@Autowired
	private SurveyService surveyService;
	@Autowired
	private QuestionService questionService;
	@Autowired
	private AnswerSettingService answerSettingService;
	@Autowired
	private CategoryService categoryService;

	@Autowired
	private AnswerService answerService;
	private final SocialLoginSupport socialLoginSupport;

	@GetMapping("/signup")
	public String signup(Model model,HttpServletRequest request) {
		User user = new User();
		user.setUserType("I");
		socialLoginSupport.setSocialOauthUrl(request, model);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("user", user);
		model.addAttribute("bankList", getCodeList("BANK"));
		model.addAttribute("companyList", getCodeList("COMPANY"));
		model.addAttribute("positionList", getCodeList("POSITION"));
		return "pages/user/signup";
	}

	@PostMapping({ "/signup/register", "/mypage/update" })
	public String registerUser(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
			RedirectAttributes rttr, HttpServletRequest request) {
		System.out.println("user ----------- >> "+user);
		String category = user.getCategoryList().toString().substring(1);
		category = category.substring(0, category.length()-1);
		category = category.replaceAll("\\s", "");

		//return "pages/user/signup_result";

		// 회원가입인 경우에만
		if (user.getUserSeq() == 0) {

			//소셜 회원가입일 경우
			if(!user.getSocialType().equals("none")){
				if(user.getSocialType().equals("KAKAO")){
					user.setKakaoId(user.getUniqueId());
				}else if(user.getSocialType().equals("GOOGLE")){
					user.setGoogleId(user.getUniqueId());
				}else if(user.getSocialType().equals("NAVER")){
					user.setNaverId(user.getUniqueId());
				}
				//아이디는 uniqueId, 패스워드는 고정
				user.setId(user.getUniqueId());
				user.setPassword("thrhdwk1!");
				user.setPasswordConfirm("thrhdwk1!");
			}

			if (StringUtil.isBlank(user.getId())) {
				bindingResult.rejectValue("id", "field.required");
			} else {

				for (String id : GlobalConstant.BLACK_ID_LIST) {
					if (id.equalsIgnoreCase(user.getId())) {
						bindingResult.rejectValue("id", "id.black.pattern", new Object[] { id }, "");
						break;
					}
				}

				if (userService.existedUserId(user.getId()) > 0) {
					bindingResult.rejectValue("id", "member.id.exists");
				}
			}

			if (StringUtil.isBlank(user.getPassword())) {
				bindingResult.rejectValue("password", "field.required");
			}

			PasswordConstraintValidator passwordValidator = new PasswordConstraintValidator();

			RuleResult ruleResult = passwordValidator.validate(user.getPassword());
			if (!ruleResult.isValid()) {
				bindingResult.rejectValue("password", "password.illegal_match");
			}

			if (!user.getPassword().equals(user.getPasswordConfirm())) {
				bindingResult.rejectValue("passwordConfirm", "password.illegal_match_confirm");
			}
		} else {
			//user.setPassword("");
			if(user.getSocialType() == null) {
				if (!user.getPassword().equals("")) {
					PasswordConstraintValidator passwordValidator = new PasswordConstraintValidator();

					RuleResult ruleResult = passwordValidator.validate(user.getPassword());
					if (!ruleResult.isValid()) {
						bindingResult.rejectValue("password", "password.illegal_match");
					}
				}
			}
		}

		String hp = user.getHp1() + user.getHp2() + user.getHp3();

		if (!StoneUtil.isValidHp(hp)) {
			bindingResult.rejectValue("hp", "hp.illeal_match");
		}

//		String tel = user.getTel1() + user.getTel2() + user.getTel3();
//
//		if (!StoneUtil.isValidTelNo(tel)) {
//			bindingResult.rejectValue("tel", "tel.illeal_match");
//		}

		String email = user.getEmail1() + "@" + user.getEmail2();

		if (!StoneUtil.isValidEmail(email)) {
			bindingResult.rejectValue("email", "email.illeal_match");
		}
		if (bindingResult.hasErrors()) {
			model.addAttribute("category1", getCodeList("CATEGORY_1", ""));
			if (user.getUserSeq() == 0) {
				// 회원가입
				return "pages/user/signup_info";
			} else {
				// 회원정보변경
				return "pages/user/info";
			}
		}

		user.setHp(hp);
//		user.setTel(tel);
		user.setEmail(email);
		user.setAuth("AU02");
		user.setAge(user.getAgeGroup());
		user.setType01(user.getType01());
		user.setType02(user.getType02());
		user.setServiceType(category);

		if(user.getUserSeq() != 0){

			User user2 = userService.getUserInfo(user.getUserSeq());

			if(user2.getType() != null) {
				//이용자 유형을 변경했을 경우
				if (!user2.getType().equals(user.getType()) || !user2.getSubType().equals(user.getSubType())) {
					//모달창을 보여주기위한 구분 값
					model.addAttribute("typeCheck", "update");
				}
			}else{
				model.addAttribute("typeCheck", "update");
			}
			if(user.getSocialType() != null) {
				//소셜회원이면 본인 패스워드를 넣어준다
				user.setPassword(user2.getPassword());
			}
		}
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		System.out.println("user-----last >>> "+user);
		userService.saveUser(user);

		if (user.getUserSeq() == 0) {
			model.addAttribute("user", user);

			return "pages/user/signup_result";
		} else {
			request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);
			model.addAttribute("user", user);
			model.addAttribute("category1", getCodeList("CATEGORY_1", ""));
			//return "redirect:/mypage/info";
			return "pages/user/info";
		}

	}

	@PostMapping("/signup/completion")
	public String signupCompletion(@ModelAttribute("user") User user, Model model) {
		System.out.println("user --111--- "+user);
		int surveySettingSeq = 0;
		if(user.getType().equals("4")){
			surveySettingSeq = 7;
		}else{
			surveySettingSeq = Integer.parseInt(user.getSubType());
		}

		Survey survey = surveyService.getSurvey(surveySettingSeq);
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);
		model.addAttribute("survey", survey);

		return "pages/user/signup_completion";
	}

	@PostMapping("/user/surveyForm")
	public String surveyForm(@ModelAttribute("user") User user, Model model) {

		System.out.println("user >>>>>>>>>> :: "+user);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> category2List = categoryService.getCategory2List();
		List<Map<String, Object>> category3List = categoryService.getCategory3List();

		UserSurvey userSurvey = surveyService.getUserSurvey(user.getUserSeq());
		System.out.println("userSurvey :: "+userSurvey);
		if(userSurvey == null){
			model.addAttribute("userSurveySeq", 0);
		}else{
			model.addAttribute("userSurveySeq", userSurvey.getUserSurveySeq());
		}

		int surveySettingSeq = 0;
		if(user.getType().equals("4")){
			surveySettingSeq = 7;
		}else{
			surveySettingSeq = Integer.parseInt(user.getSubType());
		}

		List<Map<String, Object>> surveySubList = surveyService.getSurveySubList(surveySettingSeq);

		List<Integer> qSeqArr = new ArrayList<>();
		for (Map<String, Object> item:surveySubList) {
			qSeqArr.add((Integer) item.get("question_setting_seq"));
		}

		List<QuestionSetting> List = new ArrayList<>();
		List<String> viewList = new ArrayList<>();		//질문을 보여주기 위한 배열 정의
		List<List<String>> answerArrList = new ArrayList<>();
		List<List<Integer>> answerSeqList = new ArrayList<>();
		List<List<String>> category2SeqStrList = new ArrayList<>();
		List<List<String>> answerSeqStrList = new ArrayList<>();

		boolean firstView = false;
		// 추가된 질문 개수만큼 루프
		for(int i=0;i< qSeqArr.size();i++){
			int questionSettingSeq = qSeqArr.get(i);
			//질문 정보 조회
			QuestionSetting questionSetting = questionService.getQuestionSetting(questionSettingSeq);

			List<String> answerArr = new ArrayList<>();
			List<Integer> answerSeqArr = new ArrayList<>();
			List<String> category2SeqStr = new ArrayList<>();
			List<String> answerSeqStr = new ArrayList<>();
			//질문이 선택형이면
			if(questionSetting.getQuestionType().equals("choice")){
				//답변 정보 조회
				List<Map<String, Object>> listSub = answerSettingService.getAnswerSettingList(questionSetting.getQuestionSettingSeq());
				System.out.println("listSub :: "+listSub);

				//해당질문의 답변 배열에 저장
				for(int j =0; j < listSub.size();j++){
					//List<String> arr = new ArrayList<>();
					String answer = (String) listSub.get(j).get("answer");
					Integer answerSeq = (Integer) listSub.get(j).get("answer_setting_seq");
					String category2_seq = (String) listSub.get(j).get("g_seq");
					String answer_seq = (String) listSub.get(j).get("a_seq");

					answerArr.add(answer);
					answerSeqArr.add(answerSeq);
					category2SeqStr.add(category2_seq);
					answerSeqStr.add(answer_seq);
				}
				answerArrList.add(answerArr);
				answerSeqList.add(answerSeqArr);
				category2SeqStrList.add(category2SeqStr);
				answerSeqStrList.add(answerSeqStr);
			}else{
				answerArrList.add(null);
				answerSeqList.add(null);
				category2SeqStrList.add(null);
				answerSeqStrList.add(null);
			}

			if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 1 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//추가형[업종] 이고 순위 지정X
				viewList.add("1");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 1 && questionSetting.getRankChangeUse().equals("Y")){
				//추가형[업종] 이고 순위 지정O
				viewList.add("2");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//추가형[주소] 이고 순위 지정X
				viewList.add("3");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2 && questionSetting.getRankChangeUse().equals("Y")){
				//추가형[주소] 이고 순위 지정O
				viewList.add("4");
			}else if(questionSetting.getQuestionType().equals("choice") && questionSetting.getAnswerType() == 3 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//선택형 이고 순위 지정X
				viewList.add("5");
			}else if(questionSetting.getQuestionType().equals("choice") && questionSetting.getAnswerType() == 3 && questionSetting.getRankChangeUse().equals("Y")){
				//선택형 이고 순위 지정O
				viewList.add("6");
			}
			List.add(questionSetting);

		}
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);
		model.addAttribute("category1List", category1List);
		model.addAttribute("category2List", category2List);
		model.addAttribute("category3List", category3List);
		model.addAttribute("answerArrList", answerArrList);
		model.addAttribute("List", List);
		model.addAttribute("viewList", viewList);
		model.addAttribute("answerSeqList", answerSeqList);
		model.addAttribute("surveySettingSeq", surveySettingSeq);
		model.addAttribute("category2SeqStrList", category2SeqStrList);
		model.addAttribute("answerSeqStrList", answerSeqStrList);

		System.out.println("List :: "+List);

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/user/survey_form";
	}

	@PostMapping("/user/surveyModifyForm")
	public String surveyModifyForm(@ModelAttribute("user") User user, Model model) {

		System.out.println("user >>>>>>>>>> :: "+user);

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		List<Map<String, Object>> category1List = categoryService.getCategory1List();
		List<Map<String, Object>> category2List = categoryService.getCategory2List();
		List<Map<String, Object>> category3List = categoryService.getCategory3List();

		UserSurvey userSurvey = surveyService.getUserSurvey(user.getUserSeq());
		System.out.println("userSurvey :: "+userSurvey);
		if(userSurvey == null){
			model.addAttribute("userSurveySeq", 0);
		}else{
			model.addAttribute("userSurveySeq", userSurvey.getUserSurveySeq());
		}

		int surveySettingSeq = 0;
		if(user.getType().equals("4")){
			surveySettingSeq = 7;
		}else{
			surveySettingSeq = Integer.parseInt(user.getSubType());
		}

		List<Map<String, Object>> surveySubList = surveyService.getSurveySubList(surveySettingSeq);

		List<Integer> qSeqArr = new ArrayList<>();
		for (Map<String, Object> item:surveySubList) {
			qSeqArr.add((Integer) item.get("question_setting_seq"));
		}

		List<QuestionSetting> List = new ArrayList<>();
		List<String> viewList = new ArrayList<>();		//질문을 보여주기 위한 배열 정의
		List<List<String>> answerArrList = new ArrayList<>();
		List<List<Integer>> answerSeqList = new ArrayList<>();
		List<List<String>> category2SeqStrList = new ArrayList<>();
		List<List<String>> answerSeqStrList = new ArrayList<>();

		List<List<Integer>> answerCategory3SeqList = new ArrayList<>();	//저장된 답변 카테고리3 시퀀스 정보
		List<List<String>> answerCategory3NameList = new ArrayList<>();	//저장된 답변 카테고리3 이름 정보

		//저장된 추가형[주소] 정보
		List<List<String>> answerAddressNameList = new ArrayList<>();
		List<List<List<Integer>>> answerKeywordSeqList = new ArrayList<>();
		List<List<List<String>>> answerKeywordNameList = new ArrayList<>();
		List<Map<String,Object>> questionAnswerList = new ArrayList<>();

		//작성한 설문지 질문 조회
		List<Map<String,Object>> userQuestionList = surveyService.getUserQuestionList(user.getUserSeq());

		boolean firstView = false;
		// 추가된 질문 개수만큼 루프
		for(int i=0;i< userQuestionList.size();i++){

			int questionSettingSeq = qSeqArr.get(i);	//세팅된 질문 SEQ
			Map<String, Object> userQuestion = userQuestionList.get(i);
			int userQuestionSeq = (int) userQuestion.get("user_question_seq");
			//질문 정보 조회
			QuestionSetting questionSetting = questionService.getQuestionSetting(questionSettingSeq);

			List<String> answerArr = new ArrayList<>();
			List<Integer> answerSeqArr = new ArrayList<>();
			List<String> category2SeqStr = new ArrayList<>();
			List<String> answerSeqStr = new ArrayList<>();

			Map<String,Object> answerMap = new HashMap<>();

			//저장된 키워드정보
			List<List<Integer>> keywordSeqArr2 = new ArrayList<>();
			List<List<String>> keywordNameArr2 = new ArrayList<>();
			List<String> keywordStr = new ArrayList<>();

			//저장된 추가형[업종] 정보
			List<Integer> category3SeqArr = new ArrayList<>();
			List<String> category3NameArr = new ArrayList<>();

			List<String> addressNameArr = new ArrayList<>();
			List<Integer> keywordSeqArrList = new ArrayList<>();

			Integer answerCnt = 0;

			//질문이 선택형이면
			if(questionSetting.getQuestionType().equals("choice")){
				//셋팅된 답변 정보 조회
				List<Map<String, Object>> listSub = answerSettingService.getAnswerSettingList(questionSetting.getQuestionSettingSeq());
				System.out.println("listSub :: "+listSub);

				//작성한 답변 리스트 조회
				List<Map<String, Object>> userAnswer2 = surveyService.getUserAnswer2List(userQuestionSeq);

				List<String> answer_arr = new ArrayList<>();
				List<Integer> rank_arr = new ArrayList<>();
				List<Integer> last_rank_arr = new ArrayList<>();

				String answerStr = "";
				String rankStr = "";

				for(int k =0; k < userAnswer2.size();k++){
					String answer = (String) userAnswer2.get(k).get("answer");
					Integer rank = (Integer) userAnswer2.get(k).get("rank");
					answerStr += answer+",";
					rankStr += rank+",";
					answer_arr.add(answer);

					answerCnt++;
				}

				//해당질문의 답변 배열에 저장
				for(int j =0; j < listSub.size();j++){
					//List<String> arr = new ArrayList<>();
					String answer = (String) listSub.get(j).get("answer");
					Integer answerSeq = (Integer) listSub.get(j).get("answer_setting_seq");
					String category2_seq = (String) listSub.get(j).get("g_seq");
					String answer_seq = (String) listSub.get(j).get("a_seq");

					boolean answer_check = false;
					for(int k =0; k < userAnswer2.size();k++){	//rank 매칭
						String a_answer = (String) userAnswer2.get(k).get("answer");
						Integer rank = (Integer) userAnswer2.get(k).get("rank");

						if(answer.equals(a_answer)){
							answer_check = true;
							rank_arr.add(rank);
							break;
						}

					}
					if(!answer_check){
						rank_arr.add(null);
					}

					answerArr.add(answer);
					answerSeqArr.add(answerSeq);
					category2SeqStr.add(category2_seq);
					answerSeqStr.add(answer_seq);
				}
				answerArrList.add(answerArr);
				answerSeqList.add(answerSeqArr);
				category2SeqStrList.add(category2SeqStr);
				answerSeqStrList.add(answerSeqStr);

				//작성한 답변을 저장
				answerMap.put("answerNameStr",answerStr);
				answerMap.put("answerCnt",answerCnt);
				answerMap.put("answer_arr",answer_arr);
				answerMap.put("rank_arr",rank_arr);
				answerMap.put("rankStr",rankStr);
				answerMap.put("num",i);

				questionAnswerList.add(answerMap);

			}else{

				answerArrList.add(null);
				answerSeqList.add(null);
				category2SeqStrList.add(null);
				answerSeqStrList.add(null);

				//답변 리스트 조회
				List<Map<String, Object>> userAnswer1 = surveyService.getUserAnswer1List(userQuestionSeq);

				Integer category3 = 0;
				String category3Str = "";
				String category3Name = "";


				String addressStr = "";
				String keywordSeqStr = "";
				for(int j =0; j < userAnswer1.size(); j++){

					if(userAnswer1.get(j).get("type").equals(1)){	//질문이 추가형[업종]이면
						category3 = (Integer) userAnswer1.get(j).get("category3_seq");
						String category3_name = (String) userAnswer1.get(j).get("name");
						category3Str += category3+",";
						category3Name += category3_name+",";
						category3SeqArr.add(category3);

						category3NameArr.add(category3_name);
						addressNameArr.add(null);
						keywordSeqArr2.add(null);
						keywordNameArr2.add(null);
					}else{//질문이 추가형[주소]이면
						//답변의 키워드 조회
						List<Map<String,Object>> userKeywordList = surveyService.getUserKeywordList((Integer) userAnswer1.get(j).get("user_answer1_seq"));
						List<Integer> keywordSeqArr = new ArrayList<>();
						List<String> keywordNameArr = new ArrayList<>();
						for(int g =0; g < userKeywordList.size();g++){
							Integer keywordSeq = (Integer) userKeywordList.get(g).get("user_keyword_seq");
							String keywordName = (String) userKeywordList.get(g).get("keyword");
							keywordSeqStr += keywordSeq+",";
							keywordSeqArr.add(keywordSeq);
							keywordNameArr.add(keywordName);

						}

						String address = (String) userAnswer1.get(j).get("address");
						addressStr += address+",";

						addressNameArr.add(address);	//주소명
						keywordSeqArr2.add(keywordSeqArr);
						keywordNameArr2.add(keywordNameArr);
						keywordStr.add(keywordSeqStr);
					}
					answerCnt++;

				}
				//추가형[업종] 답변
				answerMap.put("category3",category3SeqArr);
				answerMap.put("category3_name",category3NameArr);
				answerMap.put("category3Str",category3Str);
				answerMap.put("category3Name",category3Name);

				//추가형[주소] 답변
				answerMap.put("addressArr",addressNameArr);
				answerMap.put("keywordSeqArr",keywordSeqArr2);
				answerMap.put("keywordNameArr",keywordNameArr2);
				answerMap.put("addressStr",addressStr);
				answerMap.put("keywordSeqStr",keywordStr);

				answerMap.put("answerCnt",answerCnt);
				answerMap.put("num",i);


				questionAnswerList.add(answerMap);

				answerAddressNameList.add(addressNameArr);
				answerKeywordSeqList.add(keywordSeqArr2);
				answerKeywordNameList.add(keywordNameArr2);

			}

			System.out.println("questionAnswerList >>>> "+questionAnswerList);

			if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 1 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//추가형[업종] 이고 순위 지정X
				viewList.add("1");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 1 && questionSetting.getRankChangeUse().equals("Y")){
				//추가형[업종] 이고 순위 지정O
				viewList.add("2");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//추가형[주소] 이고 순위 지정X
				viewList.add("3");
			}else if(questionSetting.getQuestionType().equals("add") && questionSetting.getAnswerType() == 2 && questionSetting.getRankChangeUse().equals("Y")){
				//추가형[주소] 이고 순위 지정O
				viewList.add("4");
			}else if(questionSetting.getQuestionType().equals("choice") && questionSetting.getAnswerType() == 3 && (questionSetting.getRankChangeUse() == null || questionSetting.getRankChangeUse().equals("N"))){
				//선택형 이고 순위 지정X
				viewList.add("5");
			}else if(questionSetting.getQuestionType().equals("choice") && questionSetting.getAnswerType() == 3 && questionSetting.getRankChangeUse().equals("Y")){
				//선택형 이고 순위 지정O
				viewList.add("6");
			}
			List.add(questionSetting);

		}
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);
		model.addAttribute("category1List", category1List);
		model.addAttribute("category2List", category2List);
		model.addAttribute("category3List", category3List);
		model.addAttribute("answerArrList", answerArrList);
		model.addAttribute("List", List);
		model.addAttribute("viewList", viewList);
		model.addAttribute("answerSeqList", answerSeqList);
		model.addAttribute("surveySettingSeq", surveySettingSeq);
		model.addAttribute("category2SeqStrList", category2SeqStrList);
		model.addAttribute("answerSeqStrList", answerSeqStrList);

		model.addAttribute("answerCategory3SeqList", answerCategory3SeqList);
		model.addAttribute("answerCategory3NameList", answerCategory3NameList);
		model.addAttribute("answerAddressNameList", answerAddressNameList);
		model.addAttribute("answerKeywordSeqList", answerKeywordSeqList);
		model.addAttribute("answerKeywordNameList", answerKeywordNameList);
		model.addAttribute("questionAnswerList", questionAnswerList);

		System.out.println("List :: "+List);

		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/user/survey_modify_form";
	}

	// <<추가//
	// 회원가입 1
	@GetMapping("/signup/agree")
	public String signupAgree(@RequestParam(value = "uniqueId" , required = false) String uniqueId,
							  @RequestParam(value = "email" , required = false) String email,
							  @RequestParam(value = "name" , required = false) String name,
							  @RequestParam(value = "type" , required = false) String type,
							  Model model) {
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);

		return "pages/user/signup_agree";
	}

	// 회원가입 2
	@PostMapping("/signup/info")
	public String signupInfo(@ModelAttribute User user, Model model,@RequestParam String type,
							 @RequestParam String uniqueId,
							 @RequestParam String email,
							 @RequestParam String name) {


		if(!type.equals("")) {

			String[] email_arr = email.split("@");
			model.addAttribute("type", type);
			model.addAttribute("uniqueId", uniqueId);
			model.addAttribute("email1", email_arr[0]);
			model.addAttribute("email2", email_arr[1]);
			model.addAttribute("name", name);
		}else{
			model.addAttribute("type", "none");
		}

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("user", user);

		model.addAttribute("category1", getCodeList("CATEGORY_1", ""));
		return "pages/user/signup_info";
	}

	// 회원가입 2
	@PostMapping("/signup/area")
	public String signupArea(@ModelAttribute User user, Model model) {
		return "pages/user/signup_area";
	}
	// 추가>>//

	@PostMapping("/signup/checked/id")
	@ResponseBody
	public Map<String, Object> checkedUserId(@RequestBody Map<String, Object> params) {
		int resultCode = GlobalConstant.API_STATUS.SUCCESS;
		String userId = StringUtil.getString(params.get("id"));
		for (String id : GlobalConstant.BLACK_ID_LIST) {
			if (id.equalsIgnoreCase(userId)) {
				resultCode = -101;
				break;
			}
		}
		if (resultCode > 0) {
			if (userService.existedUserId(userId) >= 1) {
				resultCode = -102;
			}
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", resultCode);
		return result;
	}

	@PostMapping("/signup/checked/nickName")
	@ResponseBody
	public Map<String, Object> checkedUserNickName(@RequestBody Map<String, Object> params) {
		int resultCode = GlobalConstant.API_STATUS.SUCCESS;
		String nickName = StringUtil.getString(params.get("nickName"));
		for (String id : GlobalConstant.BLACK_ID_LIST) {
			if (id.equalsIgnoreCase(nickName)) {
				resultCode = -101;
				break;
			}
		}
		if (resultCode > 0) {
			if (userService.existedUserNickName(nickName) >= 1) {
				resultCode = -102;
			}
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", resultCode);
		return result;
	}

	@PostMapping("/signup/checked/email")
	@ResponseBody
	public Map<String, Object> checkedUserEmail(@RequestBody Map<String, Object> params) {
		int resultCode = GlobalConstant.API_STATUS.SUCCESS;
		//String nickName = StringUtil.getString(params.get("nickName"));
		String email1 = StringUtil.getString(params.get("email1"));
		String email2 = StringUtil.getString(params.get("email2"));

		String email = email1+"@"+email2;

		if (userService.existedUserEmail(email) >= 1) {
			resultCode = -102;
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", resultCode);
		return result;
	}

	@PostMapping("/signup/withdraw")
	@ResponseBody
	public Map<String, Object> withdrawUser(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();

		int userSeq = getSessionLoginUserSeq(request);

		int cnt = userService.withdrawUser(userSeq);


		if (cnt > 0) {
			result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		} else {
			result.put("result_code", GlobalConstant.API_STATUS.FAIL);
		}

		return result;

	}

	@GetMapping("/find/id")
	public String findId(Model model) {
		User user = new User();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);
		return "pages/user/find_id";
	}

	@PostMapping("/find/id")
	public String findId(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) {

		String hp = user.getHp1() + user.getHp2() + user.getHp3();

		if (!StoneUtil.isValidHp(hp)) {
			bindingResult.rejectValue("hp", "hp.illeal_match");
		}

		if (bindingResult.hasErrors()) {
			return "pages/user/find_id";
		}

		user.setHp(hp);
		user.setAuth("AU02");

		user.setId(userService.findUserId(user));

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);

		return "pages/user/find_id_result";

	}

	@GetMapping("/find/password")
	public String findPassword(Model model) {
		User user = new User();
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);
		return "pages/user/find_password";
	}

	@PostMapping("/find/password")
	public String findPassword(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) {

		String hp = user.getHp1() + user.getHp2() + user.getHp3();

		if (!StoneUtil.isValidHp(hp)) {
			bindingResult.rejectValue("hp", "hp.illeal_match");
		}

		if (bindingResult.hasErrors()) {
			return "pages/user/find_password";
		}

		user.setHp(hp);
		user.setAuth("AU02");

		user.setUserSeq(userService.findUserPassword(user));

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("user", user);

		return "pages/user/find_password_result";

	}

	@PostMapping("/find/change_password")
	public String changePassword(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
			RedirectAttributes rttr) {

		PasswordConstraintValidator passwordValidator = new PasswordConstraintValidator();

		RuleResult ruleResult = passwordValidator.validate(user.getNewPassword());

		if (!ruleResult.isValid()) {
			bindingResult.rejectValue("newPassword", "password.illegal_match");
		}

		if (!user.getNewPassword().equals(user.getPasswordConfirm())) {
			bindingResult.rejectValue("passwordConfirm", "password.illegal_match_confirm");
		}

		if (bindingResult.hasErrors()) {
			return "pages/user/find_password_result";
		}

		user.setLoginUserSeq(user.getUserSeq());

		userService.updatePassword(user);

		return "pages/user/find_password_result_change";
	}

	@GetMapping("/mypage")
	public String mypage(Model model) {

		User user = new User();
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting boardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", boardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("user", user);

		return "pages/user/mypage";
	}

	@GetMapping("/mypage/qna/{boardSettingSeq}")
	public String mypage_qna(@ModelAttribute BaseParameter params, @PathVariable String boardSettingSeq, Model model) {
		System.out.println("boardSettingSeq :: "+boardSettingSeq);
		User user = new User();
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		//QNA게시판 시퀀스 정보
		BoardSetting boardSetting = boardService.getboardSettingQnaInfo();

		params.setLoginUserSeq(authenticationFacade.getLoginUserSeq());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("boardSettingSeq", boardSettingSeq);
		paramsMap.put("board_type", boardSetting.getFileDirectoryName());
		Paging paging = getUserPaging(params.getPage(), params.getSize());

		System.out.println("paramsMap :: "+paramsMap);
		List<Map<String, Object>> list = boardService.getBoardList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);
		System.out.println("list :: "+list);

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("user", user);
		model.addAttribute("list", list);
		model.addAttribute("params", params);
		model.addAttribute("pageParams", getBaseParameterString(params));
		model.addAttribute("paging", paging);
		model.addAttribute("boardSettingSeq", boardSettingSeq);

		return "pages/user/qna";
	}

	@GetMapping("/mypage/qna/view/{boardSettingSeq}/{boardSeq}")
	public String mypage_qnaView(@PathVariable int boardSettingSeq, @PathVariable int boardSeq, Model model) {
		User user = new User();
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();
		Board board = boardService.getBoardDetail(boardSeq, qnaBoardSetting.getBoardSettingSeq());
		BoardSetting boardSetting = boardService.getboardSettingInfo(boardSettingSeq);

		Answer answer = null;
		answer = answerService.getAnswerInfo(boardSeq);
		if(answer == null){
			answer = new Answer();
		}
		board.setMyPage(true);

		model.addAttribute("board", board);
		model.addAttribute("answer", answer);
		model.addAttribute("fileList", getFileList(qnaBoardSetting.getFileDirectoryName(), boardSeq));
		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("detail", true);
		model.addAttribute("user", user);
		return "pages/user/qna_write";
	}

	@GetMapping("/mypage/qna/write/{boardSettingSeq}")
	public String mypage_qnaWrite(@PathVariable String boardSettingSeq, Model model) {
		/*User user = new User();
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("user", user);
		 */
		Board board = new Board();
		Answer answer = new Answer();
		board.setBoardSettingSeq(Integer.parseInt(boardSettingSeq));
		board.setMyPage(true);
		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		BoardSetting boardSetting = boardService.getboardSettingInfo(Integer.parseInt(boardSettingSeq));

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("board", board);
		model.addAttribute("answer", answer);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("boardSetting", boardSetting);
		model.addAttribute("name", boardSetting.getName());
		model.addAttribute("detail", false);
		return "pages/user/qna_write";
	}

	@GetMapping("/mypage/info")
	public String mypage_info(Model model) {
		User user = userService.getUserInfo(authenticationFacade.getLoginUserSeq());

		String[] email = user.getEmail().split("@");

		user.setEmail1(email[0]);
		user.setEmail2(email[1]);
		user.setEmail3(email[1]);

		user.setHp1(user.getHp().substring(0, 3));

		if (user.getHp().length() == 10) {
			user.setHp2(user.getHp().substring(3, 6));
			user.setHp3(user.getHp().substring(6));
		} else if (user.getHp().length() == 11) {
			user.setHp2(user.getHp().substring(3, 7));
			user.setHp3(user.getHp().substring(7));
		}

		if (StringUtil.isNotBlank(user.getCategory())) {
			user.setCategoryList(Arrays.asList(user.getCategory().split(",")));
		}

		if(user.getGoogleId() != null){
			user.setSocialType("GOOGLE");
		}else if(user.getNaverId() != null){
			user.setSocialType("NAVER");
		}else if(user.getKakaoId() != null){
			user.setSocialType("KAKAO");
		}

		List<Map<String, Object>> boardSettingList = boardService.getboardSettingList();
		Map<String,Object> userSurveyData = surveyService.getUserSurveyInfo(user.getUserSeq());
		System.out.println("userSurveyData :: "+userSurveyData);
		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("boardSettingList", boardSettingList);
		model.addAttribute("category1", getCodeList("CATEGORY_1", ""));
		model.addAttribute("user", user);
		model.addAttribute("userSurveyData", userSurveyData);
		return "pages/user/info";
	}

	@PostMapping("/survey/addressAdd")
	public String addressAdd(Model model,@RequestBody Map<String, Object> params) throws IOException {

		int questionSettingSeq = Integer.parseInt(String.valueOf(params.get("questionSettingSeq")));
		QuestionSetting questionSetting = questionService.getQuestionSetting(questionSettingSeq);
		List<Map<String, Object>> keywordList = questionService.getQuestionSettingKeyword(questionSettingSeq);

		//QNA게시판 시퀀스 정보
		BoardSetting qnaBoardSetting = boardService.getboardSettingQnaInfo();

		model.addAttribute("qnaBoardSetting", qnaBoardSetting);
		model.addAttribute("keywordList", keywordList);
		model.addAttribute("questionSettingSeq", questionSettingSeq);
		model.addAttribute("questionSetting", questionSetting);
		return "pages/user/survey_form :: .adress_pop";
	}

	@PostMapping("/survey/form")
	public String saveUserSurvey(@RequestBody Map<String, Object> params, RedirectAttributes rttr) throws IOException {
		List<Map<String, Object>> questionList = (List<Map<String, Object>>) params.get("data");

		System.out.println("questionList :: "+questionList);

		String userEmail = (String) questionList.get(0).get("userEmail");
		Integer surveySettingSeq = Integer.parseInt((String) questionList.get(0).get("surveySettingSeq"));
		Integer userSurveySeq = Integer.parseInt((String) questionList.get(0).get("userSurveySeq"));
		User user = userService.getUserInfo(userEmail);
		System.out.println("surveySettingSeq ::::>> "+surveySettingSeq);
		//설문지를 신규로 작성하거나 변경할때 이용자 유형을 업데이트해준다.
		switch (surveySettingSeq){
			case 1 : user.setType("1"); user.setSubType("1"); break;
			case 2 : user.setType("1"); user.setSubType("2"); break;
			case 3 : user.setType("2"); user.setSubType("3"); break;
			case 4 : user.setType("3"); user.setSubType("4"); break;
			case 5 : user.setType("3"); user.setSubType("5"); break;
			case 6 : user.setType("3"); user.setSubType("6"); break;
			case 7 : user.setType("4"); user.setSubType("7"); break;
		}

		System.out.println("user CHECK >>> "+user);
		userService.updateUserTypeAndSubType(user);

		UserSurvey userSurvey = new UserSurvey();
		userSurvey.setUserSurveySeq(userSurveySeq);
		userSurvey.setSurveySettingSeq(surveySettingSeq);
		userSurvey.setLoginUserSeq(user.getUserSeq());
		userService.saveUserSurvey(userSurvey, questionList);

		rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);

		String returnUrl = "redirect:/";
		return returnUrl;
	}

	@PostMapping("/user/like_edu")
	public String getLikeEducation(Model model,@ModelAttribute BaseParameter params, @RequestBody Map<String, Object> data){

		System.out.println("data >>> "+data);
		List<Map<String,Object>> list = new ArrayList<>();
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("loginUserSeq",authenticationFacade.getLoginUserSeq());

		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.USER_MYPAGE_EDUCATION);

		//관심 교육 정보 조회
		list = userService.getLikeEducationList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("mypage", true);
		model.addAttribute("pageType", "like_edu");

		return "pages/user/mypage :: .like_edu";
	}

	@PostMapping("/user/recommend_edu")
	public String getRecommendEducation(Model model,@ModelAttribute BaseParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("loginUserSeq",authenticationFacade.getLoginUserSeq());
		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.USER_MYPAGE_EDUCATION);

		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
		}
		//관심 교육 정보 조회
		list = userService.getRecommendEducationList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("mypage", true);
		model.addAttribute("pageType", "recommend_edu");

		return "pages/user/mypage :: .recommend_edu";
	}

	@PostMapping("/user/like_con")
	public String getLikeConsulting(Model model,@ModelAttribute BaseParameter params, @RequestBody Map<String, Object> data){

		System.out.println("data >>> "+data);
		List<Map<String,Object>> list = new ArrayList<>();
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("loginUserSeq",authenticationFacade.getLoginUserSeq());

		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.USER_MYPAGE_EDUCATION);

		//관심 교육 정보 조회
		list = userService.getLikeConsultingList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("mypage", true);
		model.addAttribute("pageType", "like_con");

		return "pages/user/mypage :: .like_con";
	}

	@PostMapping("/user/recommend_con")
	public String getRecommendConsulting(Model model,@ModelAttribute BaseParameter params, @RequestBody Map<String, Object> data){

		List<Map<String,Object>> list = new ArrayList<>();

		//설문지와 매핑된 카테고리를 가져온다
		String category2Group = categoryService.getMappingCategory2(authenticationFacade.getLoginUserSeq());	//설문지 선택형 답변의 매핑 정보(CATEGORY2)
		String category3Group = categoryService.getMappingCategory3(authenticationFacade.getLoginUserSeq());	//설문지 추가형[업종] 답변의 매핑 정보(CATEGORY3)

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
		paramsMap.put("loginUserSeq",authenticationFacade.getLoginUserSeq());
		Paging paging = getUserPaging((Integer) data.get("page"), GlobalConstant.PAGE_SIZE.USER_MYPAGE_EDUCATION);

		if(category2Group != null || category3Group != null) {
			if (category2Group != null) {
				List<String> category2Arr = Arrays.asList(category2Group.split(","));
				paramsMap.put("category2Group", category2Arr);
			}

			if (category3Group != null) {
				List<String> category3Arr = Arrays.asList(category3Group.split(","));
				paramsMap.put("category3Group", category3Arr);

			}
		}
		//관심 교육 정보 조회
		list = userService.getRecommendConsultingList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		model.addAttribute("paging", paging);
		model.addAttribute("mypage", true);
		model.addAttribute("pageType", "recommend_con");

		return "pages/user/mypage :: .recommend_con";
	}

	@PostMapping("/user/deleteUser")
	public String deleteUser(@ModelAttribute("user") User user, Model model) {

		userService.deleteUser(authenticationFacade.getLoginUserSeq());

		return "redirect:/logout";
	}

}
