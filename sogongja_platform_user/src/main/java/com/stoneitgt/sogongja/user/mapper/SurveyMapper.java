package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SurveyMapper {

    List<Map<String, Object>> getSurveySubList(int surveySettingSeq);
}
