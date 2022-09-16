package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface EducationBookmarkMapper {

    Map<String, Object> getEducationBookmark(int eduSeq);
}
