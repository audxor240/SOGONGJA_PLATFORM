package com.stoneitgt.sogongja.user.mapper;

import com.stoneitgt.sogongja.domain.Community;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface CommunityMapper {


    List<Map<String, Object>> getCommunityList(Map<String, Object> params, RowBounds paging);
    int insertCommunity(Community community);

    int updateCommunity(Community community);

    int selectTotalRecords();

    List<Map<String, Object>> getResearchShopGroupList();

    List<Map<String, Object>> getResearchShopSubGroupList();

    Community getCommunityInfo(int communitySeq);
}
