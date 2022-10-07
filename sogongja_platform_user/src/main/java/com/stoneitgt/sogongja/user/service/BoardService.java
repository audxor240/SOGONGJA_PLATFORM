package com.stoneitgt.sogongja.user.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.BoardSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.user.config.DataSourceConfig;
import com.stoneitgt.sogongja.user.mapper.BoardMapper;
import com.stoneitgt.util.StoneUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BoardService extends BaseService {

	@Autowired
	private BoardMapper boardMapper;

	public List<Map<String, Object>> getBoardList(Map<String, Object> params) {
		return boardMapper.getBoardList(params);
	}

	public List<Map<String, Object>> getBoardList2(Map<String, Object> params) {
		return boardMapper.getBoardList2(params);
	}

	public List<Map<String, Object>> getBoardList(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardList(params, paging.getPaging());
	}

	public List<Map<String, Object>> getBoardList2(Map<String, Object> params, Paging paging) {
		return boardMapper.getBoardList2(params, paging.getPaging());
	}

	public Map<String, Object> getBoardCategoryCount(Map<String, Object> params) {
		return boardMapper.getBoardCategoryCount(params);
	}

	public Map<String, Object> getBoard(int boardSeq, int boardSettingSeq) {
		Map<String, Object> board = boardMapper.getBoard(boardSeq, boardSettingSeq);
		boardMapper.updateBoardReadCnt(boardSeq, boardSettingSeq);
		return board;
	}


	public Board getBoardDetail(int boardSeq, int boardSettingSeq) {
		Board board = boardMapper.getBoardDetail(boardSeq, boardSettingSeq);
		boardMapper.updateBoardReadCnt(boardSeq, boardSettingSeq);
		return board;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int saveBoard(Board board, BoardSetting boardSetting) throws IOException {
		int result = 0;
		if (board.getBoardSeq() == 0) {
			result = boardMapper.insertBoard(board);
		} else {
			result = boardMapper.updateBoard(board);
		}
		if (board.getAttachFiles() != null && board.getAttachFiles().size() > 0) {
			for (MultipartFile attachFile : board.getAttachFiles()) {
				filesService.saveFiles(attachFile, boardSetting.getFileDirectoryName(), board.getBoardSeq(), board.getLoginUserSeq());
			}
		}
		return result;
	}

	@Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public int deleteBoard(Map<String, Object> params) {
		int result = boardMapper.deleteBoard(params);
		params.put("ref_type", params.get("fileDirectoryName"));
		params.put("ref_seq", params.get("board_seq"));
		filesService.deleteFileAll(params);
		return result;
	}

	public List<Map<String, Object>> getPopNoticeBoard() {
		List<Map<String, Object>> data = null;
		try {
			data = boardMapper.getPopNoticeBoard();
		} catch (Exception e) {
			log.error("", e);
		}

		return data;
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

	public Map<String, Object> getProject(int projectSeq) {
		Map<String, Object> project = boardMapper.getProject(projectSeq);
		boardMapper.updateProjectReadCnt(projectSeq);
		return project;
	}

	public Map<String, Object> getLaw(int lawSeq) {
		Map<String, Object> law = boardMapper.getLaw(lawSeq);
		boardMapper.updateLawReadCnt(lawSeq);
		law.replace("law_date", StoneUtil.dateToFormatString(law.get("law_date").toString()));
		law.replace("enforce_date", StoneUtil.dateToFormatString(law.get("enforce_date").toString()));
		return law;
	}

	public Integer selectTotalRecords() {
		return boardMapper.selectTotalRecords();
	}

	public List<Map<String, Object>> getboardSettingList(){

		return boardMapper.getboardSettingList();
	}

	public BoardSetting getboardSettingInfo(int boardSettingSeq){

		return boardMapper.getboardSettingInfo(boardSettingSeq);
	}


}
