package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.BannerMapper;
import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BannerService extends BaseService {

    @Autowired
    private BannerMapper bannerMapper;

    public List<Map<String, Object>> getBannerList(Map<String, Object> params, Paging paging) {
        return bannerMapper.getBannerList(params, paging.getPaging());
    }

    public Integer selectTotalRecords() {
        return bannerMapper.selectTotalRecords();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveBoard(Banner banner) throws IOException {
        int result = 0;

        if (banner.getBannerSeq() == 0) {
            result = bannerMapper.insertBanner(banner);
        } else {
            result = bannerMapper.updateBanner(banner);
        }
        if (banner.getImageFile() != null && banner.getImageFile().size() > 0) {
            //PC 배너
            if(banner.getImageFile().get(0).getSize() > 0){
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("ref_type", GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_PC);
                params.put("ref_seq", banner.getBannerSeq());
                params.put("login_user_seq", banner.getLoginUserSeq());

                // 이미 등록된 썸네일 파일을 삭제
                //filesService.deleteFileAll(params);
                filesService.deleteFile(params);

                // 이미지 등록 후 썸네일 이미지 생성
                filesService.saveFiles(banner.getImageFile().get(0), GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_PC, banner.getBannerSeq(),
                        banner.getLoginUserSeq(), true);
                //filesService.saveFiles(banner.getAttachFiles().get(0), GlobalConstant.FILE_REF_TYPE.BANNER_PC, banner.getBannerSeq(), banner.getLoginUserSeq());
            }

            //모바일 배너
            if(banner.getImageFile().get(1).getSize() > 0){
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("ref_type", GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_MOBILE);
                params.put("ref_seq", banner.getBannerSeq());
                params.put("login_user_seq", banner.getLoginUserSeq());

                // 이미 등록된 썸네일 파일을 삭제
                filesService.deleteFile(params);

                filesService.saveFiles(banner.getImageFile().get(1), GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_MOBILE, banner.getBannerSeq(),
                        banner.getLoginUserSeq(), true);
            }
        }
        return result;
    }

    public Banner getBanner(int bannerSeq) {
        Banner banner = bannerMapper.getBanner(bannerSeq);
        return banner;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int deleteBanner(Map<String, Object> params) {
        int result = bannerMapper.deleteBanner(params);
        params.put("ref_type", GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_PC.toUpperCase());
        params.put("ref_seq", params.get("banner_seq"));
        filesService.deleteFileAll(params);
        params.put("ref_type", GlobalConstant.FILE_REF_TYPE.BANNER_IMAGE_MOBILE.toUpperCase());
        params.put("ref_seq", params.get("banner_seq"));
        filesService.deleteFileAll(params);
        return result;
    }


    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int updateBannerOrder(Map<String, Object> params) {
        int result = bannerMapper.updateBannerOrder(params);

        return result;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int updateBannerUsed(Map<String, Object> params) {
        int result = bannerMapper.updateBannerUsed(params);

        return result;
    }
}
