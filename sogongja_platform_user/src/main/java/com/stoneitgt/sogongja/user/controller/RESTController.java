package com.stoneitgt.sogongja.user.controller;

import java.util.HashMap;
import java.util.Map;

import com.stoneitgt.sogongja.domain.Education;
import com.stoneitgt.sogongja.domain.EducationBookmark;
import com.stoneitgt.sogongja.domain.User;
import com.stoneitgt.sogongja.user.service.EducationBookmarkService;
import com.stoneitgt.sogongja.user.service.EducationService;
import lombok.RequiredArgsConstructor;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.API_STATUS;
import com.stoneitgt.sogongja.user.service.CodeService;

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
}
