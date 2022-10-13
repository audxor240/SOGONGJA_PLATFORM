package com.stoneitgt.sogongja.admin.mapper;


import com.stoneitgt.sogongja.domain.AnswerSetting;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnswerSettingMapper {

    int insertAnswerSetting(AnswerSetting answerSetting);
}

