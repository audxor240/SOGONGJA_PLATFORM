package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.QuestionSetting;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface QuestionSettingMapper {

    QuestionSetting getQuestionSetting(int questionSettingSeq);

    List<Map<String, Object>> getQuestionSettingKeyword(int questionSettingSeq);
}

