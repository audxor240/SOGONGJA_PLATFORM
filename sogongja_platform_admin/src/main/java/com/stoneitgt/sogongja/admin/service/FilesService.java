package com.stoneitgt.sogongja.admin.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Vector;

import com.jcraft.jsch.*;
import com.stoneitgt.sogongja.domain.BoardSetting;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.sogongja.admin.mapper.FilesMapper;
import com.stoneitgt.sogongja.admin.properties.SystemProperties;
import com.stoneitgt.sogongja.domain.Files;
import com.stoneitgt.util.FileUtil;

import net.coobird.thumbnailator.Thumbnails;

@Service
public class FilesService {

	@Value("${storage.username}")
	String username;
	@Value("${storage.password}")
	String password;
	@Value("${storage.host}")
	String host;
	@Value("${storage.port}")
	int port;

	static ChannelSftp channelSftp = null;
	static Session session = null;
	static Channel channel = null;
	static ChannelSftp sftp = null;

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

	public int deleteFileByTypeAndSeq(Map<String, Object> params) {
		return filesMapper.deleteFileByTypeAndSeq(params);
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
			//files.setFilePath(filePath + files.getFileSeq());
			files.setFilePath(filePath + attachFile.getOriginalFilename());

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


	public void deleteDirFile(BoardSetting boardSetting) throws JSchException {
		//String path = systemProperties.getUploadFilePath()+"/"+boardSetting.getFileDirectoryName(); // 경로
		//String path = "/home/sogongja/sogongja-master/upload";
		String rm_dir_path = systemProperties.getUploadFilePath()+"/"+boardSetting.getFileDirectoryName();
		System.out.println("rm_dir_path >>>>::::::::::  "+rm_dir_path);
		ChannelSftp sftp = connect();

		try {
			//sftp.cd(path);
			//sftp.mkdir("test444");
			//sftp.rm(path);
			//sftp.rmdir(path);
			//sftp.rmdir(boardSetting.getFileDirectoryName());
			recursiveFolderDelete(rm_dir_path);	//하위 디렉토리및 파일을 삭제하고 최상위 디렉토리를 삭제해준다.
		} catch (SftpException e) {
			System.out.println("e.getMessage() >>> "+e.getMessage());
			System.out.println("e.getLocalizedMessage() >>> "+e.getLocalizedMessage());
			System.out.println("---------------------------- deleteDir Error ----------------------------");
		} finally {
			disconnect(sftp.getSession(), sftp);
		}
	}


	private ChannelSftp connect() {

		/*System.out.println("username :: "+username);
		System.out.println("host :: "+host);
		System.out.println("port :: "+port);
		System.out.println("password :: "+password);*/
		try {
			//JSch 객체를 생성
			JSch jsch = new JSch();

			session = jsch.getSession(username, host, port);
			//session = jsch.getSession("root", "121.254.171.155", 2202);
			//session = jsch.getSession("root", "3.39.158.103", 22);
			//session = jsch.getSession("root", "localhost", 22);

			//jsch.addIdentity("/home/sogongja/.ssh/authorized_keys");	//key-file을 읽는다(키파일 접속시 사용)

			//패스워드 설정
			//session.setPassword(password);
			//session.setPassword("thvmxmfoqtm@))*");
			session.setPassword(password);

			//기타 설정 적용
			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);

			//접속
			session.connect();

			//sftp 채널 열기
			//channel = session.openChannel("sftp");
			channel = session.openChannel("sftp");

			//sft 채널 연결
			channelSftp = (ChannelSftp) channel;
			channelSftp.connect();

			System.out.println("SUCCESS!!!");
		} catch (JSchException e) {
			e.printStackTrace();
			System.out.println("Error...");
			disconnect(session, channel);
		}

		return channelSftp;
	}

	private void disconnect(Session session, Channel channel) {
		if (channel != null) {
			channel.disconnect();
		}
		if (session != null) {
			session.disconnect();
		}
//        log.info("+++++++++++++++++++++++ Disconnect to sftp:/" + host);
	}

	public int saveExcelFiles(MultipartFile attachFile, String fileTitle, String directory, int refSeq, int loginUserSeq,
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
			//files.setFilePath(filePath + files.getFileSeq());
			files.setFilePath(filePath + attachFile.getOriginalFilename());

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

	@SuppressWarnings("unchecked")
	private static void recursiveFolderDelete(String path) throws SftpException {
		System.out.println("recursiveFolderDelete--------------------START-------------------");
		System.out.println("path :::::: "+path);
		//channelSftp.cd(path); // Change Directory on SFTP Server
		System.out.println("CHECK================================== 1 ");
		// List source directory structure.
		Vector<ChannelSftp.LsEntry> fileAndFolderList = channelSftp.ls(path);

		// Iterate objects in the list to get file/folder names.
		for (ChannelSftp.LsEntry item : fileAndFolderList) {
			// If it is a file (not a directory).
			if (!item.getAttrs().isDir()) {
				channelSftp.rm(path + "/" + item.getFilename()); // Remove file.
			} else if (!(".".equals(item.getFilename()) || "..".equals(item.getFilename()))) { // If it is a subdir.
				try {
					// removing sub directory.
					channelSftp.rmdir(path + "/" + item.getFilename());
				} catch (Exception e) { // If subdir is not empty and error occurs.
					// Do lsFolderRemove on this subdir to enter it and clear its contents.
					recursiveFolderDelete(path + "/" + item.getFilename());
				}
			}
		}
		channelSftp.rmdir(path); // delete the parent directory after empty
	}
}
