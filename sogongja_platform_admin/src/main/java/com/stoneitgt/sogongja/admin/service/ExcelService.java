package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.domain.Faq;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService extends BaseService {

    @Autowired
    private FaqService faqService;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public String insertExcel(Sheet worksheet, String excelType, int loginUserSeq) throws IOException {

        List<Map<String,Object>> return_data = null;
        String returnUrl = "";
        switch (excelType){
            case "faq": faqDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/faq"; break;
        }

        return returnUrl;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void faqDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        faqService.deleteAllFaq(loginUserSeq);  //faq 전체 삭제

        List<Faq> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            Faq data = new Faq();

            data.setType(row.getCell(0).getStringCellValue());
            data.setSubject(row.getCell(1).getStringCellValue());
            data.setContent(row.getCell(2).getStringCellValue());
            data.setLoginUserSeq(loginUserSeq);
            switch (row.getCell(0).getStringCellValue()){
                case "CON": data.setTypeColor("primary"); data.setTypeName("소공자 컨설팅"); break;
                case "EDU": data.setTypeColor("success"); data.setTypeName("소공자 교육"); break;
                case "GUIDE": data.setTypeColor("info"); data.setTypeName("이용 가이드"); break;
                case "USER": data.setTypeColor("dark"); data.setTypeName("소공자 회원"); break;
            }
            dataList.add(data);

        }
        faqService.saveFaqBoard(dataList);
    }

}
