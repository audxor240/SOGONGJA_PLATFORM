package com.stoneitgt.sogongja.admin.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.stoneitgt.sogongja.admin.mapper.AnswerMapper;
import com.stoneitgt.sogongja.domain.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.util.StoneUtil;

@Service
public class BoardService extends BaseService {

	@Autowired
	private BoardMapper boardMapper;

	@Autowired
	private AnswerMapper answerMapper;

	public List<Map<String, Object>> getBoardList(Map<String, Object> params) {
		return boardMapper.getBoardList(params);
	}

	public List<Map<String, Object>> getBoardList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getBoardList2(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardList2(params, paging.getPaging());
	}

	public List<Map<String, Object>> getBoardSettingList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardSettingList(params, paging.getPaging());
	}

	public Integer selectTotalRecords() {
		return boardMapper.selectTotalRecords();
	}

	public Board getBoard(int boardSeq) {
		Board board = boardMapper.getBoard(boardSeq);
		board.setFromDt(StoneUtil.dateToFormatString(board.getFromDt()));
		board.setToDt(StoneUtil.dateToFormatString(board.getToDt()));
		return board;
	}

	public BoardSetting getBoardSetting(int boardSettingSeq) {
		BoardSetting boardSetting = boardMapper.getBoardSetting(boardSettingSeq);
		return boardSetting;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveBoard(Board board, BoardSetting boardSetting) throws IOException {
		int result = 0;
		int popupFlag = board.getPopupFlag();

		if (board.getPopupFlag() == 1) {
			board.setFromDt(StoneUtil.dateString(board.getFromDt()));
			board.setToDt(StoneUtil.dateString(board.getToDt()));
		} else {
			board.setFromDt(null);
			board.setToDt(null);
		}

		if (board.getBoardSeq() == 0) {
			result = boardMapper.insertBoard(board);
		} else {
			result = boardMapper.updateBoard(board);
		}
		if (board.getAttachFiles() != null && board.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : board.getAttachFiles()) {
				//filesService.saveFiles(attachFile, FILE_REF_TYPE.BOARD, board.getBoardSeq(), board.getLoginUserSeq());
				filesService.saveFiles(attachFile, boardSetting.getFileDirectoryName(), board.getBoardSeq(), board.getLoginUserSeq());
			}
		}

		if (popupFlag > 0) {
			boardMapper.modPopupFlagToZero(board);
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveBoardSetting(BoardSetting boardSetting) throws IOException {
		int result = 0;


		if (boardSetting.getBoardSettingSeq() == 0) {
			result = boardMapper.insertBoardSetting(boardSetting);
		} else {
			result = boardMapper.updateBoardSetting(boardSetting);
		}


		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteBoard(Map<String, Object> params) {
		int result = boardMapper.deleteBoard(params);
		params.put("ref_type", FILE_REF_TYPE.BOARD.toUpperCase());
		params.put("ref_seq", params.get("board_seq"));
		filesService.deleteFileAll(params);
		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public void deleteBoardSetting(Map<String, Object> params) throws SftpException, JSchException {

		BoardSetting boardSetting = getBoardSetting((int) params.get("board_setting_seq"));

		boardMapper.deleteBoardSetting(params);
		boardMapper.deleteAllBoard(params);		//하위 게시판 삭제

		params.put("ref_type", boardSetting.getFileDirectoryName().toUpperCase());
		params.put("ref_seq", params.get("board_seq"));

		//첨부 파일 사용하는 게시판이면
		if(boardSetting.getFileUse() == 1) {
			filesService.deleteFileAll(params);    //파일 삭제(DEL_FLAG 업데이트)
			//첨부파일 저장된 폴더 및 파일 전체 삭제
			filesService.deleteDirFile(boardSetting);
		}

	}

	public List<Map<String, Object>> getBoardLawList(Map<String, Object> params) {
		return boardMapper.getBoardLawList(params);
	}

	public List<Map<String, Object>> getBoardLawList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardLawList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getBoardProjectList(Map<String, Object> params) {
		return boardMapper.getBoardProjectList(params);
	}

	public List<Map<String, Object>> getBoardProjectList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardProjectList(params, paging.getPaging());
	}

	public Project getProject(int projectSeq) {
		Project project = boardMapper.getProject(projectSeq);
		return project;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveProject(Project project) throws IOException {
		int result = 0;

		if (project.getProjectSeq() == 0) {
			result = boardMapper.insertProject(project);
		} else {
			result = boardMapper.updateProject(project);
		}
		if (project.getAttachFiles() != null && project.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : project.getAttachFiles()) {
				filesService.saveFiles(attachFile, FILE_REF_TYPE.PROJECT, project.getProjectSeq(),
						project.getLoginUserSeq());
			}
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int addProject(org.json.JSONArray projectList, int loginUserSeq) throws IOException {
		int result = 0;

		for(int i =0 ; i < projectList.length();i++) {
			JSONObject dt = (JSONObject) projectList.get(i);
			System.out.println("dt >> "+dt);
			Map<String, Object> map;
			map = new ObjectMapper().readValue(dt.toString(), Map.class);	//Json -> map변경

			map.put("type",dt.get("type"));
			map.put("title",dt.get("title"));
			map.put("year",dt.get("year"));
			map.put("areaNm",dt.get("areaNm"));
			System.out.println("test >> "+map);
			switch (map.get("areaNm").toString()){
				case "전국": map.put("placeType",1);break;
				case "서울/강원": map.put("placeType",2);break;
				case "인천/경기": map.put("placeType",3);break;
				case "대전/세종/충청": map.put("placeType",4);break;
				case "대구/경북": map.put("placeType",5);break;
				case "부산/울산/경남": map.put("placeType",6);break;
				case "광주/전라/제주": map.put("placeType",7);break;
			}
			map.put("loginUserSeq",loginUserSeq);	//로그인 사용자

			//등록된 프로젝트가 있는지 조회
			String projectSeq = boardMapper.getProjectCheck(map);
			//등록된 프로젝트가 없으면 추가해준다.
			if(projectSeq == null){
				result = boardMapper.addProject(map);
			}

		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteProject(Map<String, Object> params) {
		int result = boardMapper.deleteProject(params);
		//params.put("ref_type", FILE_REF_TYPE.PROJECT.toUpperCase());
		//params.put("ref_seq", params.get("project_seq"));
		//filesService.deleteFileAll(params);
		return result;
	}

	public Law getLaw(int lawSeq) {
		Law law = boardMapper.getLaw(lawSeq);
		law.setLawDate(StoneUtil.dateToFormatString(law.getLawDate()));
		law.setEnforceDate(StoneUtil.dateToFormatString(law.getEnforceDate()));
		return law;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveLaw(Law law) throws IOException {
		int result = 0;

		law.setLawDate(StoneUtil.dateString(law.getLawDate()));
		law.setEnforceDate(StoneUtil.dateString(law.getEnforceDate()));

		if (law.getLawSeq() == 0) {
			result = boardMapper.insertLaw(law);
		} else {
			result = boardMapper.updateLaw(law);
		}
		if (law.getAttachFiles() != null && law.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : law.getAttachFiles()) {
				filesService.saveFiles(attachFile, FILE_REF_TYPE.LAW, law.getLawSeq(), law.getLoginUserSeq());
			}
		}

		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteLaw(Map<String, Object> params) {
		int result = boardMapper.deleteLaw(params);
		params.put("ref_type", FILE_REF_TYPE.LAW.toUpperCase());
		params.put("ref_seq", params.get("law_seq"));
		filesService.deleteFileAll(params);
		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public void saveAnswer(Board board, BoardSetting boardSetting) throws IOException {

		if (board.getAnswerSeq() == 0) {
			answerMapper.insertAnswer(board);	//답변 등록
		} else {
			answerMapper.updateAnswer(board);	//답변 수정
		}

		Board board2 = boardMapper.getBoard(board.getBoardSeq());	//기존 정보
		//문의 정보가 변경 됐으면 수정함
		if(board.getSubject() != board2.getSubject() || board.getContent() != board2.getContent()){
			boardMapper.updateBoard(board);		//질문 수정
		}

		//질문 파일 첨부
		if (board.getAttachFiles() != null && board.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : board.getAttachFiles()) {
				filesService.saveFiles(attachFile, boardSetting.getFileDirectoryName(), board.getBoardSeq(), board.getLoginUserSeq());
			}
		}

	}

	public Answer getAnswerInfo(int boardSeq){
		return answerMapper.getAnswerInfo(boardSeq);
	}

	public BoardSetting getboardSettingInfo(int boardSettingSeq){

		return boardMapper.getBoardSettingInfo(boardSettingSeq);
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public void saveFaqBoard(Excel data) throws IOException {
		boardMapper.insertFaqBoard(data);

	}
}
