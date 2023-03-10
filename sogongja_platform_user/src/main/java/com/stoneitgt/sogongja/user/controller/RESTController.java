package com.stoneitgt.sogongja.user.controller;

import java.util.*;

import com.stoneitgt.sogongja.domain.*;
import com.stoneitgt.sogongja.user.service.*;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.API_STATUS;

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
	private ConsultingBookmarkService consultingBookmarkService;
	@Autowired
	private EducationService educationService;

	@Autowired
	private UserService userService;

	@Autowired
	private MailService mailService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private EducationWatchingService educationWatchingService;

	@Autowired
	private ConsultingWatchingService consultingWatchingService;

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

		if(params.get("type").equals("edu")) {
			EducationBookmark eduMark = educationBookmarkService.getEducationBookmark((Integer) params.get("seq"), user.getUserSeq());

			if (eduMark == null) {
				jsonObject.put("message", "add");
				educationBookmarkService.addEducationBookmark((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			} else {
				jsonObject.put("message", "delete");
				educationBookmarkService.deleteEducationBookmark((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			}
		}else if(params.get("type").equals("con")){
			ConsultingBookmark conMark = consultingBookmarkService.getConsultingBookmark((Integer) params.get("seq"), user.getUserSeq());

			if (conMark == null) {
				jsonObject.put("message", "add");
				consultingBookmarkService.addConsultingBookmark((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			} else {
				jsonObject.put("message", "delete");
				consultingBookmarkService.deleteConsultingBookmark((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			}

		}

		return jsonObject;
	}

	@PostMapping("/watching")
	@ResponseBody
	public JSONObject updateWatching(@RequestBody Map<String, Object> params,Authentication authentication){

		JSONObject jsonObject = new JSONObject();
		User user = new User();

		try {
			user = (User) authentication.getPrincipal();

		} catch(NullPointerException e){
			jsonObject.put("message", "login_check");
			return jsonObject;
		}

		if(params.get("type").equals("edu")) {
			EducationWatching eduWatching = educationWatchingService.getEducationWatching((Integer) params.get("seq"), user.getUserSeq());
			jsonObject.put("type", "edu");
			if (eduWatching == null) {
				jsonObject.put("message", "add");
				educationWatchingService.addEducationWatching((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			} else {
				jsonObject.put("message", "delete");
				educationWatchingService.deleteEducationWatching((Integer) params.get("seq"), user.getUserSeq());    //?????? ?????? ??????
			}
		}else if(params.get("type").equals("con")){
			ConsultingWatching conMark = consultingWatchingService.getConsultingWatching((Integer) params.get("seq"), user.getUserSeq());
			jsonObject.put("type", "con");
			if (conMark == null) {
				jsonObject.put("message", "add");
				consultingWatchingService.addConsultingWatching((Integer) params.get("seq"), user.getUserSeq());    //????????? ?????? ??????
			} else {
				jsonObject.put("message", "delete");
				consultingWatchingService.deleteConsultingWatching((Integer) params.get("seq"), user.getUserSeq());    //????????? ?????? ??????
			}

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
			//return jsonObject;
		}
		Map<String, Object> education = educationService.getEducation((Integer) params.get("seq"),user.getUserSeq());
		String edu_url = (String) education.get("edu_url");

		if(edu_url.contains("youtube")){
			jsonObject.put("edu_url_type", "youtube");
			jsonObject.put("edu_seq", params.get("seq"));
		}else {
			jsonObject.put("edu_url_type", "");
			jsonObject.put("edu_url", education.get("edu_url"));
		}

		return jsonObject;
	}

	@PostMapping("/watchingAdd")
	@ResponseBody
	public JSONObject watchingAdd(@RequestBody Map<String, Object> params,Authentication authentication){

		JSONObject jsonObject = new JSONObject();
		User user = new User();

		try {
			user = (User) authentication.getPrincipal();

		} catch(NullPointerException e){
			jsonObject.put("message", "login_check");
			//return jsonObject;
		}
		consultingWatchingService.addConsultingWatching((Integer) params.get("seq"),user.getUserSeq());


		return jsonObject;
	}

	@PostMapping("/findPw")
	@ResponseBody
	public JSONObject findPw(@RequestBody Map<String, Object> params,Authentication authentication){

		int leftLimit = 48; // numeral '0'
		int rightLimit = 122; // letter 'z'
		int targetStringLength = 10;
		Random random = new Random();
		//???????????? ?????? ??????
		String generatedString = random.ints(leftLimit, rightLimit + 1)
				.filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
				.limit(targetStringLength)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
				.toString();

		JSONObject jsonObject = new JSONObject();

		User user = userService.getFindPwUserInfo((String) params.get("email"));
		if(user == null){
			jsonObject.put("message", "???????????? ???????????? ???????????? ????????????.");
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
			jsonObject.put("message", "???????????? ?????? ???????????????.");
			return jsonObject;
		}else{
			user.setNewPassword((String) params.get("password"));
			userService.updatePassword(user);
			mailService.deleteEmailToken((String) params.get("emailToken"), (String) params.get("email"));
		}

		jsonObject.put("message", "??????????????? ?????????????????????.");

		return jsonObject;
	}

	@PostMapping("/category2")
	@ResponseBody
	public ResponseEntity<?> getCategory2(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", categoryService.getCategory2(params));
		return ResponseEntity.ok(result);
	}

	@PostMapping("/category3")
	@ResponseBody
	public ResponseEntity<?> getCategory3(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", categoryService.getCategory3(params));
		return ResponseEntity.ok(result);
	}

}
