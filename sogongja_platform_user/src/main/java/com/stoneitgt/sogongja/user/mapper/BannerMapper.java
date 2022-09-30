package com.stoneitgt.sogongja.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface BannerMapper {

    List<Map<String, Object>> getBannerList();
}
