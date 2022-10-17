package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.AnswerSettingMapper;
import com.stoneitgt.sogongja.admin.mapper.QuestionSettingMapper;
import com.stoneitgt.sogongja.domain.AnswerSetting;
import com.stoneitgt.sogongja.domain.QuestionSetting;
import org.apache.commons.compress.compressors.zstandard.ZstdCompressorOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

@Service
public class QuestionService extends BaseService {

    @Autowired
    private QuestionSettingMapper questionSettingMapper;

    @Autowired
    private AnswerSettingMapper answerSettingMapper;

    @Autowired
    private AnswerSettingService answerSettingService;

    public QuestionSetting getQuestionSetting(int questionSettingSeq) {
        QuestionSetting questionSetting = questionSettingMapper.getQuestionSetting(questionSettingSeq);
        return questionSetting;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveQuestionSetting(QuestionSetting questionSetting, AnswerSetting answerSetting) throws IOException {
        int result = 0;

        if (questionSetting.getQuestionSettingSeq() == 0) {

            //질문 추가
            result = questionSettingMapper.insertQuestionSetting(questionSetting);

            answerSetting.setQuestionSettingSeq(questionSetting.getQuestionSettingSeq());
            //답변 리스트 추가, 답변하나당 카테고리 개수만큼 추가해준다
            for(int i= 0;i < questionSetting.getAnswerTitleList().size();i++ ){
                String answer = questionSetting.getAnswerTitleList().get(i);

                answerSetting.setAnswer(answer);
                String tag_str = questionSetting.getAnswerTagList().get(i);
                String[] tag_arr = tag_str.split("\\|");

                for(int j =0; j < tag_arr.length;j++){
                    String category2 = tag_arr[j];
                    answerSetting.setCategory2(Integer.parseInt(category2));
                    answerSettingMapper.insertAnswerSetting(answerSetting);
                }
            }

        } else {
            //result = questionSettingMapper.updateQuestionSetting(questionSetting);
            List<Map<String, Object>> answerList = answerSettingService.getAnswerSettingList(questionSetting.getQuestionSettingSeq());

            //기존에 등록되어 있는 답변과 비교하여 update 및 insert 해준다
            /*for(int i= 0;i < questionSetting.getAnswerTitleList().size();i++ ){

            }*/
            /*
            if(answerList.size() > questionSetting.getAnswerTitleList().size()){    //삭제됐음
                for(int i= 0;i < answerList.size();i++ ){   //기존에 등록되어 있는 답변
                    System.out.println(i+"번째~~~~~~~~~~~~~~~~~~~~");
                    String befor_answer = (String) answerList.get(i).get("answer");    //입력 받은 답변
                    String after_answer = "";
                    try {
                        after_answer = questionSetting.getAnswerTitleList().get(i);    //입력 받은 답변
                    }catch (IndexOutOfBoundsException e){
                        System.out.println("IndexOutOfBoundsException ------------------ : "+e);
                        after_answer = "null";
                    }
                    System.out.println("after_answer >>>>> "+after_answer);
                    List name_list = new ArrayList();
                    List seq_list = new ArrayList();
                    Map<String, Object> item = answerList.get(i);
                    String nameStr = (String) item.get("g_name");
                    String seqStr = (String) item.get("g_seq");

                    name_list = Arrays.asList(nameStr.split(","));
                    seq_list = Arrays.asList(seqStr.split(","));
                    System.out.println("기존 seq :: "+seq_list.get(i));


                    //입력받은 답변 데이터
                    //String tag_str = questionSetting.getAnswerTagList().get(i);
                    //String[] tag_arr = tag_str.split("\\|");
                    //System.out.println("입력받은 seq :: "+tag_arr[i]);
                    System.out.println("befor_answer :: "+befor_answer);
                    System.out.println("after_answer :: "+after_answer);
                    System.out.println("befor_answer.getClass().getName() : "+befor_answer.getClass().getName());
                    System.out.println("after_answer.getClass().getName() : "+after_answer.getClass().getName());
                    if(!befor_answer.equals(after_answer)){
                        System.out.println("DELETE !!!!!!!!!!!!!!! : ("+befor_answer+")이 삭제되었습니다!~!!" );
                        Map<String, Object> params = new HashMap<String, Object>();
                        params.put("answer",befor_answer);
                        params.put("login_user_seq",questionSetting.getLoginUserSeq());
                        params.put("question_setting_seq",questionSetting.getQuestionSettingSeq());
                        answerSettingService.deleteAnswer(params);

                    }

                    //item.put("nameArr",name_list);
                    //item.put("seqArr",seq_list);
                }
            }else{  //입력 받은 답변 개수가 같거나 많음
                for(int i= 0;i < questionSetting.getAnswerTitleList().size();i++ ){     //입력받은 개수 만큼 체크함
                    String befor_answer = "";
                    String after_answer = questionSetting.getAnswerTitleList().get(i);

                    try {
                        befor_answer = (String) answerList.get(i).get("answer");    //입력 받은 답변
                    }catch (IndexOutOfBoundsException e){
                        System.out.println("IndexOutOfBoundsException ------------------ : "+e);
                        befor_answer = "null";
                    }

                    if(!after_answer.equals(befor_answer)){

                    }


                }

            }
            */

        }

        return result = 1;
    }

    public List<Map<String, Object>> getQuestionSettingList(Map<String, Object> params, Paging paging) {
        return questionSettingMapper.getQuestionSettingList(params, paging.getPaging());
    }

    public Integer selectTotalRecords() {
        return questionSettingMapper.selectTotalRecords();
    }
}
