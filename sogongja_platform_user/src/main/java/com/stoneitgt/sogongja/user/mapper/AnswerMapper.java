package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.Answer;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnswerMapper {

    Answer getAnswerInfo(int boardSeq);
}
