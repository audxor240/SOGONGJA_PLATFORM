package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.CategoryMapper;
import com.stoneitgt.sogongja.domain.Category1;
import com.stoneitgt.sogongja.domain.Category2;
import com.stoneitgt.sogongja.domain.Category3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CategoryService extends BaseService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertCategory1(Category1 category1){
        categoryMapper.insertCategory1(category1);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertCategory2(Category2 category2){
        categoryMapper.insertCategory2(category2);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertCategory3(Category3 category3){
        categoryMapper.insertCategory3(category3);
    }

    public List<Map<String, Object>> getCategory1List() {
        return categoryMapper.getCategory1List();
    }

    public List<Map<String, Object>> getCategory2List() {
        return categoryMapper.getCategory2List();
    }

    public List<Map<String, Object>> getCategory3List() {
        return categoryMapper.getCategory3List();
    }
}
