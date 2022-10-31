package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.mapper.SupportMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SupportService extends BaseService{

    @Autowired
    private SupportMapper supportMapper;

    public List<Map<String, Object>> getSupportList() {
        return supportMapper.getSupportList();
    }
}
