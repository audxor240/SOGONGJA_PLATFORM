package com.stoneitgt.sogongja.admin.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.common.GlobalConstant.FILE_REF_TYPE;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Law;
import com.stoneitgt.sogongja.domain.Project;
import com.stoneitgt.util.StoneUtil;

@Service
public class BoardService extends BaseService {

	@Autowired
	private BoardMapper boardMapper;

	public List<Map<String, Object>> getBoardList(Map<String, Object> params) {
		return boardMapper.getBoardList(params);
	}

	public List<Map<String, Object>> getBoardList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardList(params, paging.getPaging());
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

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveBoard(Board board) throws IOException {
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
				filesService.saveFiles(attachFile, FILE_REF_TYPE.BOARD, board.getBoardSeq(), board.getLoginUserSeq());
			}
		}

		if (popupFlag > 0) {
			boardMapper.modPopupFlagToZero(board);
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
	public int deleteProject(Map<String, Object> params) {
		int result = boardMapper.deleteProject(params);
		params.put("ref_type", FILE_REF_TYPE.PROJECT.toUpperCase());
		params.put("ref_seq", params.get("project_seq"));
		filesService.deleteFileAll(params);
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
}
