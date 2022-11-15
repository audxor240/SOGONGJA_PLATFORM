package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface FaqMapper {

    List<Map<String, Object>> getFaqList(Map<String, Object> params, RowBounds rowBounds);

    Map<String, Object> getFaqTypeList(Map<String, Object> paramsMap);

    int selectTotalRecords();
}
