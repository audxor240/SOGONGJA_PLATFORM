package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import com.stoneitgt.sogongja.domain.BoardSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Law;
import com.stoneitgt.sogongja.domain.Project;

@Mapper
public interface BoardMapper {

	List<Map<String, Object>> getBoardList(Map<String, Object> params);

	List<Map<String, Object>> getBoardList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getBoardList2(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getBoardSettingList(Map<String, Object> params, RowBounds rowBounds);

	Board getBoard(int boardSeq);

	BoardSetting getBoardSetting(int boardSettingSeq);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(Map<String, Object> params);

	int insertBoardSetting(BoardSetting boardSetting);

	int updateBoardSetting(BoardSetting boardSetting);

	int deleteBoardSetting(Map<String, Object> params);

	int deleteAllBoard(Map<String, Object> params);

	int modPopupFlagToZero(Board board);

	List<Map<String, Object>> getBoardLawList(Map<String, Object> params);

	List<Map<String, Object>> getBoardLawList(Map<String, Object> params, RowBounds rowBounds);

	List<Map<String, Object>> getBoardProjectList(Map<String, Object> params);

	List<Map<String, Object>> getBoardProjectList(Map<String, Object> params, RowBounds rowBounds);

	Project getProject(int projectSeq);

	int insertProject(Project project);

	int updateProject(Project project);

	int deleteProject(Map<String, Object> params);

	Law getLaw(int lawSeq);

	int insertLaw(Law law);

	int updateLaw(Law law);

	int deleteLaw(Map<String, Object> params);

	int selectTotalRecords();

	BoardSetting getBoardSettingInfo(int boardSettingSeq);
}
