package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface QuestionSettingMapper {

    QuestionSetting getQuestionSetting(int questionSettingSeq);

    int insertQuestionSetting(QuestionSetting questionSetting);

    int updateQuestionSetting(QuestionSetting questionSetting);

    int deleteQuestionSetting(Map<String, Object> params);

    List<Map<String, Object>> getQuestionSettingList(Map<String, Object> params, RowBounds rowBounds);

    List<Map<String, Object>> getQuestionList();

    int selectTotalRecords();

}
