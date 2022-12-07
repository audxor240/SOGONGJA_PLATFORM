package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.ConsultingWatching;
import com.stoneitgt.sogongja.user.mapper.ConsultingWatchingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultingWatchingService extends BaseService {

    @Autowired
    private ConsultingWatchingMapper consultingWatchingMapper;

    public ConsultingWatching getConsultingWatching(int conSeq, int userSeq) {
        ConsultingWatching conWaching = consultingWatchingMapper.getConsultingWatching(conSeq,userSeq);

        return conWaching;
    }

    public void addConsultingWatching(int conSeq, int userSeq){
        if(userSeq != 0) {
            consultingWatchingMapper.addConsultingWatching(conSeq, userSeq);
        }
    }

    public void deleteConsultingWatching(int conSeq, int userSeq){
        consultingWatchingMapper.deleteConsultingWatching(conSeq, userSeq);
    }
}
