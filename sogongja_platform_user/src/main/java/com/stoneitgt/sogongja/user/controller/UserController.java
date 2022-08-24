package com.stoneitgt.sogongja.user.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.component.PasswordConstraintValidator;
import com.stoneitgt.sogongja.user.service.UserService;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

@Controller
public class UserController extends BaseController {

	@Autowired
	private UserService userService;

	@GetMapping("/signup")
	public String signup(Model model) {
		User user = new User();
		user.setUserType("I");
		model.addAttribute("user", user);
		model.addAttribute("bankList", getCodeList("BANK"));
		model.addAttribute("companyList", getCodeList("COMPANY"));
		model.addAttribute("positionList", getCodeList("POSITION"));
		return "pages/user/signup";
	}

	@PostMapping({ "/signup/register", "/mypage/update" })
	public String registerUser(@ModelAttribute("user") User user, BindingResult bindingResult, Model model,
			RedirectAttributes rttr, HttpServletRequest request) {

		// 회원가입인 경우에만
		if (user.getUserSeq() == 0) {
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
			user.setPassword("");
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

		userService.saveUser(user);

		if (user.getUserSeq() == 0) {
			model.addAttribute("user", user);
			return "pages/user/signup_result";
		} else {
			request.getSession().setAttribute(GlobalConstant.SESSION_USER_KEY, user);
			return "redirect:/mypage/info";
		}

	}

	@PostMapping("/signup/completion")
	public String signupCompletion(@ModelAttribute("user") User user, Model model) {
		return "pages/user/signup_completion";
	}

	// <<추가//
	// 회원가입 1
	@GetMapping("/signup/agree")
	public String signupAgree(Model model) {
		return "pages/user/signup_agree";
	}

	// 회원가입 2
	@PostMapping("/signup/info")
	public String signupInfo(@ModelAttribute User user, Model model) {
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
			if (userService.existedUserId(userId) > 1) {
				resultCode = -102;
			}
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

		System.out.println("cnt=" + cnt);

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

		model.addAttribute("user", user);

		return "pages/user/find_id_result";

	}

	@GetMapping("/find/password")
	public String findPassword(Model model) {
		User user = new User();
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
		model.addAttribute("user", user);
		return "pages/user/mypage";
	}

	@GetMapping("/mypage/qna")
	public String mypage_qna(Model model) {
		User user = new User();
		model.addAttribute("user", user);
		return "pages/user/qna";
	}

	@GetMapping("/mypage/qna/view")
	public String mypage_qnaView(Model model) {
		User user = new User();
		model.addAttribute("user", user);
		return "pages/user/qna_view";
	}

	@GetMapping("/mypage/qna/write")
	public String mypage_qnaWrite(Model model) {
		User user = new User();
		model.addAttribute("user", user);
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

		model.addAttribute("category1", getCodeList("CATEGORY_1", ""));
		model.addAttribute("user", user);
		return "pages/user/info";
	}

}
