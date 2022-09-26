package com.stoneitgt.sogongja.user.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.EducationBookmark;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.component.PasswordConstraintValidator;
import com.stoneitgt.sogongja.user.service.*;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONObject;
import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.API_STATUS;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RESTController extends BaseController {

//	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

	@Autowired
	private CodeService codeService;
	@Autowired
	private EducationBookmarkService educationBookmarkService;
	@Autowired
	private EducationService educationService;

	@Autowired
	private UserService userService;

	@Autowired
	private MailService mailService;



	@PostMapping("/code/ref")
	@ResponseBody
	public ResponseEntity<?> getCodeRefList(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", codeService.getCodeRefList(params));
		return ResponseEntity.ok(result);
	}

	@PostMapping("/favorite")
	@ResponseBody
	public JSONObject updateFavorite(@RequestBody Map<String, Object> params,Authentication authentication){

		JSONObject jsonObject = new JSONObject();
		User user = new User();

		try {
			user = (User) authentication.getPrincipal();

		} catch(NullPointerException e){
			jsonObject.put("message", "login_check");
			return jsonObject;
		}

		EducationBookmark eduMark = educationBookmarkService.getEducationBookmark((Integer) params.get("seq"), user.getUserSeq());

		if(eduMark == null){
			jsonObject.put("message", "add");
			educationBookmarkService.addEducationBookmark((Integer) params.get("seq"), user.getUserSeq());	//관심 교육 등록
		}else{
			jsonObject.put("message", "delete");
			educationBookmarkService.deleteEducationBookmark((Integer) params.get("seq"), user.getUserSeq());	//관심 교육 삭제
		}

		return jsonObject;
	}

	@PostMapping("/detailEducation")
	@ResponseBody
	public JSONObject detailEducation(@RequestBody Map<String, Object> params,Authentication authentication){

		JSONObject jsonObject = new JSONObject();
		User user = new User();

		try {
			user = (User) authentication.getPrincipal();

		} catch(NullPointerException e){
			jsonObject.put("message", "login_check");
			return jsonObject;
		}
		Map<String, Object> education = educationService.getEducation((Integer) params.get("seq"),user.getUserSeq());

		jsonObject.put("edu_url", education.get("edu_url"));

		return jsonObject;
	}

	@PostMapping("/findPw")
	@ResponseBody
	public JSONObject findPw(@RequestBody Map<String, Object> params,Authentication authentication){

		int leftLimit = 48; // numeral '0'
		int rightLimit = 122; // letter 'z'
		int targetStringLength = 10;
		Random random = new Random();
		//패스워드 난수 생성
		String generatedString = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
				.limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
				.toString();

		JSONObject jsonObject = new JSONObject();

		User user = userService.getFindPwUserInfo((String) params.get("email"));
		if(user == null){
			jsonObject.put("message", "아이디와 이메일이 일치하지 않습니다.");
			return jsonObject;
		}

		user.setNewPassword(generatedString);
		jsonObject.put("userId", user.getId());
		jsonObject.put("password", user.getNewPassword());
		userService.updatePassword(user);

		return jsonObject;
	}

	@PostMapping("/newPassword")
	@ResponseBody
	public JSONObject newPassword(@RequestBody Map<String, Object> params,Authentication authentication){

		JSONObject jsonObject = new JSONObject();
		User user = userService.getUserInfo((String) params.get("email"));

		if(user == null){
			jsonObject.put("message", "존재하지 않는 회원입니다.");
			return jsonObject;
		}else{
			user.setNewPassword((String) params.get("password"));
			userService.updatePassword(user);
			mailService.deleteEmailToken((String) params.get("emailToken"), (String) params.get("email"));
		}

		jsonObject.put("message", "비밀번호가 변경되었습니다.");

		return jsonObject;
	}

	@PostMapping({ "/signup/register", "/mypage/update" })
	@ResponseBody
	public JSONObject registerUser(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
								   RedirectAttributes rttr, HttpServletRequest request) {
		JSONObject jsonObject = new JSONObject();

		System.out.println("user ------------->> : "+user);
		String category = user.getCategoryList().toString().substring(1);
		category = category.substring(0, category.length()-1);
		category = category.replaceAll("\\s", "");

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

		model.addAttribute("user", user);
		System.out.println("user >>>>>>>>>>>> "+user);
		//return "pages/user/signup_result";

		// 회원가입인 경우에만
		if (user.getUserSeq() == 0) {
			System.out.println("user.getId() >>>>> "+user.getId());
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
			if(!user.getPassword().equals("")) {
				PasswordConstraintValidator passwordValidator = new PasswordConstraintValidator();

				RuleResult ruleResult = passwordValidator.validate(user.getPassword());
				if (!ruleResult.isValid()) {
					bindingResult.rejectValue("password", "password.illegal_match");
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
		/*
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
		*/
		user.setHp(hp);
//		user.setTel(tel);
		user.setEmail(email);
		user.setAuth("AU02");
		user.setAge(user.getAgeGroup());
		user.setType01(user.getType01());
		user.setType02(user.getType02());
		user.setServiceType(category);

		userService.saveUser(user);

		if (user.getUserSeq() == 0) {
			//model.addAttribute("user", user);
			//return "pages/user/signup_result";
			jsonObject.put("message", "signup_result");

			return jsonObject;
		} else {
			request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);
			//return "redirect:/mypage/info";
			jsonObject.put("message", "info_update");

			return jsonObject;
		}

	}
}
