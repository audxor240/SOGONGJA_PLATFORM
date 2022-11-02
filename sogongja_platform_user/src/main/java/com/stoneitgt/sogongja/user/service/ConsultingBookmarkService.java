package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.ConsultingBookmark;
import com.stoneitgt.sogongja.user.mapper.ConsultingBookmarkMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConsultingBookmarkService extends BaseService {

    @Autowired
    private ConsultingBookmarkMapper consultingBookmarkMapper;

    public ConsultingBookmark getConsultingBookmark(int conSeq, int userSeq) {
        ConsultingBookmark conMark = consultingBookmarkMapper.getConsultingBookmark(conSeq,userSeq);

        return conMark;
    }

    public void addConsultingBookmark(int conSeq, int userSeq){
        consultingBookmarkMapper.addConsultingBookmark(conSeq, userSeq);
    }

    public void deleteConsultingBookmark(int conSeq, int userSeq){
        consultingBookmarkMapper.deleteConsultingBookmark(conSeq, userSeq);
    }


}
