package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class MapParameter extends BaseParameter {

    private double x1 = 37.49345754382203;
    private double y1 = 126.99710515824563;
    private double x2 = 37.51567561625099;
    private double y2 = 127.0666010904294;

    private double lat = 37.5045717035321;
    private double lng = 127.03184797874623;

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
