package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.stoneitgt.sogongja.admin.service.CategoryService;
import com.stoneitgt.sogongja.admin.service.ReSearchShopService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.API_STATUS;
import com.stoneitgt.sogongja.admin.service.CodeService;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class RESTController extends BaseController {

//	private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

	@Autowired
	private CodeService codeService;

	@Autowired
	private CategoryService categoryService;
	@Autowired
	private ReSearchShopService reSearchShopService;

	private boolean downloadCheck = false;

	@PostMapping("/code/ref")
	@ResponseBody
	public ResponseEntity<?> getCodeRefList(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", codeService.getCodeRefList(params));
		System.out.println("result :: "+result);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/category2")
	@ResponseBody
	public ResponseEntity<?> getCategory2(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", categoryService.getCategory2(params));
		return ResponseEntity.ok(result);
	}

	@PostMapping("/category3")
	@ResponseBody
	public ResponseEntity<?> getCategory3(@RequestBody Map<String, Object> params) {

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("code", API_STATUS.SUCCESS);
		result.put("data", categoryService.getCategory3(params));
		return ResponseEntity.ok(result);
	}

	@PostMapping("/excel/download")
	public void excelDownload(HttpServletResponse response, @RequestParam String seqStr, @RequestParam String excelType, @RequestParam List<String> colHeader, @RequestParam List<String> colHeaderName
								, HttpServletRequest request) throws IOException {
	//public void excelDownload(HttpServletResponse response, @RequestBody Map<String, Object> params) throws IOException {
//        Workbook wb = new HSSFWorkbook();

		Map<String, Object> param = new HashMap<String, Object>();
		List<String> seqArr = Arrays.asList(seqStr.split(","));
		param.put("seqData", seqArr);

		List<Map<String,Object>> reSearchShopList = reSearchShopService.getReSearchShopAll(param);

		Workbook wb = new XSSFWorkbook();
		Sheet sheet = wb.createSheet("첫번째 시트");
		Row row = null;
		Cell cell = null;
		int rowNum = 0;

		// Header
		row = sheet.createRow(rowNum++);
		cell = row.createCell(0);
		for(int i =0; i < colHeader.size();i++){
			String colName = colHeaderName.get(i);
			cell = row.createCell(i);   //n번째
			cell.setCellValue(colName); //컬럼이름
		}

		for(int j = 0; j < reSearchShopList.size();j++){
			Map<String,Object> item = reSearchShopList.get(j);
			row = sheet.createRow(rowNum++);    //n번째 row
			for(int p = 0;p < colHeader.size();p++){

				String colValue = colHeader.get(p);

				String val = "";
				if(item.get(colValue) != null){
					val = item.get(colValue).toString();
				}
				cell = row.createCell(p);           //n번째 row의 열
				cell.setCellValue(val);     //열의 값
			}
		}

		String excelName = "";
		switch (excelType){
			case "shop":  excelName = "상점 데이터"; break;
			case "analysis1":  excelName = "상권 데이터(일반)"; break;
			case "analysis2":  excelName = "상권 데이터(업종)"; break;
			case "region":  excelName = "지역 데이터"; break;
		}
		//한글 깨짐으로 인코딩 처리
		String outputFileName = new String(excelName.getBytes("KSC5601"), "8859_1");


		response.setContentType("ms-vnd/excel");
		//response.setContentType("application/vnd.ms-excel; charset=euc-kr");
//        response.setHeader("Content-Disposition", "attachment;filename=example.xls");
		response.setHeader("Content-Disposition", "attachment;filename="+outputFileName+".xlsx");
		Cookie cookie = new Cookie("fileDownloadToken", "TRUE");
		response.addCookie(cookie);

		downloadCheck = true;

		// Excel File Output
		wb.write(response.getOutputStream());
		wb.close();

	}

	@PostMapping("/excel/downloadCheck")
	public ResponseEntity<?> downloadCheck() {
		Map<String, Object> result = new HashMap<String, Object>();

		if(downloadCheck == true){
			result.put("code", API_STATUS.SUCCESS);
			downloadCheck = false;
		}else{
			result.put("code", API_STATUS.FAIL);
		}

		return ResponseEntity.ok(result);
	}

}
