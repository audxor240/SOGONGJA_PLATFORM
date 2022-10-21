package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CategoryMapper {

    List<Map<String, Object>> getCategory1List();

    List<Map<String, Object>> getCategory2List();

    List<Map<String, Object>> getCategory3List();
}
