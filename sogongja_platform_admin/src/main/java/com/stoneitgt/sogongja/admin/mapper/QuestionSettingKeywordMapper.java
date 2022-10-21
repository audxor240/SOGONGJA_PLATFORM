package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.AnswerSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.sogongja.domain.QuestionSettingKeyword;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface QuestionSettingKeywordMapper {

    int insertQuestionSettingKeyword(QuestionSettingKeyword questionSettingKeyword);

    String getQuestionSettingKeywordList(int questionSeq);

    int deleteQuestionSettingKeyword(Map<String, Object> params);

    int deleteAllQuestionSettingKeyword(QuestionSetting questionSetting);
}
