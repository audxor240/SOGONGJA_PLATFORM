package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Event;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface EventMapper {

    List<Map<String, Object>> getEventList(Map<String, Object> params, RowBounds rowBounds);

    int insertEvent(Event event);

    int updateEvent(Event event);

    Event getEvent(int eventSeq);

    int selectTotalRecords();

    int deleteEvent(Map<String, Object> params);

    String getEventUsedCheck();

    int updateEventUsed(Event event);
}
