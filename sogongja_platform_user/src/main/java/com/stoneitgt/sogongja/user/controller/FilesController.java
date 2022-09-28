package com.stoneitgt.sogongja.user.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.stoneitgt.common.GlobalConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.sogongja.domain.Files;
import com.stoneitgt.sogongja.user.service.FilesService;
import com.stoneitgt.util.FileUtil;
import com.stoneitgt.util.StringUtil;

@Controller
@RequestMapping("/file")
public class FilesController extends BaseController {

	@Autowired
	private FilesService filesService;

	@GetMapping("/download/{fileSeq}")
	public void retrieve(@PathVariable int fileSeq, HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		Files files = filesService.getFile(fileSeq);

		if (files == null) {
			return;
		}

		File file = new File(systemProperties.getUploadFilePath() + files.getFilePath());

		if (StringUtil.isNoneBlank(files.getFileContentType())) {
			response.setContentType(files.getFileContentType());
		}

		FileUtil.outputStreamFile(file, files.getFileName(), response, request);
	}

	@PostMapping("/delete")
	@ResponseBody
	public Map<String, Object> deleteFile(@RequestBody Map<String, Object> params, HttpServletRequest request) {
		params.put("login_user_seq", getSessionLoginUserSeq(request));
		filesService.deleteFile(params);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("result_code", GlobalConstant.API_STATUS.SUCCESS);
		return result;
	}

}
