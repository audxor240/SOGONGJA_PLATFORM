package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.EventMapper;
import com.stoneitgt.sogongja.domain.Event;
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

        if(!event.getEventUsedSeq().equals("")) {

            Event event2 = getEvent(Integer.parseInt(event.getEventUsedSeq()));

            //현재 사용하고 있는 팝업 수정하지 않을경우
            if (!event.getEventUsedSeq().equals(event2.getEventUsedSeq())) {
                event2.setLoginUserSeq(event.getLoginUserSeq());
                eventMapper.updateEventUsed(event2);
            }
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
                //filesService.saveFiles(event.getAttachFiles().get(0), GlobalConstant.FILE_REF_TYPE.BANNER_PC, event.getEventSeq(), event.getLoginUserSeq());
            }

        }
        return result;
    }

    public Event getEvent(int eventSeq) {
        System.out.println("eventSeq === "+eventSeq);
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

    public String getEventUsedCheck(){

        return eventMapper.getEventUsedCheck();
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int updateEventUsed2(Map<String, Object> params) {

        Event event = eventMapper.getUsedEvent();   //현재 사용중인 이벤트가 있는 조회

        if(event != null) {

            Event event2 = getEvent((int)params.get("event_seq")); //사용할 이벤트 조회

            //현재 사용하고 있는 팝업 수정하지 않을경우
            if (event.getEventSeq() != event2.getEventSeq()) {
                event.setLoginUserSeq(event.getLoginUserSeq());
                eventMapper.updateEventUsed(event);    //기존에 사용하던 이벤트를 사용 중지 시킴
            }
        }

        int result = eventMapper.updateEventUsed2(params);

        return result;
    }
}
