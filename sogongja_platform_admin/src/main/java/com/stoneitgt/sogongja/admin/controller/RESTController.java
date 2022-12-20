package com.stoneitgt.sogongja.admin.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.stoneitgt.sogongja.admin.service.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stoneitgt.common.GlobalConstant.API_STATUS;

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

	@Autowired
	private ReSearchAreaService reSearchAreaService;

	@Autowired
	private ReSearchRegionService reSearchRegionService;

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
	public void excelDownload(HttpServletResponse response, @RequestParam String seqStr, @RequestParam String excelType, @RequestParam List<String> colHeader, @RequestParam List<String> colHeaderName,
								@RequestParam(required=false, defaultValue= "0") String type, @RequestParam(required=false, defaultValue= "0") String subType, HttpServletRequest request) throws IOException {
	//public void excelDownload(HttpServletResponse response, @RequestBody Map<String, Object> params) throws IOException {

		//LOGGER.info("*****************poi 라이브러리를 활용한 대용량 엑셀다운로드 로직 START*****************");
		System.out.println("subType :: "+subType);
		long startTime = System.currentTimeMillis();

		String excelName = "";
		String sheetName = "";
		switch (excelType){
			case "shop":
				excelName = "상점 데이터";
				sheetName = "전체";
				break;
			case "analysis1":

				if(subType.equals("0")){
					sheetName = "전체";
				}else if(subType.equals("1")){
					sheetName = "상권";
				}else if(subType.equals("2")){
					sheetName = "인구";
				}else if(subType.equals("3")){
					sheetName = "소득소비";
				}else if(subType.equals("4")){
					sheetName = "아파트";
				}else if(subType.equals("5")){
					sheetName = "상권안정화지표";
				}
				excelName = "상권 데이터(일반)-"+sheetName;
				break;
			case "analysis2":
				if(subType.equals("0")){
					sheetName = "전체";
				}else if(subType.equals("6")){
					sheetName = "점포";
				}else if(subType.equals("7")){
					sheetName = "추정매출";
				}else if(subType.equals("8")){
					sheetName = "개폐업";
				}
				excelName = "상권 데이터(업종)-"+sheetName;
				break;
			case "region":
				if(type.equals("region0")){
					sheetName = "전체";
				}else if(type.equals("region1")){
					sheetName = "인구";
				}else if(type.equals("region2")){
					sheetName = "대표자 연령대별 사업체수";
				}else if(type.equals("region3")){
					sheetName = "가구원수별 가구수";
				}else if(type.equals("region4")){
					sheetName = "임대시세";
				}

				excelName = "지역 데이터-"+sheetName;
				break;
		}

		//한글 깨짐으로 인코딩 처리
		String outputFileName = new String(excelName.getBytes("KSC5601"), "8859_1");

		//엑셀생성(header 생성, 액셀헤더생성 -> 액셀바디생성 -> 액셀파일쓰기)
		//String[] header = {"번호","구분","컬럼1","컬럼2","컬럼3","컬럼4"};
		String[] header = colHeaderName.toArray(new String[0]);

		ExcelHandler excelHandler = new AExcelHandler(header, outputFileName,sheetName,500, excelType, colHeader);
		excelHandler.createExcelHeader();	//헤더를 만들어준다

		//해당 메서드 인자값으로 excelHandler를 넘겨준다
		//selectDbService(excelHandler); //각자 db 조회하는 서비스..(DAO, Mapper 등등)
		//조회하면서 row하나씩 엑셀로 만들어준다
		System.out.println("excelType >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+excelType);
		switch (excelType) {
			//무조건 void적용 ,return 없어야함
			case "shop": reSearchShopService.getReSearchShopAll(excelHandler); break;
			case "analysis1": reSearchAreaService.getReSearchAreaAll(excelHandler); break;
			case "analysis2": reSearchAreaService.getReSearchAreaComAll(excelHandler); break;
			case "region": reSearchRegionService.getReSearchRegionAll(excelHandler); break;
		}

		downloadCheck = true;	//완료처리
		long endTime = System.currentTimeMillis();
		long resutTime = endTime - startTime;

		System.out.println(" 소요시간  : " + resutTime/1000 + "(ms)");
		excelHandler.writeExcelFile(response);

		//LOGGER.info("*****************poi 라이브러리를 활용한 대용량 엑셀다운로드 로직 END*****************");
	}

	@PostMapping("/excel/downloadCheck")
	public ResponseEntity<?> downloadCheck() {
		Map<String, Object> result = new HashMap<String, Object>();
		System.out.println("downloadCheck :: "+downloadCheck);
		if(downloadCheck == true){
			result.put("code", API_STATUS.SUCCESS);
			downloadCheck = false;
		}else{
			result.put("code", API_STATUS.FAIL);
		}

		return ResponseEntity.ok(result);
	}

}
