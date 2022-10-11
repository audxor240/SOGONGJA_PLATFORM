package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface QuestionSettingMapper {

    QuestionSetting getQuestionSetting(int questionSettingSeq);

    int insertQuestionSetting(QuestionSetting questionSetting);

    int updateQuestionSetting(QuestionSetting questionSetting);

    int deleteBoardSetting(Map<String, Object> params);

}
