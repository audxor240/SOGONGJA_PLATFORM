package com.stoneitgt.sogongja.admin.controller;

import java.util.HashMap;
import java.util.Map;

import com.stoneitgt.sogongja.admin.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.stoneitgt.common.GlobalConstant.API_STATUS;
import com.stoneitgt.sogongja.admin.service.CodeService;

@RestController
@RequestMapping("/api")
public class RESTController extends BaseController {

//	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

	@Autowired
	private CodeService codeService;

	@Autowired
	private CategoryService categoryService;

	@PostMapping("/code/ref")
	@ResponseBody
	public ResponseEntity<?> getCodeRefList(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", codeService.getCodeRefList(params));
		System.out.println("result :: "+result);
		return ResponseEntity.ok(result);
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
