package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.ConsultingBookmark;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConsultingBookmarkMapper {

    ConsultingBookmark getConsultingBookmark(int conSeq, int userSeq);

    int addConsultingBookmark(int conSeq, int userSeq);

    int deleteConsultingBookmark(int conSeq, int userSeq);
}
