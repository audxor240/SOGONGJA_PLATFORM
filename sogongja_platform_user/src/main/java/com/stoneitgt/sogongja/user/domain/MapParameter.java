package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class MapParameter extends BaseParameter {

    private double x1;
    private double y1;
    private double x2;
    private double y2;

    private double lat;
    private double lng;

    private int zoom;

    // 상점에서 사용
    private String[] codeType1;

    // 상권 특구에 사용
    private String codeType2 = "A";

    // 지역연구 에 사용
    private int codeType3 = 1;

    private String areaCd;
    private String areaSeq;
    private String emdCd;
}
