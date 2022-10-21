package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.QuestionSetting;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionSettingMapper {

    QuestionSetting getQuestionSetting(int questionSettingSeq);
}
