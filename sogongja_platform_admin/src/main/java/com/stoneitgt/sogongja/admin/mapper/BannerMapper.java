package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface BannerMapper {

    List<Map<String, Object>> getBannerList(Map<String, Object> params, RowBounds rowBounds);

    int insertBanner(Banner banner);

    int updateBanner(Banner banner);

    Banner getBanner(int bannerSeq);

    int selectTotalRecords();

    int deleteBanner(Map<String, Object> params);
}
