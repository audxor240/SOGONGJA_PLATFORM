package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.ReplyMapper;
import com.stoneitgt.sogongja.domain.Reply;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ReplyService extends BaseService {

    @Autowired
    private ReplyMapper replyMapper;

    public List<Map<String, Object>> getreplyList(int communitySeq, Paging paging) {
        return replyMapper.getreplyList(communitySeq, paging);
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
