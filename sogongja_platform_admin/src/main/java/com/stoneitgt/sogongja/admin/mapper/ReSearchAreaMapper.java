package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.admin.controller.ExcelHandler;
import com.stoneitgt.sogongja.domain.ReSearchArea;
import com.stoneitgt.sogongja.domain.ReSearchAreaCom;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReSearchAreaMapper {

    List<Map<String, Object>> getReSearchAreaList(Map<String, Object> params, RowBounds rowBounds);

    List<Map<String, Object>> getReSearchAreaComList(Map<String, Object> params, RowBounds rowBounds);

    void getReSearchAreaAll(ExcelHandler excelHandler);
    void getReSearchAreaComAll(ExcelHandler excelHandler);

    int insertReSearchAreaExcel(List<ReSearchArea> reSearchArea);

    int insertReSearchAreaComExcel(List<ReSearchAreaCom> reSearchAreaCom);

    int checkReSearchArea(String join);

    int checkReSearchAreaCom(Map<String, Object> map);

    int checkReSearchRegion(Map<String, Object> map);

    int deleteReSearchArea(Map<String, Object> params);

    int deleteReSearchAreaCom(Map<String, Object> params);

}
