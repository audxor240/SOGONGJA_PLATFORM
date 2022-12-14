package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.sogongja.admin.service.ExcelService;
import com.stoneitgt.sogongja.admin.service.FaqService;
import com.stoneitgt.sogongja.admin.service.ReSearchShopService;
import com.stoneitgt.sogongja.domain.ReSearchShop;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Controller
@RequestMapping("/excel")
public class ExcelController extends BaseController {

    @Autowired
    private ExcelService excelService;

    @Autowired
    private FaqService faqService;

    @Autowired
    private ReSearchShopService reSearchShopService;

    @PostMapping("/read")
    public String readExcel(@RequestParam("file") MultipartFile file, @RequestParam("excelType") String excelType,
                            RedirectAttributes rttr, Model model)
            throws Exception { // 2

        long startTime = System.currentTimeMillis();

        ExcelSheetHandler excelSheetHandler = ExcelSheetHandler.readExcel(file);   //엑셀 읽어옴

        // excelDatas >>> [[nero@nate.com, Seoul], [jijeon@gmail.com, Busan], [jy.jeon@naver.com, Jeju]]
        List<List<String>> excelDatas = excelSheetHandler.getRows();


        String returnUrl = excelService.insertExcel(excelDatas,excelType, authenticationFacade.getLoginUserSeq());
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);

        //System.out.println("row 개수 :::: "+excelDatas.size());
        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" 소요시간  : " + resutTime/1000 + "(ms)");

        return returnUrl;

    }

    @PostMapping("/insertCheck")
    public ResponseEntity<?> insertCheck() {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        boolean result = excelService.insertSuccessCheck();
        if(result == true){
            resultMap.put("code", GlobalConstant.API_STATUS.SUCCESS);
        }else{
            resultMap.put("code", GlobalConstant.API_STATUS.FAIL);
        }

        return ResponseEntity.ok(resultMap);
    }


}
