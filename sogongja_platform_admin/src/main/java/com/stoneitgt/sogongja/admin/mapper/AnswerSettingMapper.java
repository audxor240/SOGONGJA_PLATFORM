package com.stoneitgt.sogongja.admin.mapper;


import com.stoneitgt.sogongja.domain.AnswerSetting;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface AnswerSettingMapper {

    int insertAnswerSetting(AnswerSetting answerSetting);

    List<Map<String, Object>> getAnswerSettingList(int questionSeq);

    int deleteAnswer(Map<String, Object> params);
}

