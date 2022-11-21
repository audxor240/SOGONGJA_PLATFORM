package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.admin.mapper.ReSearchShopMapper;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ReSearchShopService extends BaseService{

    @Autowired
    private ReSearchShopMapper reSearchShopMapper;


    public List<Map<String, Object>> getReSearchShopList(Map<String, Object> params, Paging paging) {
        return reSearchShopMapper.getReSearchShopList(params, paging.getPaging());
    }
    public List<Map<String,Object>> getReSearchShopCategoty1(){
        return reSearchShopMapper.getReSearchShopCategoty1();
    }
    public List<Map<String,Object>> getReSearchShopCategoty2(String category1){
        return reSearchShopMapper.getReSearchShopCategoty2(category1);
    }
    public List<Map<String,Object>> getReSearchShopCategoty3(String category2){
        return reSearchShopMapper.getReSearchShopCategoty3(category2);
    }

    public List<Map<String,Object>> getReSearchShopAll(Map<String, Object> params){
        return reSearchShopMapper.getReSearchShopAll(params);
    }

    public Integer selectTotalRecords() {
        return reSearchShopMapper.selectTotalRecords();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteReSearchShop(Map<String, Object> params) {
        reSearchShopMapper.deleteReSearchShop(params);
    }
}
