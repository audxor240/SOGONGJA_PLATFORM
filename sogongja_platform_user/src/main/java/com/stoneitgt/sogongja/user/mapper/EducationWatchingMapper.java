package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.EducationBookmark;
import com.stoneitgt.sogongja.domain.EducationWatching;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface EducationWatchingMapper {

    int addEducationWatching(int eduSeq, int userSeq);

    EducationWatching getEducationWatching(int eduSeq, int userSeq);

    int deleteEducationWatching(int eduSeq, int userSeq);
}
