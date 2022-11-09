package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.BoardSetting;
import com.stoneitgt.sogongja.domain.Community;
import com.stoneitgt.sogongja.user.config.DataSourceConfig;
import com.stoneitgt.sogongja.user.mapper.BoardMapper;
import com.stoneitgt.sogongja.user.mapper.CommunityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CommunityService extends BaseService {

    @Autowired
    private CommunityMapper communityMapper;

    public List<Map<String, Object>> getCommunityList(Map<String, Object> params, Paging paging) {
        return communityMapper.getCommunityList(params, paging.getPaging());
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveCommunity(Community community) throws IOException {
        int result = 0;
        if (community.getCommunitySeq() == 0) {
            result = communityMapper.insertCommunity(community);
        } else {
            result = communityMapper.updateCommunity(community);
        }
        if (community.getAttachFiles() != null && community.getAttachFiles().size() > 0) {
            for (MultipartFile attachFile : community.getAttachFiles()) {
                filesService.saveFiles(attachFile, GlobalConstant.FILE_REF_TYPE.COMMUNITY, community.getCommunitySeq(), community.getLoginUserSeq());
            }
        }
        return result;
    }

    public Integer selectTotalRecords() {
        return communityMapper.selectTotalRecords();
    }

    public List<Map<String, Object>> getResearchShopGroupList(){

        return communityMapper.getResearchShopGroupList();
    }

    public List<Map<String, Object>> getResearchShopSubGroupList(){

        return communityMapper.getResearchShopSubGroupList();
    }

    public Community getCommunityInfo(int communitySeq){
        return communityMapper.getCommunityInfo(communitySeq);
    }
}
