package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.Community;
import com.stoneitgt.sogongja.domain.Reply;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReplyMapper {

    List<Map<String, Object>> getreplyList(int communitySeq);
    int insertReply(Reply reply);

    int updateReply(Reply reply);

    void deleteReply(Map<String, Object> params);

    void deleteReplyAll(Map<String, Object> params);
}
