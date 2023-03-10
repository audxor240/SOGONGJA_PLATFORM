package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.BoardSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Board;

@Mapper
public interface BoardMapper {

	List<Map<String, Object>> getBoardList(Map<String, Object> params);

	List<Map<String, Object>> getBoardList2(Map<String, Object> params);

	List<Map<String, Object>> getBoardList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getBoardList2(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getBoardCategoryCount(Map<String, Object> params);

	Map<String, Object> getBoard(int boardSeq, int boardSettingSeq);

	Board getBoardDetail(int boardSeq, int boardSettingSeq);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(Map<String, Object> params);

	int updateBoardReadCnt(int boardSeq, int boardSettingSeq);

	List<Map<String, Object>> getPopNoticeBoard();

	List<Map<String, Object>> getBoardLawList(Map<String, Object> params);

	List<Map<String, Object>> getBoardLawList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getBoardProjectList(Map<String, Object> params);

	List<Map<String, Object>> getBoardProjectList(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getProject(int projectSeq);

	Map<String, Object> getLaw(int lawSeq);

	int updateProjectReadCnt(int projectSeq);

	int updateLawReadCnt(int lawSeq);

	int selectTotalRecords();

	List<Map<String, Object>> getboardSettingList();

	BoardSetting getboardSettingInfo(int boardSettingSeq);

	BoardSetting getboardSettingQnaInfo();
}
