package com.stoneitgt.sogongja.admin.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.sogongja.admin.mapper.FilesMapper;
import com.stoneitgt.sogongja.admin.properties.SystemProperties;
import com.stoneitgt.sogongja.domain.Files;
import com.stoneitgt.util.FileUtil;

import net.coobird.thumbnailator.Thumbnails;

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

	public int saveFiles(MultipartFile attachFile, String directory) throws IOException {
		return saveFiles(attachFile, null, directory, 0, 0, false);
	}

	public int saveFiles(MultipartFile attachFile, String directory, int refSeq, int loginUserSeq) throws IOException {
		return saveFiles(attachFile, null, directory, refSeq, loginUserSeq, false);
	}

	public int saveFiles(MultipartFile attachFile, String directory, int refSeq, int loginUserSeq, boolean isThumb)
			throws IOException {
		return saveFiles(attachFile, null, directory, refSeq, loginUserSeq, isThumb);
	}

	public int saveFiles(MultipartFile attachFile, String fileTitle, String directory, int refSeq, int loginUserSeq,
			boolean isThumb) throws IOException {

		long fileSize = attachFile.getSize();

		if (fileSize > 0) {
			Files files = new Files();
			files.setFileName(attachFile.getOriginalFilename());
			files.setFileSize(fileSize);
			files.setFileByte(FileUtil.sizeOfAsString(fileSize));
			files.setRefType(directory.toUpperCase());
			files.setRefSeq(refSeq);
			files.setFileExt(FileUtil.getFileExtension(files.getFileName()));
			files.setFileTitle(fileTitle);
			files.setLoginUserSeq(loginUserSeq);

			filesMapper.insertFile(files);

			String filePath = FileUtil.getUploadFilePath(directory);
			files.setFilePath(filePath + files.getFileSeq());

			File file = FileUtil.uploadFile(systemProperties.getUploadFilePath() + files.getFilePath(), attachFile);

			files.setFileContentType(FileUtil.getFileContentType(file));

			// 썸네일 생성 시 파일 타입이 이미지인 경우
			if (isThumb && files.getFileContentType().contains("image")) {
				File thumb = new File(systemProperties.getThumbnailFilePath() + files.getFilePath() + "_thumb.jpg");
				FileUtils.forceMkdirParent(thumb);
				int width = 0;
				int height = 0;
				System.out.println("files.getRefType() :::: "+files.getRefType());

				//배너 사이즈 변경
				if(files.getRefType().equals("BANNER_IMAGE_PC") || files.getRefType().equals("BANNER_IMAGE_MOBILE")){
					width = 2000;
					height = 2000;
				}else{
					width = 600;
					height = 600;
				}
				Thumbnails.of(file).size(width, height).outputFormat("jpg").toFile(thumb);

				files.setThumbnailPath(files.getFilePath() + "_thumb.jpg");
			}

			filesMapper.updateFile(files);

			return files.getFileSeq();
		}

		return 0;
	}

	public int updateFileTitle(Files file) {
		return filesMapper.updateFileTitle(file);
	}
}
