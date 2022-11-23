package com.stoneitgt.sogongja.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegionColmunParameter {

    private boolean year = true;
    private boolean qrt = true;
    private boolean ctprvnCd = true;
    private boolean ctprvnNm = true;
    private boolean signguCd = true;
    private boolean signguNm = true;
    private boolean emdCd = true;
    private boolean emdNm = true;
    
    private boolean sumPopul = false;
    private boolean rPopul = false;
    private boolean wPopul = false;
    private boolean house1 = false;
    private boolean house2 = false;
    private boolean house3 = false;
    private boolean house4 = false;
    private boolean house5 = false;
    private boolean house6 = false;
    private boolean house7 = false;
    private boolean ctShopU20s = false;
    private boolean ctShop30s = false;
    private boolean ctShop40s = false;
    private boolean ctShop50s = false;
    private boolean ctShopO60s = false;
    private boolean rtAll = false;
    private boolean rt1f = false;
    private boolean rtOther = false;

}
