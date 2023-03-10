package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.admin.controller.ExcelHandler;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Education;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReSearchShopMapper {

    List<Map<String, Object>> getReSearchShopList(Map<String, Object> params, RowBounds rowBounds);
    List<Map<String,Object>> getReSearchShopCategoty1();
    List<Map<String,Object>> getReSearchShopCategoty2(String category1);
    List<Map<String,Object>> getReSearchShopCategoty3(String category2);
    void getReSearchShopAll(ExcelHandler excelHandler);

    int selectTotalRecords();

    int deleteReSearchShop(Map<String, Object> params);

    int insertReSearchShopExcel(List<ReSearchShop> ReSearchShop);

    int checkReSearchShop(int shopNo);
}
