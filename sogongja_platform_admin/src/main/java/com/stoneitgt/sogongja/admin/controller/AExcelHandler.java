package com.stoneitgt.sogongja.admin.controller;

import java.util.HashMap;
import java.util.List;

public class AExcelHandler extends ExcelHandler{


    public AExcelHandler(String[] header, String fileName, String sheetName, int size, String excelType, List<String> colHeader) {
        super.ExcelHandler(header, fileName, sheetName, size, excelType, colHeader);
    }

    @Override
    public void createExcelBody(HashMap<String, String> map,String excelType, List<String> colHeader) {
        int cellNum = 0;

        //1. row생성
        this.objRow = objSheet.createRow(this.rowNum++);    //1번째

        //2-1. cell생성
        //2-2. 값매핑
        setExcelCell(cellNum++, this.dataIdx++);
        for (String item:colHeader) {
            setExcelCell(cellNum++, map.get(item.toUpperCase()));   //header의 컬럼 정보만 다운로드한다(DB의 컬럼명과 일치해야함)
        }
        /*switch (excelType){
            case "shop":
                setExcelCell(cellNum++, map.get("SHOP_NO"));
                setExcelCell(cellNum++, map.get("SHOP_NM"));
                setExcelCell(cellNum++, map.get("BRANCH"));
                setExcelCell(cellNum++, map.get("CODE_TYPE1"));
                setExcelCell(cellNum++, map.get("NM_TYPE1"));
                setExcelCell(cellNum++, map.get("CODE_TYPE2"));
                setExcelCell(cellNum++, map.get("NM_TYPE2"));
                setExcelCell(cellNum++, map.get("CODE_TYPE3"));
                setExcelCell(cellNum++, map.get("NM_TYPE3"));
                setExcelCell(cellNum++, map.get("ADDR_CD"));
                setExcelCell(cellNum++, map.get("ADDR"));
                setExcelCell(cellNum++, map.get("ST_ADDR"));
                setExcelCell(cellNum++, map.get("EMD_CD"));
                setExcelCell(cellNum++, map.get("EMD_NM"));
                setExcelCell(cellNum++, map.get("LONGITUDE"));
                setExcelCell(cellNum++, map.get("LATITUDE"));
                setExcelCell(cellNum++, map.get("SUB_STA_NM"));
                setExcelCell(cellNum++, map.get("SUB_STA_NO"));
                setExcelCell(cellNum++, map.get("AVE_SUB_PASS_ON"));
                setExcelCell(cellNum++, map.get("AVE_SUB_PASS_OFF"));
                setExcelCell(cellNum++, map.get("SUM_SUB_PASS_ON"));
                setExcelCell(cellNum++, map.get("SUM_SUB_PASS_OFF"));
                setExcelCell(cellNum++, map.get("BUS_STA_NM"));
                setExcelCell(cellNum++, map.get("ARS_ID"));
                setExcelCell(cellNum++, map.get("AVE_BUS_PASS_ON"));
                setExcelCell(cellNum++, map.get("AVE_BUS_PASS_OFF"));
                setExcelCell(cellNum++, map.get("SUM_BUS_PASS_ON"));
                setExcelCell(cellNum++, map.get("SUM_BUS_PASS_OFF"));
                setExcelCell(cellNum++, map.get("APPRV_DATE"));
                setExcelCell(cellNum++, map.get("CT_GRD"));
                setExcelCell(cellNum++, map.get("CT_BASE"));
                setExcelCell(cellNum++, map.get("PINCP_USE_CD"));
                setExcelCell(cellNum++, map.get("PRINCP_USE"));
                setExcelCell(cellNum++, map.get("OTHER_USE"));
                break;
            case "analysis1":
                setExcelCell(cellNum++, map.get("YEAR"));
                setExcelCell(cellNum++, map.get("QRT"));
                setExcelCell(cellNum++, map.get("AREA_DIV_CD"));
                setExcelCell(cellNum++, map.get("AREA_CD"));
                setExcelCell(cellNum++, map.get("AREA_NM"));
                setExcelCell(cellNum++, map.get("JOIN"));
                setExcelCell(cellNum++, map.get("LIV_POPUL"));
                setExcelCell(cellNum++, map.get("M_POPUL"));
                setExcelCell(cellNum++, map.get("F_POPUL"));
                setExcelCell(cellNum++, map.get("AGE_10_D_1"));
                setExcelCell(cellNum++, map.get("AGE_10_D_2"));
                setExcelCell(cellNum++, map.get("AGE_10_D_3"));
                setExcelCell(cellNum++, map.get("AGE_10_D_4"));
                setExcelCell(cellNum++, map.get("AGE_10_D_5"));
                setExcelCell(cellNum++, map.get("AGE_10_D_6"));
                setExcelCell(cellNum++, map.get("AGE_20_D_1"));
                setExcelCell(cellNum++, map.get("AGE_20_D_2"));
                setExcelCell(cellNum++, map.get("AGE_20_D_3"));
                setExcelCell(cellNum++, map.get("AGE_20_D_4"));
                setExcelCell(cellNum++, map.get("AGE_20_D_5"));
                setExcelCell(cellNum++, map.get("AGE_20_D_6"));
                setExcelCell(cellNum++, map.get("AGE_30_D_1"));
                setExcelCell(cellNum++, map.get("AGE_30_D_2"));
                setExcelCell(cellNum++, map.get("AGE_30_D_3"));
                setExcelCell(cellNum++, map.get("AGE_30_D_4"));
                setExcelCell(cellNum++, map.get("AGE_30_D_5"));
                setExcelCell(cellNum++, map.get("AGE_30_D_6"));
                setExcelCell(cellNum++, map.get("AGE_40_D_1"));
                setExcelCell(cellNum++, map.get("AGE_40_D_2"));
                setExcelCell(cellNum++, map.get("AGE_40_D_3"));
                setExcelCell(cellNum++, map.get("AGE_40_D_4"));
                setExcelCell(cellNum++, map.get("AGE_40_D_5"));
                setExcelCell(cellNum++, map.get("AGE_40_D_6"));
                setExcelCell(cellNum++, map.get("AGE_50_D_1"));
                setExcelCell(cellNum++, map.get("AGE_50_D_2"));
                setExcelCell(cellNum++, map.get("AGE_50_D_3"));
                setExcelCell(cellNum++, map.get("AGE_50_D_4"));
                setExcelCell(cellNum++, map.get("AGE_50_D_5"));
                setExcelCell(cellNum++, map.get("AGE_50_D_6"));
                setExcelCell(cellNum++, map.get("AGE_60_D_1"));
                setExcelCell(cellNum++, map.get("AGE_60_D_2"));
                setExcelCell(cellNum++, map.get("AGE_60_D_3"));
                setExcelCell(cellNum++, map.get("AGE_60_D_4"));
                setExcelCell(cellNum++, map.get("AGE_60_D_5"));
                setExcelCell(cellNum++, map.get("AGE_60_D_6"));
                setExcelCell(cellNum++, map.get("AGE_10_W_1"));
                setExcelCell(cellNum++, map.get("AGE_10_W_2"));
                setExcelCell(cellNum++, map.get("AGE_10_W_3"));
                setExcelCell(cellNum++, map.get("AGE_10_W_4"));
                setExcelCell(cellNum++, map.get("AGE_10_W_5"));
                setExcelCell(cellNum++, map.get("AGE_10_W_6"));
                setExcelCell(cellNum++, map.get("AGE_20_W_1"));
                setExcelCell(cellNum++, map.get("AGE_20_W_2"));
                setExcelCell(cellNum++, map.get("AGE_20_W_3"));
                setExcelCell(cellNum++, map.get("AGE_20_W_4"));
                setExcelCell(cellNum++, map.get("AGE_20_W_5"));
                setExcelCell(cellNum++, map.get("AGE_20_W_6"));
                setExcelCell(cellNum++, map.get("AGE_30_W_1"));
                setExcelCell(cellNum++, map.get("AGE_30_W_2"));
                setExcelCell(cellNum++, map.get("AGE_30_W_3"));
                setExcelCell(cellNum++, map.get("AGE_30_W_4"));
                setExcelCell(cellNum++, map.get("AGE_30_W_5"));
                setExcelCell(cellNum++, map.get("AGE_30_W_6"));
                setExcelCell(cellNum++, map.get("AGE_40_W_1"));
                setExcelCell(cellNum++, map.get("AGE_40_W_2"));
                setExcelCell(cellNum++, map.get("AGE_40_W_3"));
                setExcelCell(cellNum++, map.get("AGE_40_W_4"));
                setExcelCell(cellNum++, map.get("AGE_40_W_5"));
                setExcelCell(cellNum++, map.get("AGE_40_W_6"));
                setExcelCell(cellNum++, map.get("AGE_50_W_1"));
                setExcelCell(cellNum++, map.get("AGE_50_W_2"));
                setExcelCell(cellNum++, map.get("AGE_50_W_3"));
                setExcelCell(cellNum++, map.get("AGE_50_W_4"));
                setExcelCell(cellNum++, map.get("AGE_50_W_5"));
                setExcelCell(cellNum++, map.get("AGE_50_W_6"));
                setExcelCell(cellNum++, map.get("AGE_60_W_1"));
                setExcelCell(cellNum++, map.get("AGE_60_W_2"));
                setExcelCell(cellNum++, map.get("AGE_60_W_3"));
                setExcelCell(cellNum++, map.get("AGE_60_W_4"));
                setExcelCell(cellNum++, map.get("AGE_60_W_5"));
                setExcelCell(cellNum++, map.get("AGE_60_W_6"));
                setExcelCell(cellNum++, map.get("ST_POPUL"));
                setExcelCell(cellNum++, map.get("BD_POPUL"));
                setExcelCell(cellNum++, map.get("R_POPUL"));
                setExcelCell(cellNum++, map.get("W_POPUL"));
                setExcelCell(cellNum++, map.get("SUM_FOOD_EX"));
                setExcelCell(cellNum++, map.get("SUM_CLT_EX"));
                setExcelCell(cellNum++, map.get("SUM_NEC_EX"));
                setExcelCell(cellNum++, map.get("SUM_MED_EX"));
                setExcelCell(cellNum++, map.get("SUM_TRP_EX"));
                setExcelCell(cellNum++, map.get("SUM_LEI_EX"));
                setExcelCell(cellNum++, map.get("SUM_CUL_EX"));
                setExcelCell(cellNum++, map.get("SUM_EDU_EX"));
                setExcelCell(cellNum++, map.get("SUM_ENT_EX"));
                setExcelCell(cellNum++, map.get("CT_APT_COM"));
                setExcelCell(cellNum++, map.get("CT_APT_HOU"));
                setExcelCell(cellNum++, map.get("IDX_STB_AREA"));
                break;
            case "analysis2":
                setExcelCell(cellNum++, map.get("YEAR"));
                setExcelCell(cellNum++, map.get("QRT"));
                setExcelCell(cellNum++, map.get("AREA_DIV_CD"));
                setExcelCell(cellNum++, map.get("AREA_DIV_NM"));
                setExcelCell(cellNum++, map.get("AREA_CD"));
                setExcelCell(cellNum++, map.get("EMD_CD"));
                setExcelCell(cellNum++, map.get("AREA_NM"));
                setExcelCell(cellNum++, map.get("COM_CD"));
                setExcelCell(cellNum++, map.get("COM_CD2"));
                setExcelCell(cellNum++, map.get("COM_NM"));
                setExcelCell(cellNum++, map.get("CT_SHOP"));
                setExcelCell(cellNum++, map.get("CT_SHOP_SIM"));
                setExcelCell(cellNum++, map.get("PER_OPEN"));
                setExcelCell(cellNum++, map.get("CT_OPEN"));
                setExcelCell(cellNum++, map.get("PER_CLOSE"));
                setExcelCell(cellNum++, map.get("CT_CLOSE"));
                setExcelCell(cellNum++, map.get("CT_FRANCHISE"));
                setExcelCell(cellNum++, map.get("SUM_00_06"));
                setExcelCell(cellNum++, map.get("SUM_06_11"));
                setExcelCell(cellNum++, map.get("SUM_11_14"));
                setExcelCell(cellNum++, map.get("SUM_14_17"));
                setExcelCell(cellNum++, map.get("SUM_17_21"));
                setExcelCell(cellNum++, map.get("SUM_21_24"));
                break;

            case "region":
                setExcelCell(cellNum++, map.get("YEAR"));
                setExcelCell(cellNum++, map.get("QRT"));
                setExcelCell(cellNum++, map.get("CTPRVN_CD"));
                setExcelCell(cellNum++, map.get("CTPRVN_NM"));
                setExcelCell(cellNum++, map.get("SIGNGU_CD"));
                setExcelCell(cellNum++, map.get("SIGNGU_NM"));
                setExcelCell(cellNum++, map.get("EMD_CD"));
                setExcelCell(cellNum++, map.get("EMD_NM"));
                setExcelCell(cellNum++, map.get("SUM_POPUL"));
                setExcelCell(cellNum++, map.get("R_POPUL"));
                setExcelCell(cellNum++, map.get("W_POPUL"));
                setExcelCell(cellNum++, map.get("HOUSE_1"));
                setExcelCell(cellNum++, map.get("HOUSE_2"));
                setExcelCell(cellNum++, map.get("HOUSE_3"));
                setExcelCell(cellNum++, map.get("HOUSE_4"));
                setExcelCell(cellNum++, map.get("HOUSE_5"));
                setExcelCell(cellNum++, map.get("HOUSE_6"));
                setExcelCell(cellNum++, map.get("HOUSE_7"));
                setExcelCell(cellNum++, map.get("CT_SHOP_U20S"));
                setExcelCell(cellNum++, map.get("CT_SHOP_30S"));
                setExcelCell(cellNum++, map.get("CT_SHOP_40S"));
                setExcelCell(cellNum++, map.get("CT_SHOP_50S"));
                setExcelCell(cellNum++, map.get("CT_SHOP_O60S"));
                setExcelCell(cellNum++, map.get("RT_ALL"));
                setExcelCell(cellNum++, map.get("RT_1F"));
                setExcelCell(cellNum++, map.get("RT_OTHER"));
                break;
        }*/
    }
}