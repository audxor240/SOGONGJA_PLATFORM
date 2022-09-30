package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.EventMapper;
import com.stoneitgt.sogongja.domain.Banner;
import com.stoneitgt.sogongja.domain.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService extends BaseService {

    @Autowired
    private EventMapper eventMapper;

    public List<Map<String, Object>> getEventList(Map<String, Object> params, Paging paging) {
        return eventMapper.getEventList(params, paging.getPaging());
    }

    public Integer selectTotalRecords() {
        return eventMapper.selectTotalRecords();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveEvent(Event event) throws IOException {
        int result = 0;

        event.setEventEnd(event.getEventEnd()+" 23:59:59");

        if (event.getEventSeq() == 0) {
            result = eventMapper.insertEvent(event);
        } else {
            result = eventMapper.updateEvent(event);
        }
        if (event.getImageFile() != null && event.getImageFile().size() > 0) {
            //PC 배너
            if(event.getImageFile().get(0).getSize() > 0){
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("ref_type", GlobalConstant.FILE_REF_TYPE.EVENT_POP);
                params.put("ref_seq", event.getEventSeq());
                params.put("login_user_seq", event.getLoginUserSeq());

                // 이미 등록된 썸네일 파일을 삭제
                filesService.deleteFileAll(params);

                // 이미지 등록 후 썸네일 이미지 생성
                filesService.saveFiles(event.getImageFile().get(0), GlobalConstant.FILE_REF_TYPE.EVENT_POP, event.getEventSeq(),
                        event.getLoginUserSeq(), true);
                //filesService.saveFiles(banner.getAttachFiles().get(0), GlobalConstant.FILE_REF_TYPE.BANNER_PC, banner.getBannerSeq(), banner.getLoginUserSeq());
            }

        }
        return result;
    }

    public Event getEvent(int eventSeq) {
        Event event = eventMapper.getEvent(eventSeq);
        return event;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int deleteEvent(Map<String, Object> params) {
        int result = eventMapper.deleteEvent(params);
        params.put("ref_type", GlobalConstant.FILE_REF_TYPE.EVENT_POP.toUpperCase());
        params.put("ref_seq", params.get("event_seq"));
        filesService.deleteFileAll(params);

        return result;
    }
}
