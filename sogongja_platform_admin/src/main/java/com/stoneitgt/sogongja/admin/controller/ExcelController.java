package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.sogongja.admin.service.ExcelService;
import com.stoneitgt.sogongja.admin.service.FaqService;
import org.apache.commons.io.FilenameUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/excel")
public class ExcelController extends BaseController {

    @Autowired
    private ExcelService excelService;

    @Autowired
    private FaqService faqService;

    @PostMapping("/read")
    public String readExcel(@RequestParam("file") MultipartFile file, @RequestParam("excelType") String excelType, Model model)
            throws IOException { // 2

        List<Map<String,Object>> dataList = new ArrayList<>();

        String extension = FilenameUtils.getExtension(file.getOriginalFilename()); // 3

        if (!extension.equals("xlsx") && !extension.equals("xls")) {
            throw new IOException("엑셀파일만 업로드 해주세요.");
        }
        Workbook workbook = null;

        if (extension.equals("xlsx")) {
            workbook = new XSSFWorkbook(file.getInputStream());
        } else if (extension.equals("xls")) {
            workbook = new HSSFWorkbook(file.getInputStream());
        }

        Sheet worksheet = workbook.getSheetAt(0);

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());

        String returnUrl = excelService.insertExcel(worksheet,excelType, authenticationFacade.getLoginUserSeq());

        return returnUrl;

    }
}