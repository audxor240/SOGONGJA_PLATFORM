package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.SupportMapper;
import com.stoneitgt.sogongja.domain.Category1;
import com.stoneitgt.sogongja.domain.Support;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class SupportService extends BaseService{

    @Autowired
    private SupportMapper supportMapper;

    public List<Map<String, Object>> getSupportList() {
        return supportMapper.getSupportList();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertSupport(Support support){
        supportMapper.insertSupport(support);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteSupport(Map<String, Object> data){
        Support support = supportMapper.getSupportInfo((int)data.get("supportSeq"));
        support.setLoginUserSeq((int)data.get("loginUserSeq"));

        supportMapper.deleteSupport(support);

    }

}
