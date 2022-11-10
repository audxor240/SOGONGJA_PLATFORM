package com.stoneitgt.sogongja.admin.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.passay.RuleResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.component.PasswordConstraintValidator;
import com.stoneitgt.sogongja.admin.service.CodeService;
import com.stoneitgt.sogongja.admin.service.MenuService;
import com.stoneitgt.sogongja.admin.service.UserService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.util.StoneUtil;
import com.stoneitgt.util.StringUtil;

@Controller
@RequestMapping("/setting")
public class SettingController extends BaseController {

	@Autowired
	private UserService userService;

	@Autowired
	private CodeService codeService;

	@Autowired
	private MenuService menuService;

	@GetMapping("/user")
	public String userList(@ModelAttribute BaseParameter params, Model model) {

		Paging paging = new Paging();
		paging.setPage(params.getPage());
		paging.setSize(params.getSize());

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
//		paramsMap.put("user_type", "A");

		List<Map<String, Object>> list = userService.getUserList(paramsMap, paging);
		Integer total = userService.selectTotalRecords();
		paging.setTotal(total);

		model.addAttribute("list", list);
		//model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
		model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "회원관리");
		breadcrumb.put("menu_name", "사용자 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));

		return "pages/setting/user_list";
	}

	@GetMapping("/user/{userSeq}")
	public String userView(@PathVariable int userSeq, @ModelAttribute BaseParameter params, Model model) {
		User user = userService.getUserInfo(userSeq);

		String email[] = user.getEmail().split("@");
		user.setEmail1(email[0]);
		user.setEmail2(email[1]);

		user.setHp1(user.getHp().substring(0,3));
		user.setHp2(user.getHp().substring(3,7));
		user.setHp3(user.getHp().substring(7,11));

		model.addAttribute("user", user);
//		model.addAttribute("authList", getCodeList("AUTH"));

		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "회원관리");
		breadcrumb.put("menu_name", "사용자 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/setting/user_form";
	}

	@GetMapping("/user/form")
	public String userForm(@ModelAttribute BaseParameter params, Model model) {
		model.addAttribute("user", new User());
		model.addAttribute("authList", getCodeList("AUTH"));
		model.addAttribute("menuCode", params.getMenuCode());
		//model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
		breadcrumb.put("parent_menu_name", "회원관리");
		breadcrumb.put("menu_name", "사용자 관리");

		model.addAttribute("breadcrumb", breadcrumb);
		model.addAttribute("pageParams", getBaseParameterString(params));
		return "pages/setting/user_form";
	}

	@PostMapping("/user/checked/nickName")
	@ResponseBody
	public Map<String, Object> checkedUserNickName(@RequestBody Map<String, Object> params) {

		System.out.println(":::::::::::::::::::::");
		int userSeq = Integer.parseInt(params.get("userSeq").toString());

		int resultCode = GlobalConstant.API_STATUS.SUCCESS;
		String nickName = StringUtil.getString(params.get("nickName"));
		for (String id : GlobalConstant.BLACK_ID_LIST) {
			if (id.equalsIgnoreCase(nickName)) {
				resultCode = -101;
				break;
			}
		}
		if (resultCode > 0) {
			if (userSeq > 0) {
				Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
				if (userService.existedUserNickNameWithoutMe(paramsMap) >= 1) {
					resultCode = -102;
				}
			} else {
				if (userService.existedUserNickName(nickName) >= 1) {
					resultCode = -102;
				}
			}
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", resultCode);
		return result;
	}

	@PostMapping("/user/checked/id")
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

	@PostMapping("/delete/user")
	@ResponseBody
	public Map<String, Object> deleteUserByAdmin(@RequestBody Map<String, Object> params, Authentication authentication) {
		int resultCode = GlobalConstant.API_STATUS.SUCCESS;

		int userSeq = StringUtil.getIntValue(params.get("user_seq"));
		if (userSeq == 0) {
			resultCode = -101;
		} else {
			User user = (User) authentication.getPrincipal();
			Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);
			paramsMap.put("login_user_seq", user.getUserSeq());
			userService.deleteUser(paramsMap);
		}

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", resultCode);
		return result;
	}

	@PostMapping("/user/form")
	public String saveUser(@RequestParam(required = false) String menuCode,
						   @ModelAttribute("user") User user,
			BindingResult bindingResult, Model model, RedirectAttributes rttr) {
		PasswordConstraintValidator passwordValidator = new PasswordConstraintValidator();

		if (user.getUserSeq() == 0) {

			for (String id : GlobalConstant.BLACK_ID_LIST) {
				if (id.equalsIgnoreCase(user.getId())) {
					bindingResult.rejectValue("id", "id.black.pattern", new Object[] { id }, "");
					break;
				}
			}

			if (userService.existedUserId(user.getId()) > 0) {
				bindingResult.rejectValue("id", "member.id.exists");
			}
			if (StringUtil.isBlank(user.getPassword())) {
				bindingResult.rejectValue("password", "field.required");
			}
			RuleResult ruleResult = passwordValidator.validate(user.getPassword());
			if (!ruleResult.isValid()) {
				bindingResult.rejectValue("password", "password.illegal_match");
			}
		} else {
			if (StringUtil.isNotBlank(user.getNewPassword())) {
				RuleResult ruleResult = passwordValidator.validate(user.getNewPassword());
				if (!ruleResult.isValid()) {
					bindingResult.rejectValue("newPassword", "password.illegal_match");
				}

				if (!user.getNewPassword().equals(user.getPasswordConfirm())) {
					bindingResult.rejectValue("passwordConfirm", "password.illegal_match_confirm");
				}
			}
		}

		if (bindingResult.hasErrors()) {
			model.addAttribute("authList", getCodeList("AUTH"));
			model.addAttribute("menuCode", menuCode);
			model.addAttribute("breadcrumb", getBreadcrumb(menuCode));
			model.addAttribute("pageParams", user.getPageParams());
			return "pages/setting/user_form";
		}

		String returnUrl = "redirect:/setting/user?";

		if (user.getAuth().equals("AU00")) {
			user.setUserType("A");
		} else {
			user.setUserType(null);
		}
		user.setEmail(user.getEmail1() + "@" + user.getEmail2());
		user.setHp(user.getHp1() + user.getHp2() + user.getHp3());

		if (user.getUserSeq() == 0) {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
			returnUrl += "menuCode=" + menuCode;
		} else {
			rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);
			returnUrl += user.getPageParams();
		}
		user.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
		userService.saveUser(user);
		return returnUrl;
//		return "redirect:/setting/user";
	}

	@GetMapping("/code")
	public String codeList(@ModelAttribute BaseParameter params, @RequestParam(required = false) String groupCode,
			Model model) {
		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> masterList = codeService.getCodeMasterList(paramsMap);

		if (StringUtil.isNotBlank(groupCode)) {
			paramsMap.put("grp_code", groupCode);
		}

		List<Map<String, Object>> detailList = codeService.getCodeDetailList(paramsMap);

		model.addAttribute("masterList", masterList);
		model.addAttribute("detailList", detailList);
		model.addAttribute("params", params);
		model.addAttribute("groupCode", groupCode);
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		return "pages/setting/code_list";
	}

	@PostMapping("/code/load")
	@ResponseBody
	public Map<String, Object> codeView(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();
		if ("M".equals(StringUtil.getString(params.get("type")))) {
			result.put("data", codeService.getCodeMaster(params));
		} else {
			result.put("data", codeService.getCodeDetail(params));
		}
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/code/master")
	@ResponseBody
	public Map<String, Object> codeMasterList(@RequestBody Map<String, Object> params) {
		List<Map<String, Object>> list = codeService.getCodeMasterList(params);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("grp_code", "");
		map.put("grp_code_name", "선택하세요");
		list.add(0, map);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", list);
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/code/register/master")
	@ResponseBody
	public Map<String, Object> saveCodeMaster(@RequestBody Map<String, Object> params, HttpServletRequest request) {

		params.put("login_user_seq", getSessionLoginUserSeq(request));

		codeService.saveCodeMaster(params);

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/code/register/detail")
	@ResponseBody
	public Map<String, Object> saveCodeDetail(@RequestBody Map<String, Object> params, HttpServletRequest request) {

		params.put("login_user_seq", getSessionLoginUserSeq(request));

		codeService.saveCodeDetail(params);

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/code/delete")
	@ResponseBody
	public Map<String, Object> deleteCodeMaster(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		params.put("login_user_seq", getSessionLoginUserSeq(request));
		if ("M".equals(StringUtil.getString(params.get("type")))) {
			codeService.deleteCodeMaster(params);
		} else {
			codeService.deleteCodeDetail(params);
		}
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@GetMapping("/menu")
	public String menuList(@ModelAttribute BaseParameter params, Model model) {

		Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

		List<Map<String, Object>> list = menuService.getMenuList(paramsMap);
		Integer total = menuService.selectTotalRecords();


		model.addAttribute("list", list);
		Paging paging = new Paging();
		paging.setShow(false);
		//paging.setTotal(total);
		model.addAttribute("paging", StoneUtil.setTotalPaging2(list, paging));
		//model.addAttribute("paging", paging);
		model.addAttribute("params", params);
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));

		return "pages/setting/menu_list";
	}

	@PostMapping("/menu/register")
	@ResponseBody
	public Map<String, Object> saveMenu(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		params.put("login_user_seq", getSessionLoginUserSeq(request));
		menuService.saveMenu(params);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/menu/delete")
	@ResponseBody
	public Map<String, Object> deleteMenu(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		params.put("login_user_seq", getSessionLoginUserSeq(request));
		menuService.deleteMenu(params);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/menu/load")
	@ResponseBody
	public Map<String, Object> getMenu(@RequestBody Map<String, Object> params) {
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", menuService.getMenu(StringUtil.getString(params.get("menu_code"))));
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@PostMapping("/menu/parent")
	@ResponseBody
	public Map<String, Object> getParentMenuList(@RequestBody Map<String, Object> params) {

		List<Map<String, Object>> list = menuService.getParentMenuList(params);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("code", "TOP");
		map.put("code_name", "선택하세요");
		list.add(0, map);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", list);
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	@GetMapping("/auth")
	public String authList(@ModelAttribute BaseParameter params, @RequestParam(required = false) String auth,
			Model model) {

		List<Map<String, Object>> menuList = new ArrayList<Map<String, Object>>();
		List<Map<String, Object>> authMenuList = menuService.getAuthMenuList(auth);
		List<String> values = new ArrayList<String>();
		for (Map<String, Object> item : authMenuList) {
			if (StringUtil.getIntValue(item.get("level")) == 1) {
				Map<String, Object> menu = item;
				List<Map<String, Object>> children = getChildren(authMenuList, StringUtil.getString(item.get("id")));
				menu.put("children", children);
				menuList.add(menu);
				if (children.size() == 0) {
					if (StringUtil.getIntValue(item.get("value")) == 1) {
						values.add(StringUtil.getString(item.get("id")));
					}
				}
			} else {
				if (StringUtil.getIntValue(item.get("value")) == 1) {
					values.add(StringUtil.getString(item.get("id")));
				}
			}
		}

		model.addAttribute("authList", getCodeList("AUTH", ""));
		model.addAttribute("menuList", menuList);
		model.addAttribute("values", values);
		model.addAttribute("params", params);
		model.addAttribute("auth", auth);
		model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
		return "pages/setting/auth_list";
	}

	@PostMapping("/auth/register")
	@ResponseBody
	public Map<String, Object> saveAuthMenu(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		params.put("login_user_seq", getSessionLoginUserSeq(request));
		menuService.saveAuthMenu(params);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

	private List<Map<String, Object>> getChildren(List<Map<String, Object>> list, String parent) {
		List<Map<String, Object>> children = new ArrayList<Map<String, Object>>();
		for (Map<String, Object> item : list) {
			if (parent.equals(StringUtil.getString(item.get("parent_id")))) {
				children.add(item);
			}
		}
		return children;
	}
}
