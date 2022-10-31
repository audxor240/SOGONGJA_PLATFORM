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
    int insertCategory2(Category1 category1);
    int insertCategory3(Category1 category1);

    int deleteCategory1(Category1 category1);
    int deleteCategory2(Category2 category2);
    int deleteCategory3(Category3 category3);

    int deleteCategory3Parent(int seq);

    int deleteAllCategory2(Category1 category1);
    int deleteAllCategory3(Category2 category2);


    List<Map<String, Object>> getCategory1List();

    List<Map<String, Object>> getCategory2List();

    List<Map<String, Object>> getCategory3List();

    Category1 getCategory1Info(int categorySeq);
    Category2 getCategory2Info(int categorySeq);
    Category3 getCategory3Info(int categorySeq);

    Category1 getCategory2DelInfo(int categorySeq);

    List<Map<String, Object>> getCategory2(Map<String, Object> params);

    List<Map<String, Object>> getCategory3(Map<String, Object> params);
}
