package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Category1;
import com.stoneitgt.sogongja.domain.Category2;
import com.stoneitgt.sogongja.domain.Category3;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface CategoryMapper {

    int insertCategory1(Category1 category1);
    int insertCategory2(Category2 category2);
    int insertCategory3(Category3 category3);

    List<Map<String, Object>> getCategory1List();

    List<Map<String, Object>> getCategory2List();

    List<Map<String, Object>> getCategory3List();
}
