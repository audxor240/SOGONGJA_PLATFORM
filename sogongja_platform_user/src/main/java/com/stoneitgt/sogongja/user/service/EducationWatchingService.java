package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.EducationWatching;
import com.stoneitgt.sogongja.domain.EducationWatching;
import com.stoneitgt.sogongja.user.mapper.EducationWatchingMapper;
import com.stoneitgt.sogongja.user.mapper.EducationWatchingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EducationWatchingService extends BaseService {

    @Autowired
    private EducationWatchingMapper educationWatchingMapper;

    public EducationWatching getEducationWatching(int eduSeq, int userSeq) {
        EducationWatching eduWaching = educationWatchingMapper.getEducationWatching(eduSeq,userSeq);

        return eduWaching;
    }

    public void addEducationWatching(int eduSeq, int userSeq){
        educationWatchingMapper.addEducationWatching(eduSeq, userSeq);
    }

    public void deleteEducationWatching(int eduSeq, int userSeq){
        educationWatchingMapper.deleteEducationWatching(eduSeq, userSeq);
    }
}
