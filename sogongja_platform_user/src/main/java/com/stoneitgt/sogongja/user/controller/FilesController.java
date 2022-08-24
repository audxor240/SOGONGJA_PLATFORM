package com.stoneitgt.sogongja.user.controller;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

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

}
