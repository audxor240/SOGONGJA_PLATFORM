package com.stoneitgt.sogongja.admin.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ServiceMatchingMapper {

    Map<String, Object> getTitle(int userSeq);
    List<Map<String, Object>> getQuestionList(int userSeq);
    Map<String, Object> getQuestion(int questionSeq, int userSeq);
    Map<String, Object> getChoiceAnswer(int userQuestionSeq);
    Map<String, Object> getAddAnswer(int userQuestionSeq);

}
