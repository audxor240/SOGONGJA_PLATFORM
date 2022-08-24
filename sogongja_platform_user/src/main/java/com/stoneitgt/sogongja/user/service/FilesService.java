package com.stoneitgt.sogongja.user.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.sogongja.domain.Files;
import com.stoneitgt.sogongja.user.mapper.FilesMapper;
import com.stoneitgt.sogongja.user.properties.SystemProperties;
import com.stoneitgt.util.FileUtil;

@Service
public class FilesService {

	@Autowired
	private SystemProperties systemProperties;

	@Autowired
	private FilesMapper filesMapper;

	public List<Map<String, Object>> getFileList(Map<String, Object> params) {
		return filesMapper.getFileList(params);
	}

	public Files getFile(int fileSeq) {
		return filesMapper.getFile(fileSeq);
	}

	public int deleteFile(Map<String, Object> params) {
		return filesMapper.deleteFile(params);
	}

	public int deleteFileAll(Map<String, Object> params) {
		return filesMapper.deleteFileAll(params);
	}

	public int saveFiles(MultipartFile attachFile, String directory, int refSeq, int loginUserSeq) throws IOException {

		long fileSize = attachFile.getSize();

		if (fileSize > 0) {
			Files files = new Files();
			files.setFileName(attachFile.getOriginalFilename());
			files.setFileSize(fileSize);
			files.setFileByte(FileUtil.sizeOfAsString(fileSize));
			files.setRefType(directory.toUpperCase());
			files.setRefSeq(refSeq);
			files.setFileExt(FileUtil.getFileExtension(files.getFileName()));
			files.setLoginUserSeq(loginUserSeq);

			filesMapper.insertFile(files);

			String filePath = FileUtil.getUploadFilePath(directory);
			files.setFilePath(filePath + files.getFileSeq());

			File file = FileUtil.uploadFile(systemProperties.getUploadFilePath() + files.getFilePath(), attachFile);
			files.setFileContentType(FileUtil.getFileContentType(file));

			filesMapper.updateFile(files);

			return files.getFileSeq();
		}

		return 0;
	}
}
