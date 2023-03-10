package com.stoneitgt.sogongja.user.service;

import com.stoneitgt.sogongja.user.mapper.UrbanMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommerceService {

    @Autowired
    private UrbanMapper urbanMapper;

    public List<Map<String, Object>> getGrid(Map<String, Object> params) {

        List<Map<String, Object>> list = urbanMapper.getGrid(params);

        List<String> temp = new ArrayList();
        for (Map<String, Object> map : list) {
            String gridCd = map.get("grid_cd").toString();
            temp.add(gridCd);
        }

        String scope = new String();
        for (String tem : temp) {
            scope +=  "'" + tem + "',";
        }
        scope = StringUtils.removeEnd(scope, ",");

        if (scope.length() > 0) {

            List<Map<String, Object>> locationList = urbanMapper.getGridLocation(scope);

            for (Map<String, Object> map : list) {
                String gridCd = map.get("grid_cd").toString();

                List<Map<String, Object>> path = (List<Map<String, Object>>) locationList.stream()
                        .filter(m -> m.get("grid_cd").toString().equals(gridCd)).collect(Collectors.toList());

                map.put("path", path);

            }
        }
        return list;
    }


    public Map<String, Object> getStandard(List<Map<String, Object>> list) {

        double max = 0;
        double min = 999;
        for (Map<String, Object> standard : list) {
            double gradient = Double.parseDouble(standard.get("gradient").toString());
            if (gradient > max) {
                max = gradient;
            }
            if (gradient < min) {
                min = gradient;
            }
        }
        System.out.println(max + " max , min " + min);

        double temp = Math.round((max - min) / 5);
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < 5; i++) {
            map.put(Double.toString(i+1), min + (temp * i));
        }
        return map;
    }
}
