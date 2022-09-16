package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.mapper.EducationBookmarkMapper;
import com.stoneitgt.sogongja.user.mapper.EducationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EducationBookmarkService extends BaseService {

    @Autowired
    private EducationBookmarkMapper educationBookmarkMapper;

    public Map<String, Object> getEducationBookmark(int eduSeq) {
        Map<String, Object> eduMark = educationBookmarkMapper.getEducationBookmark(eduSeq);

        return eduMark;
    }

    public void addEducationBookmark(int eduSeq){

    }
}
