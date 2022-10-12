package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.user.mapper.BannerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class BannerService extends BaseService {

    @Autowired
    private BannerMapper bannerMapper;

    public List<Map<String, Object>> getPcBannerList() {
        return bannerMapper.getPcBannerList();
    }

    public List<Map<String, Object>> getMobileBannerList() {
        return bannerMapper.getMobileBannerList();
    }
}
