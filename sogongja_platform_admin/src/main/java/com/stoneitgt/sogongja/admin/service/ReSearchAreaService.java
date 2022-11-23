package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.ReSearchAreaMapper;
import com.stoneitgt.sogongja.domain.ReSearchArea;
import com.stoneitgt.sogongja.domain.ReSearchAreaCom;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
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

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertReSearchAreaExcel(List<ReSearchArea> reSearchArea) throws IOException {
        reSearchAreaMapper.insertReSearchAreaExcel(reSearchArea);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertReSearchAreaComExcel(List<ReSearchAreaCom> reSearchAreaCom) throws IOException {
        reSearchAreaMapper.insertReSearchAreaComExcel(reSearchAreaCom);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReSearchArea(Map<String, Object> params) {
        reSearchAreaMapper.deleteReSearchArea(params);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReSearchAreaCom(Map<String, Object> params) {
        reSearchAreaMapper.deleteReSearchAreaCom(params);
    }
}
