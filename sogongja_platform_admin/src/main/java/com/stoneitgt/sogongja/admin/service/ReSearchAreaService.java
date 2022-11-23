package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.mapper.ReSearchAreaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ReSearchAreaService extends BaseService{

    @Autowired
    private ReSearchAreaMapper reSearchAreaMapper;

    public List<Map<String, Object>> getReSearchAreaList(Map<String, Object> params, Paging paging) {
        return reSearchAreaMapper.getReSearchAreaList(params, paging.getPaging());
    }

    public List<Map<String, Object>> getReSearchAreaComList(Map<String, Object> params, Paging paging) {
        return reSearchAreaMapper.getReSearchAreaComList(params, paging.getPaging());
    }

    public List<Map<String,Object>> getReSearchAreaAll(Map<String, Object> params){
        return reSearchAreaMapper.getReSearchAreaAll(params);
    }

    public List<Map<String,Object>> getReSearchAreaComAll(Map<String, Object> params){
        return reSearchAreaMapper.getReSearchAreaComAll(params);
    }
}
