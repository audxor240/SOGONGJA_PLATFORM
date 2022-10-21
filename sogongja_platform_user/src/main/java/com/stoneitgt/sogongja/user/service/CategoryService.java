package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CategoryService extends BaseService{

    @Autowired
    private CategoryMapper categoryMapper;

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
