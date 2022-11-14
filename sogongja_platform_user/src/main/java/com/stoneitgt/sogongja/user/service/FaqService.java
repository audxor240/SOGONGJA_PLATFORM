package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.FaqMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class FaqService extends BaseService {

    @Autowired
    private FaqMapper faqMapper;

    public List<Map<String, Object>> getFaqList(Map<String, Object> params, Paging paging) {
        return faqMapper.getFaqList(params, paging.getPaging());
    }

    public Map<String, Object> getFaqTypeList(Map<String, Object> paramsMap) {
        return faqMapper.getFaqTypeList(paramsMap);
    }

    public Integer selectTotalRecords() {
        return faqMapper.selectTotalRecords();
    }
}
