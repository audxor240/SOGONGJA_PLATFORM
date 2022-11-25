package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.controller.ExcelHandler;
import com.stoneitgt.sogongja.admin.mapper.ReSearchRegionMapper;
import com.stoneitgt.sogongja.domain.ReSearchAreaCom;
import com.stoneitgt.sogongja.domain.ReSearchRegion;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ReSearchRegionService {

    @Autowired
    private ReSearchRegionMapper reSearchRegionMapper;

    public List<Map<String, Object>> getReSearchRegionList(Map<String, Object> params, Paging paging) {
        return reSearchRegionMapper.getReSearchRegionList(params, paging.getPaging());
    }

    public void getReSearchRegionAll(ExcelHandler excelHandler){
        reSearchRegionMapper.getReSearchRegionAll(excelHandler);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertReSearchRegionExcel(List<ReSearchRegion> reSearchRegion) throws IOException {
        reSearchRegionMapper.insertReSearchRegionExcel(reSearchRegion);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReSearchRegion(Map<String, Object> params) {
        reSearchRegionMapper.deleteReSearchRegion(params);
    }
}
