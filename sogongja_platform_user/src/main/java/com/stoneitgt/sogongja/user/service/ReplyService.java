package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.Reply;
import com.stoneitgt.sogongja.user.config.DataSourceConfig;
import com.stoneitgt.sogongja.user.mapper.ReplyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ReplyService extends BaseService {

    @Autowired
    private ReplyMapper replyMapper;

    public List<Map<String, Object>> getreplyList(int communitySeq) {
        return replyMapper.getreplyList(communitySeq);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void saveReply(Reply reply) {
        if (reply.getReplySeq() == 0) {
            replyMapper.insertReply(reply);
        } else {
            replyMapper.updateReply(reply);
        }

    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReply(Map<String, Object> params) {
        replyMapper.deleteReply(params);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReplyAll(Map<String, Object> params) {
        replyMapper.deleteReplyAll(params);
    }
}
