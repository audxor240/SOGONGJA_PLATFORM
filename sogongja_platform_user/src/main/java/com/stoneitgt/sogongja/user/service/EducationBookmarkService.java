package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.EducationBookmark;
import com.stoneitgt.sogongja.user.mapper.EducationBookmarkMapper;
import com.stoneitgt.sogongja.user.mapper.EducationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EducationBookmarkService extends BaseService {

    @Autowired
    private EducationBookmarkMapper educationBookmarkMapper;

    public EducationBookmark getEducationBookmark(int eduSeq, int userSeq) {
        EducationBookmark eduMark = educationBookmarkMapper.getEducationBookmark(eduSeq,userSeq);

        return eduMark;
    }

    public void addEducationBookmark(int eduSeq, int userSeq){
        educationBookmarkMapper.addEducationBookmark(eduSeq, userSeq);
    }

    public void deleteEducationBookmark(int eduSeq, int userSeq){
        educationBookmarkMapper.deleteEducationBookmark(eduSeq, userSeq);
    }
}
