package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BoardMapper;
import com.stoneitgt.sogongja.admin.mapper.CategoryMapper;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.Category1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Service
public class CategoryService extends BaseService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertCategory1(Category1 category1){

        categoryMapper.insertCategory1(category1);
    }
}
