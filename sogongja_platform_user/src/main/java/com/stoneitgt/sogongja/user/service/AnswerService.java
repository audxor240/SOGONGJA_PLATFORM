package com.stoneitgt.sogongja.user.service;


import com.stoneitgt.sogongja.domain.Answer;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.user.mapper.AnswerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerService extends BaseService {

    @Autowired
    private AnswerMapper answerMapper;


    public Answer getAnswerInfo(int boardSeq) {
        Answer answer = answerMapper.getAnswerInfo(boardSeq);
        return answer;
    }

}