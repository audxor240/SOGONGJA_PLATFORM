package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.Reply;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReplyMapper {

    List<Map<String, Object>> getreplyList(int communitySeq, Paging paging);
    int insertReply(Reply reply);

    int updateReply(Reply reply);

    void deleteReply(Map<String, Object> params);

    void deleteReplyAll(Map<String, Object> params);
}

