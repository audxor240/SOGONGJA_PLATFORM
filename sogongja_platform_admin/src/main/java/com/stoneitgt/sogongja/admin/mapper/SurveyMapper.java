package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.Survey;
import com.stoneitgt.sogongja.domain.SurveySub;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface SurveyMapper {

    List<Map<String, Object>> getSurveySettingList();

    List<Map<String, Object>> getSurveySubList(int surveySeq);

    Survey getSurveySetting(int surveySettingSeq);

    void insertSurveySub(Map<String, Object> params);

    void deleteSurveySub(Survey survey);

    void updateSurvey(Survey survey);

    int selectTotalRecords();
}
