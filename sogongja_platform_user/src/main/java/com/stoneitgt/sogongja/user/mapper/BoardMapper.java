package com.stoneitgt.sogongja.user.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Board;

@Mapper
public interface BoardMapper {

	List<Map<String, Object>> getBoardList(Map<String, Object> params);

	List<Map<String, Object>> getBoardList(Map<String, Object> params, RowBounds rowBounds);

	Map<String, Object> getBoardCategoryCount(Map<String, Object> params);

	Map<String, Object> getBoard(int boardSeq);

	Board getBoardDetail(int boardSeq);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(Map<String, Object> params);

	int updateBoardReadCnt(int boardSeq);

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
}
