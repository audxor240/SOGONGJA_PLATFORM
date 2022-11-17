package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.*;
import com.stoneitgt.sogongja.domain.*;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExcelService extends BaseService {

    @Autowired
    private FaqService faqService;

    @Autowired
    private EducationService educationService;
    @Autowired
    private ConsultingService consultingService;

    @Autowired
    private CounselingService counselingService;

    @Autowired
    private BoardService boardService;

    @Autowired
    private SupportMapper supportMapper;

    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private EducationMapper educationMapper;
    @Autowired
    private ConsultingMapper consultingMapper;
    @Autowired
    private BoardMapper boardMapper;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public String insertExcel(Sheet worksheet, String excelType, int loginUserSeq) throws IOException {

        List<Map<String,Object>> return_data = null;
        String returnUrl = "";
        switch (excelType){
            case "edu": eduDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/education"; break;   //교육
            case "con": conDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/consulting"; break;  //컨설팅
            case "cou": couDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/counseling"; break;  //상담사례
            case "pro": proDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/board/project"; break;     //지원 및 정책
            case "faq": faqDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/faq"; break;         //faq
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

            String type = row.getCell(0).getStringCellValue();
            switch (type){
                case "소공자 컨설팅": data.setType("CON"); data.setTypeColor("primary"); data.setTypeName(type); break;
                case "소공자 교육": data.setType("EDU"); data.setTypeColor("success"); data.setTypeName(type); break;
                case "이용 가이드": data.setType("GUIDE"); data.setTypeColor("info"); data.setTypeName(type); break;
                case "소공자 회원": data.setType("USER"); data.setTypeColor("dark"); data.setTypeName(type); break;
            }
            data.setSubject(row.getCell(1).getStringCellValue());
            data.setContent(row.getCell(2).getStringCellValue());
            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

        }
        faqService.saveFaqBoard(dataList);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void eduDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        //educationMapper.deleteAllEducation(loginUserSeq);  //교육 전체 삭제

        List<Education> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            Education data = new Education();

            String subject = row.getCell(0).getStringCellValue();
            String supportName = row.getCell(2).getStringCellValue();
            String category1Name = row.getCell(5).getStringCellValue();
            String category2Name = row.getCell(6).getStringCellValue();
            String category3Name = row.getCell(7).getStringCellValue();

            int subjectCnt = educationMapper.checkEducationSubject(subject);
            if(subjectCnt > 0){ //같은 이름의 교육이 있으면 패스
                continue;
            }

            Support support = supportMapper.getSupport(supportName);

            Category1 category1 = categoryMapper.getCategory1Infomation(category1Name);
            Category2 category2 = categoryMapper.getCategory2Infomation(category2Name);
            Category3 category3 = categoryMapper.getCategory3Infomation(category3Name);

            data.setSubject(row.getCell(0).getStringCellValue());           //교육명
            data.setContent(row.getCell(1).getStringCellValue());           //교육내용
            data.setSupportOrg(Integer.toString(support.getSupportSeq()));          //제공기관
            data.setEduUrl(row.getCell(3).getStringCellValue());            //URL
            data.setTags(row.getCell(4).getStringCellValue().trim());       //키워드
            data.setCategory1(Integer.toString(category1.getCategory1Seq()));      //대분류
            data.setCategory2(Integer.toString(category2.getCategory2Seq()));      //중분류
            data.setCategory3(Integer.toString(category3.getCategory3Seq()));      //소분류

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

        }
        System.out.println("dataList :: "+dataList);
        educationService.insertEducationExcel(dataList);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void conDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        //educationMapper.deleteAllEducation(loginUserSeq);  //교육 전체 삭제

        List<Consulting> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            Consulting data = new Consulting();

            String subject = row.getCell(0).getStringCellValue();
            String supportName = row.getCell(5).getStringCellValue();
            String category1Name = row.getCell(8).getStringCellValue();
            String category2Name = row.getCell(9).getStringCellValue();
            String category3Name = row.getCell(10).getStringCellValue();

            int subjectCnt = consultingMapper.checkConsultingSubject(subject);
            if(subjectCnt > 0){ //같은 이름의 컨설팅이 있으면 패스
                continue;
            }

            Support support = supportMapper.getSupport(supportName);

            Category1 category1 = categoryMapper.getCategory1Infomation(category1Name);
            Category2 category2 = categoryMapper.getCategory2Infomation(category2Name);
            Category3 category3 = categoryMapper.getCategory3Infomation(category3Name);

            data.setSubject(row.getCell(0).getStringCellValue());           //컨설팅명
            data.setContent(row.getCell(1).getStringCellValue());           //설명
            data.setSupportContent(row.getCell(2).getStringCellValue());    //지원내용
            data.setSupportBy(row.getCell(3).getStringCellValue());         //지원대상
            data.setRegion(row.getCell(4).getStringCellValue());            //지역
            data.setSupportOrg(Integer.toString(support.getSupportSeq()));          //제공기관
            data.setConUrl(row.getCell(6).getStringCellValue());            //URL
            data.setTags(row.getCell(7).getStringCellValue().trim());       //키워드
            data.setCategory1(Integer.toString(category1.getCategory1Seq()));      //대분류
            data.setCategory2(Integer.toString(category2.getCategory2Seq()));      //중분류
            data.setCategory3(Integer.toString(category3.getCategory3Seq()));      //소분류

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

        }
        System.out.println("dataList :: "+dataList);
        consultingService.insertConsultingExcel(dataList);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void couDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        //educationMapper.deleteAllEducation(loginUserSeq);  //교육 전체 삭제

        List<Counseling> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);
            System.out.println("row :: "+row);
            Counseling data = new Counseling();

            String field = row.getCell(0).getStringCellValue();
            switch (field){
                case "법률": data.setField(1); break;
                case "노무": data.setField(2); break;
                case "세무": data.setField(3); break;
                case "회계": data.setField(4); break;
                case "지적재산": data.setField(5); break;
                case "관세": data.setField(6); break;
                case "법무": data.setField(7); break;
                case "경영컨설팅": data.setField(8); break;
            }
            String supportName = row.getCell(1).getStringCellValue();

            Support support = supportMapper.getSupport(supportName);
            data.setField(data.getField());                                         //상담분야
            data.setSupportOrg(Integer.toString(support.getSupportSeq()));          //제공기관
            data.setYear(String.valueOf((int) row.getCell(2).getNumericCellValue()));              //해당연도
            data.setCounselor(row.getCell(3).getStringCellValue());         //상담사
            data.setQuestion(row.getCell(4).getStringCellValue());          //질문
            data.setContent(row.getCell(5).getStringCellValue());           //사례내용
            data.setTags(row.getCell(6).getStringCellValue().trim());       //키워드

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

        }
        System.out.println("dataList :: "+dataList);
        counselingService.insertCounselingExcel(dataList);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void proDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        //educationMapper.deleteAllEducation(loginUserSeq);  //교육 전체 삭제

        List<Project> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);
            Project data = new Project();
            Map<String, Object> map = new HashMap<>();

            map.put("type",row.getCell(0).getStringCellValue());
            map.put("title",row.getCell(1).getStringCellValue());
            map.put("year",row.getCell(3).getStringCellValue());
            map.put("areaNm",row.getCell(4).getStringCellValue());
            //등록된 프로젝트가 있는지 조회
            String projectSeq = boardMapper.getProjectCheck(map);
            if(projectSeq != null){ //프로젝트가 있으면 패스
                continue;
            }

            String playType = row.getCell(4).getStringCellValue();

            data.setProjectType(row.getCell(0).getStringCellValue());          //분류
            data.setSubject(row.getCell(1).getStringCellValue());              //지원사업명
            data.setProjectUrl(row.getCell(2).getStringCellValue());           //URL
            data.setProjectYear(row.getCell(3).getStringCellValue());          //사업년도

            switch (playType){
                case "전국": data.setPlaceType("1"); break;
                case "서울/강원": data.setPlaceType("2"); break;
                case "인천/경기": data.setPlaceType("3"); break;
                case "대전/세종/충청": data.setPlaceType("4"); break;
                case "대구/경북": data.setPlaceType("5"); break;
                case "부산/울산/경남": data.setPlaceType("6"); break;
                case "광주/전라/제주": data.setPlaceType("7"); break;
            }

            data.setLoginUserSeq(loginUserSeq);
            dataList.add(data);

        }
        System.out.println("dataList :: "+dataList);
        boardService.insertProjectExcel(dataList);
    }

}
