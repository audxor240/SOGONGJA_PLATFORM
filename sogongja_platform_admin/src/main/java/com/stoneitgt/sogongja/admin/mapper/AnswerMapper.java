package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Answer;
import com.stoneitgt.sogongja.domain.Board;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AnswerMapper {

    int insertAnswer(Board board);

    int updateAnswer(Board board);

    Answer getAnswerInfo(int boardSeq);
}
