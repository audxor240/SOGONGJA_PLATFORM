package com.stoneitgt.sogongja.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AreaColmunParameter {



    private boolean year = true;
    private boolean qrt = true;
    private boolean areaDivCd = true;
    private boolean areaCd = true;
    private boolean areaNm = true;

    private boolean join = false;

    private boolean livPopul = false;
    private boolean mPopul = false;
    private boolean fPopul = false;
    private boolean age10D1 = false;
    private boolean age10D2 = false;
    private boolean age10D3 = false;
    private boolean age10D4 = false;
    private boolean age10D5 = false;
    private boolean age10D6 = false;
    private boolean age20D1 = false;
    private boolean age20D2 = false;
    private boolean age20D3 = false;
    private boolean age20D4 = false;
    private boolean age20D5 = false;
    private boolean age20D6 = false;
    private boolean age30D1 = false;
    private boolean age30D2 = false;
    private boolean age30D3 = false;
    private boolean age30D4 = false;
    private boolean age30D5 = false;
    private boolean age30D6 = false;
    private boolean age40D1 = false;
    private boolean age40D2 = false;
    private boolean age40D3 = false;
    private boolean age40D4 = false;
    private boolean age40D5 = false;
    private boolean age40D6 = false;
    private boolean age50D1 = false;
    private boolean age50D2 = false;
    private boolean age50D3 = false;
    private boolean age50D4 = false;
    private boolean age50D5 = false;
    private boolean age50D6 = false;
    private boolean age60D1 = false;
    private boolean age60D2 = false;
    private boolean age60D3 = false;
    private boolean age60D4 = false;
    private boolean age60D5 = false;
    private boolean age60D6 = false;
    private boolean age10W1 = false;
    private boolean age10W2 = false;
    private boolean age10W3 = false;
    private boolean age10W4 = false;
    private boolean age10W5 = false;
    private boolean age10W6 = false;
    private boolean age20W1 = false;
    private boolean age20W2 = false;
    private boolean age20W3 = false;
    private boolean age20W4 = false;
    private boolean age20W5 = false;
    private boolean age20W6 = false;
    private boolean age30W1 = false;
    private boolean age30W2 = false;
    private boolean age30W3 = false;
    private boolean age30W4 = false;
    private boolean age30W5 = false;
    private boolean age30W6 = false;
    private boolean age40W1 = false;
    private boolean age40W2 = false;
    private boolean age40W3 = false;
    private boolean age40W4 = false;
    private boolean age40W5 = false;
    private boolean age40W6 = false;
    private boolean age50W1 = false;
    private boolean age50W2 = false;
    private boolean age50W3 = false;
    private boolean age50W4 = false;
    private boolean age50W5 = false;
    private boolean age50W6 = false;
    private boolean age60W1 = false;
    private boolean age60W2 = false;
    private boolean age60W3 = false;
    private boolean age60W4 = false;
    private boolean age60W5 = false;
    private boolean age60W6 = false;
    private boolean stPopul = false;
    private boolean bdPopul = false;
    private boolean rPopul = false;
    private boolean wPopul = false;

    //상권 데이터(소득소비)
    private boolean sumFoodEx = false;
    private boolean sumCltEx = false;
    private boolean sumNecEx = false;
    private boolean sumMedEx = false;
    private boolean sumTrpEx = false;
    private boolean sumLeiEx = false;
    private boolean sumCulEx = false;
    private boolean sumEduEx = false;
    private boolean sumEntEx = false;

    private boolean ctAptCom = false;
    private boolean ctAptHou = false;

    private boolean idxStbArea = false;

    //상권 업종(Default)
    private boolean areaDivNm = false;
    private boolean comCd = false;
    private boolean comCd2 = false;
    private boolean comNm = false;

    //점포
    private boolean ctShop = false;
    private boolean ctShopSim = false;
    private boolean ctFranchise = false;

    //추정매출
    private boolean sum0006 = false;
    private boolean sum0611 = false;
    private boolean sum1114 = false;
    private boolean sum1417 = false;
    private boolean sum1721 = false;
    private boolean sum2124 = false;

    //개폐업
    private boolean perOpen = false;
    private boolean ctOpen = false;
    private boolean perClose = false;
    private boolean ctClose = false;

    public void Area2Dto(boolean bool) {
        this.join = bool;
        this.livPopul = bool;
        this.mPopul = bool;
        this.fPopul = bool;
        this.age10D1 = bool;
        this.age10D2 = bool;
        this.age10D3 = bool;
        this.age10D4 = bool;
        this.age10D5 = bool;
        this.age10D6 = bool;
        this.age20D1 = bool;
        this.age20D2 = bool;
        this.age20D3 = bool;
        this.age20D4 = bool;
        this.age20D5 = bool;
        this.age20D6 = bool;
        this.age30D1 = bool;
        this.age30D2 = bool;
        this.age30D3 = bool;
        this.age30D4 = bool;
        this.age30D5 = bool;
        this.age30D6 = bool;
        this.age40D1 = bool;
        this.age40D2 = bool;
        this.age40D3 = bool;
        this.age40D4 = bool;
        this.age40D5 = bool;
        this.age40D6 = bool;
        this.age50D1 = bool;
        this.age50D2 = bool;
        this.age50D3 = bool;
        this.age50D4 = bool;
        this.age50D5 = bool;
        this.age50D6 = bool;
        this.age60D1 = bool;
        this.age60D2 = bool;
        this.age60D3 = bool;
        this.age60D4 = bool;
        this.age60D5 = bool;
        this.age60D6 = bool;
        this.age10W1 = bool;
        this.age10W2 = bool;
        this.age10W3 = bool;
        this.age10W4 = bool;
        this.age10W5 = bool;
        this.age10W6 = bool;
        this.age20W1 = bool;
        this.age20W2 = bool;
        this.age20W3 = bool;
        this.age20W4 = bool;
        this.age20W5 = bool;
        this.age20W6 = bool;
        this.age30W1 = bool;
        this.age30W2 = bool;
        this.age30W3 = bool;
        this.age30W4 = bool;
        this.age30W5 = bool;
        this.age30W6 = bool;
        this.age40W1 = bool;
        this.age40W2 = bool;
        this.age40W3 = bool;
        this.age40W4 = bool;
        this.age40W5 = bool;
        this.age40W6 = bool;
        this.age50W1 = bool;
        this.age50W2 = bool;
        this.age50W3 = bool;
        this.age50W4 = bool;
        this.age50W5 = bool;
        this.age50W6 = bool;
        this.age60W1 = bool;
        this.age60W2 = bool;
        this.age60W3 = bool;
        this.age60W4 = bool;
        this.age60W5 = bool;
        this.age60W6 = bool;
        this.stPopul = bool;
        this.bdPopul = bool;
        this.rPopul = bool;
        this.wPopul = bool;
        
    }

    public void Area3Dto(boolean bool) {
        this.join = bool;
        this.sumFoodEx = bool;
        this.sumCltEx = bool;
        this.sumNecEx = bool;
        this.sumMedEx = bool;
        this.sumTrpEx = bool;
        this.sumLeiEx = bool;
        this.sumCulEx = bool;
        this.sumEduEx = bool;
        this.sumEntEx = bool;        
    }

    //상권 업종(Default)
    public void Area2DefaultDto(boolean bool) {
        this.areaDivCd = bool;
        this.areaDivNm = bool;
        this.areaCd = bool;
        this.areaNm = bool;
        this.comCd = bool;
        this.comCd2 = bool;
        this.comNm = bool;

    }



}
