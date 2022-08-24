package com.stoneitgt.sogongja.admin.controller;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.admin.service.FilesService;
import com.stoneitgt.sogongja.domain.Files;
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

	@GetMapping("/static/{fileSeq}")
	public void staticFile(@PathVariable int fileSeq, HttpServletRequest request, HttpServletResponse response)
			throws Exception {

//		Map<String, Object> fileInfo = filesService.getFile(fileSeq);
//
//		if (fileInfo == null) {
//			throw new Exception("Not found file!");
//		}
//
//		String filepath = systemProperties.getStaticFilePath();
//
//		log.info("fileInfo : " + fileInfo);
//
//		File file = new File(filepath + fileInfo.get("file_path").toString());
//
//		FileUtil.outputStreamFile(file, fileInfo.get("file_name").toString(), response, request);
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
