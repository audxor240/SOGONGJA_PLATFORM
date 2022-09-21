package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.EducationBookmark;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface EducationBookmarkMapper {

    EducationBookmark getEducationBookmark(int eduSeq, int userSeq);

    int addEducationBookmark(int eduSeq, int userSeq);

    int deleteEducationBookmark(int eduSeq, int userSeq);
}
