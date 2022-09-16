package com.stoneitgt.sogongja.user.controller;

import java.util.HashMap;
import java.util.Map;

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
		System.out.println("CHECK============1");
		System.out.println("params >>>>>>>>>> "+params.get("seq"));

		try {
			User user = (User) authentication.getPrincipal();
		} catch(NullPointerException e){
			String s = "empty";
			System.out.println(s.toUpperCase()); //catch문에서 대문자로 바꾸어준다.
		}


		Map<String, Object> eduMark = educationBookmarkService.getEducationBookmark((Integer) params.get("seq"));
		System.out.println("eduMark :: "+eduMark);
		if(eduMark == null){
			//educationBookmarkService.addEducationBookmark((Integer) params.get("seq"));	//관심 교육 등록
		}else{

		}
		String res = "{res:OK}";
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("res", "OK");


		return jsonObject;
	}
}
