package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.domain.Event;
import com.stoneitgt.sogongja.user.mapper.BannerMapper;
import com.stoneitgt.sogongja.user.mapper.EventMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EventService extends BaseService {

    @Autowired
    private EventMapper eventMapper;

    public Map<String, Object> getEventInfo() {
        return eventMapper.getEventInfo();
    }
}
