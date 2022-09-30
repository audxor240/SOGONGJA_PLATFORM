package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.Event;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface EventMapper {

    Map<String, Object> getEventInfo();

}
