package com.stoneitgt.sogongja.admin.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReSearchAreaMapper {

    List<Map<String, Object>> getReSearchAreaList(Map<String, Object> params, RowBounds rowBounds);

    List<Map<String, Object>> getReSearchAreaComList(Map<String, Object> params, RowBounds rowBounds);

    List<Map<String,Object>> getReSearchAreaAll(Map<String, Object> params);
    List<Map<String,Object>> getReSearchAreaComAll(Map<String, Object> params);
}
