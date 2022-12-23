package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface UrbanMapper {
    List<Map<String, Object>> getGrid(Map<String, Object> params);
    List<Map<String, Object>> getGridLocation();

}
