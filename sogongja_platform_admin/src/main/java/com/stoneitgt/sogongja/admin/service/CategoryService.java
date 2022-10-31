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
    public void insertCategory2(Category1 category1){
        categoryMapper.insertCategory2(category1);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void insertCategory3(Category1 category1){
        categoryMapper.insertCategory3(category1);
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

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteCategory(Map<String, Object> data){
        if((int)data.get("type") == 1){
            Category1 category1 = categoryMapper.getCategory1Info((int)data.get("categorySeq"));            //대분류 5
            category1.setLoginUserSeq((int)data.get("loginUserSeq"));

            Category1 c1 = categoryMapper.getCategory2DelInfo((int)data.get("categorySeq"));

            if(c1 != null) {
                String[] delSeqArr = c1.getDelGroupSeq().split(",");

                //중분류에 속하는 소분류 삭제
                for (int i = 0; i < delSeqArr.length; i++) {
                    int seq = Integer.parseInt(delSeqArr[i]);
                    categoryMapper.deleteCategory3Parent(seq);
                }
            }

            categoryMapper.deleteCategory1(category1);  //대분류 삭제            //5삭제
            categoryMapper.deleteAllCategory2(category1);   //중분류 전체 삭제     //중분류 5인거 삭제

            //해당 카테고리의 [교육]을 전체 삭제해준다.

            //해당 카테고리의 [질문관리] 정보를 삭제해준다.

            //해당 카테고리의 사용자 설문의 질문 정보를 삭제해준다.(맞춤 맵핑시 제외시키기 위함)

        }else if((int)data.get("type") == 2){
            Category2 category2 = categoryMapper.getCategory2Info((int)data.get("categorySeq"));
            category2.setLoginUserSeq((int)data.get("loginUserSeq"));

            categoryMapper.deleteCategory2(category2);
            categoryMapper.deleteAllCategory3(category2);
        }else if((int)data.get("type") == 3){
            Category3 category3 = categoryMapper.getCategory3Info((int)data.get("categorySeq"));
            category3.setLoginUserSeq((int)data.get("loginUserSeq"));

            categoryMapper.deleteCategory3(category3);
        }

    }

    public List<Map<String, Object>> getCategory2(Map<String, Object> params) {
        return categoryMapper.getCategory2(params);
    }

    public List<Map<String, Object>> getCategory3(Map<String, Object> params) {
        return categoryMapper.getCategory3(params);
    }
}
