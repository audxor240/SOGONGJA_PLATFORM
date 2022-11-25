package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.admin.controller.ExcelHandler;
import com.stoneitgt.sogongja.domain.ReSearchAreaCom;
import com.stoneitgt.sogongja.domain.ReSearchRegion;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface ReSearchRegionMapper {

    List<Map<String, Object>> getReSearchRegionList(Map<String, Object> params, RowBounds rowBounds);

    List<Map<String,Object>> getReSearchRegionAll(ExcelHandler excelHandler);

    int checkReSearchRegion(Map<String, Object> map);

    int insertReSearchRegionExcel(List<ReSearchRegion> reSearchRegion);

    int deleteReSearchRegion(Map<String, Object> params);
}
