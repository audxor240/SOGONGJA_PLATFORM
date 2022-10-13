package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Category1;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper {

    int insertCategory1(Category1 category1);
}
