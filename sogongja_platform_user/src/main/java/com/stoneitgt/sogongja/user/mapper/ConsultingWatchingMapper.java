package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.ConsultingWatching;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConsultingWatchingMapper {

    int addConsultingWatching(int conSeq, int userSeq);

    ConsultingWatching getConsultingWatching(int conSeq, int userSeq);
}
