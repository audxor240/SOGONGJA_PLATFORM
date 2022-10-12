package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingMapper;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class QuestionService extends BaseService {

    @Autowired
    private QuestionSettingMapper questionSettingMapper;

    public QuestionSetting getQuestionSetting(int questionSettingSeq) {
        QuestionSetting questionSetting = questionSettingMapper.getQuestionSetting(questionSettingSeq);
        return questionSetting;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveQuestionSetting(QuestionSetting questionSetting) throws IOException {
        int result = 0;

        if (questionSetting.getQuestionSettingSeq() == 0) {
            //답변 리스트 추가

            result = questionSettingMapper.insertQuestionSetting(questionSetting);
        } else {
            result = questionSettingMapper.updateQuestionSetting(questionSetting);
        }

        return result;
    }
}
