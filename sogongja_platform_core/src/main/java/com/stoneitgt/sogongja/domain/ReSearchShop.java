package com.stoneitgt.sogongja.domain;

import lombok.Data;

@Data
public class ReSearchShop {

    private int shopSeq;
    private int shopNo;
    private String shopNm;
    private String branch;
    private String codeType1;
    private String nmType1;
    private String codeType2;
    private String nmType2;
    private String codeType3;
    private String nmType3;
    private String addrCd;
    private String addr;
    private String stAddr;
    private String emdCd;
    private String emdNm;
    private float longitude;
    private float latitude;
    private String subStaNm;
    private String subStaNo;
    private float aveSubPassOn;
    private float aveSubPassOff;
    private float sumSubPassOn;
    private float sumSubPassOff;
    private String busStaNm;
    private String arsId;
    private float aveBusPassOn;
    private float aveBusPassOff;
    private float sumBusPassOn;
    private float sumBusPassOff;
    private String apprvDate;
    private int ctGrd;
    private int ctBase;
    private int pincpUseCd;
    private String pincpUse;
    private String otherUse;

    private String category1;
    private String category2;
    private String category3;

    private int loginUserSeq;

}
