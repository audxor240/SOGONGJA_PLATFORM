package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BannerMapper;
import com.stoneitgt.sogongja.admin.mapper.SurveyMapper;
import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.Survey;
import com.stoneitgt.sogongja.domain.SurveySub;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SurveyService extends BaseService {

    @Autowired
    private SurveyMapper surveyMapper;

    public List<Map<String, Object>> getSurveySettingList() {
        return surveyMapper.getSurveySettingList();
    }

    public Survey getSurveySetting(int surveySettingSeq) {

        return surveyMapper.getSurveySetting(surveySettingSeq);
    }

    public List<Map<String, Object>> getSurveySubList(int surveySeq) {
        return surveyMapper.getSurveySubList(surveySeq);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveSurvey(Survey survey) throws IOException {
        int result = 0;

        surveyMapper.updateSurvey(survey);

        //설문 관리 sub 정보 조회
        List<Map<String, Object>> listSub = getSurveySubList(survey.getSurveySettingSeq());
        //설문 관리 등록된 질문이 있으면
        if (listSub.size() != 0) {
            //질문 전체 삭제
            surveyMapper.deleteSurveySub(survey);
        }
        //질문 시퀀스 저장
        for(int i =0; i < survey.getQSeqList().size();i++){

            int questionSeq = survey.getQSeqList().get(i);

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("surveySettingSeq", survey.getSurveySettingSeq());
            params.put("questionSettingSeq", questionSeq);
            params.put("loginUserSeq", survey.getLoginUserSeq());
            surveyMapper.insertSurveySub(params);
        }

        return result;
    }

    public Integer selectTotalRecords() {
        return surveyMapper.selectTotalRecords();
    }
}
