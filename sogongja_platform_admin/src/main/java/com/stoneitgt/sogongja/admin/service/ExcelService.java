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
    private ReSearchShopService reSearchShopService;

    @Autowired
    private ReSearchAreaService reSearchAreaService;

    @Autowired
    private ReSearchRegionService reSearchRegionService;

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

    @Autowired
    private ReSearchShopMapper reSearchShopMapper;
    @Autowired
    private ReSearchAreaMapper reSearchAreaMapper;

    @Autowired
    private ReSearchRegionMapper reSearchRegionMapper;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public String insertExcel(Sheet worksheet, String excelType, int loginUserSeq) throws IOException {
        System.out.println("excelType >>> "+excelType);
        String returnUrl = "";
        switch (excelType){
            case "edu": eduDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/education"; break;   //교육
            case "con": conDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/consulting"; break;  //컨설팅
            case "cou": couDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/counseling"; break;  //상담사례
            case "pro": proDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/board/project"; break;     //지원 및 정책
            case "faq": faqDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/faq"; break;         //faq
            case "shop": reSearchShopDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/areaSetting/shop"; break;         //상점데이터
            case "analysis1": reSearchArea1DataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/areaSetting/analysis?type=1&subType=0"; break;         //상점데이터(일반)
            case "analysis2": reSearchArea2DataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/areaSetting/analysis?type=2&subType=0"; break;         //상점데이터(업종)
            case "region": reSearchRegionDataInsert(worksheet, loginUserSeq); returnUrl = "redirect:/areaSetting/regional?type=region0"; break;         //상점데이터(업종)
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

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchShopDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");
        List<ReSearchShop> dataList = new ArrayList<>();
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ReSearchShop data = new ReSearchShop();

            System.out.println("Setting COUNT :: "+i);

            int shopNo = Integer.parseInt(row.getCell(0).getStringCellValue());
            int reSearchShopCnt = reSearchShopMapper.checkReSearchShop(shopNo);
            if(reSearchShopCnt > 0){ //같은 상점이 있으면 패스
                continue;
            }

            String apprvDate = "0000-00-00 00:00:00";
            if(!row.getCell(28).getStringCellValue().equals("")){
                apprvDate = row.getCell(28).getStringCellValue();
            }

            data.setShopNo(shopNo);
            data.setShopNm(row.getCell(1).getStringCellValue());
            data.setBranch(row.getCell(2).getStringCellValue());
            data.setCodeType1(row.getCell(3).getStringCellValue());
            data.setNmType1(row.getCell(4).getStringCellValue());
            data.setCodeType2(row.getCell(5).getStringCellValue());
            data.setNmType2(row.getCell(6).getStringCellValue());
            data.setCodeType3(row.getCell(7).getStringCellValue());
            data.setNmType3(row.getCell(8).getStringCellValue());
            data.setAddrCd(row.getCell(9).getStringCellValue());
            data.setAddr(row.getCell(10).getStringCellValue());
            data.setStAddr(row.getCell(11).getStringCellValue());
            data.setEmdCd(row.getCell(12).getStringCellValue());
            data.setEmdNm(row.getCell(13).getStringCellValue());
            data.setLongitude(Float.parseFloat(row.getCell(14).getStringCellValue()));
            data.setLatitude(Float.parseFloat(row.getCell(15).getStringCellValue()));
            data.setSubStaNm(row.getCell(16).getStringCellValue());
            data.setSubStaNo(row.getCell(17).getStringCellValue());
            data.setAveSubPassOn(Float.parseFloat(row.getCell(18).getStringCellValue()));
            data.setAveSubPassOff(Float.parseFloat(row.getCell(19).getStringCellValue()));
            data.setSumSubPassOn(Float.parseFloat(row.getCell(20).getStringCellValue()));
            data.setSumSubPassOff(Float.parseFloat(row.getCell(21).getStringCellValue()));
            data.setBusStaNm(row.getCell(22).getStringCellValue());
            data.setArsId(row.getCell(23).getStringCellValue());
            data.setAveBusPassOn(Float.parseFloat(row.getCell(24).getStringCellValue()));
            data.setAveBusPassOff(Float.parseFloat(row.getCell(25).getStringCellValue()));
            data.setSumBusPassOn(Float.parseFloat(row.getCell(26).getStringCellValue()));
            data.setSumBusPassOff(Float.parseFloat(row.getCell(27).getStringCellValue()));
            data.setApprvDate(apprvDate);
            data.setCtGrd(Integer.parseInt(row.getCell(29).getStringCellValue()));
            data.setCtBase(Integer.parseInt(row.getCell(30).getStringCellValue()));
            data.setPincpUseCd(Integer.parseInt(row.getCell(31).getStringCellValue()));
            data.setPincpUse(row.getCell(32).getStringCellValue());
            data.setOtherUse(row.getCell(33).getStringCellValue());
            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

            if(apprvDate.equals("")){
                System.out.println("data :: "+data);
                return;
            }
        }
        reSearchShopService.insertReSearchShopExcel(dataList);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchArea1DataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");
        List<ReSearchArea> dataList = new ArrayList<>();
        int line = 5000;
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ReSearchArea data = new ReSearchArea();

            System.out.println("Setting COUNT :: "+i);

            String join = row.getCell(5).getStringCellValue();
            int reSearchAreaCnt = reSearchAreaMapper.checkReSearchArea(join);
            if(reSearchAreaCnt > 0){ //같은 상권이 있으면 패스
                continue;
            }

            data.setYear(Integer.parseInt(row.getCell(0).getStringCellValue()));
            data.setQrt(Integer.parseInt(row.getCell(1).getStringCellValue()));
            data.setAreaDivCd(row.getCell(2).getStringCellValue());
            data.setAreaCd(row.getCell(3).getStringCellValue());
            data.setAreaNm(row.getCell(4).getStringCellValue());
            data.setJoin(row.getCell(5).getStringCellValue());
            data.setLivPopul(Integer.parseInt(row.getCell(6).getStringCellValue()));
            data.setMPopul(Integer.parseInt(row.getCell(7).getStringCellValue()));
            data.setFPopul(Integer.parseInt(row.getCell(8).getStringCellValue()));
            data.setAge10D1(Integer.parseInt(row.getCell(9).getStringCellValue()));
            data.setAge10D2(Integer.parseInt(row.getCell(10).getStringCellValue()));
            data.setAge10D3(Integer.parseInt(row.getCell(11).getStringCellValue()));
            data.setAge10D4(Integer.parseInt(row.getCell(12).getStringCellValue()));
            data.setAge10D5(Integer.parseInt(row.getCell(13).getStringCellValue()));
            data.setAge10D6(Integer.parseInt(row.getCell(14).getStringCellValue()));
            data.setAge20D1(Integer.parseInt(row.getCell(15).getStringCellValue()));
            data.setAge20D2(Integer.parseInt(row.getCell(16).getStringCellValue()));
            data.setAge20D3(Integer.parseInt(row.getCell(17).getStringCellValue()));
            data.setAge20D4(Integer.parseInt(row.getCell(18).getStringCellValue()));
            data.setAge20D5(Integer.parseInt(row.getCell(19).getStringCellValue()));
            data.setAge20D6(Integer.parseInt(row.getCell(20).getStringCellValue()));
            data.setAge30D1(Integer.parseInt(row.getCell(21).getStringCellValue()));
            data.setAge30D2(Integer.parseInt(row.getCell(22).getStringCellValue()));
            data.setAge30D3(Integer.parseInt(row.getCell(23).getStringCellValue()));
            data.setAge30D4(Integer.parseInt(row.getCell(24).getStringCellValue()));
            data.setAge30D5(Integer.parseInt(row.getCell(25).getStringCellValue()));
            data.setAge30D6(Integer.parseInt(row.getCell(26).getStringCellValue()));
            data.setAge40D1(Integer.parseInt(row.getCell(27).getStringCellValue()));
            data.setAge40D2(Integer.parseInt(row.getCell(28).getStringCellValue()));
            data.setAge40D3(Integer.parseInt(row.getCell(29).getStringCellValue()));
            data.setAge40D4(Integer.parseInt(row.getCell(30).getStringCellValue()));

            data.setAge40D5(Integer.parseInt(row.getCell(31).getStringCellValue()));
            data.setAge40D6(Integer.parseInt(row.getCell(32).getStringCellValue()));
            data.setAge50D1(Integer.parseInt(row.getCell(33).getStringCellValue()));
            data.setAge50D2(Integer.parseInt(row.getCell(34).getStringCellValue()));
            data.setAge50D3(Integer.parseInt(row.getCell(35).getStringCellValue()));
            data.setAge50D4(Integer.parseInt(row.getCell(36).getStringCellValue()));
            data.setAge50D5(Integer.parseInt(row.getCell(37).getStringCellValue()));
            data.setAge50D6(Integer.parseInt(row.getCell(38).getStringCellValue()));
            data.setAge60D1(Integer.parseInt(row.getCell(39).getStringCellValue()));
            data.setAge60D2(Integer.parseInt(row.getCell(40).getStringCellValue()));
            data.setAge60D3(Integer.parseInt(row.getCell(41).getStringCellValue()));
            data.setAge60D4(Integer.parseInt(row.getCell(42).getStringCellValue()));
            data.setAge60D5(Integer.parseInt(row.getCell(43).getStringCellValue()));
            data.setAge60D6(Integer.parseInt(row.getCell(44).getStringCellValue()));
            data.setAge10W1(Integer.parseInt(row.getCell(45).getStringCellValue()));
            data.setAge10W2(Integer.parseInt(row.getCell(46).getStringCellValue()));
            data.setAge10W3(Integer.parseInt(row.getCell(47).getStringCellValue()));
            data.setAge10W4(Integer.parseInt(row.getCell(48).getStringCellValue()));
            data.setAge10W5(Integer.parseInt(row.getCell(49).getStringCellValue()));
            data.setAge10W6(Integer.parseInt(row.getCell(50).getStringCellValue()));
            data.setAge20W1(Integer.parseInt(row.getCell(51).getStringCellValue()));
            data.setAge20W2(Integer.parseInt(row.getCell(52).getStringCellValue()));
            data.setAge20W3(Integer.parseInt(row.getCell(53).getStringCellValue()));
            data.setAge20W4(Integer.parseInt(row.getCell(54).getStringCellValue()));
            data.setAge20W5(Integer.parseInt(row.getCell(55).getStringCellValue()));
            data.setAge20W6(Integer.parseInt(row.getCell(56).getStringCellValue()));
            data.setAge30W1(Integer.parseInt(row.getCell(57).getStringCellValue()));
            data.setAge30W2(Integer.parseInt(row.getCell(58).getStringCellValue()));
            data.setAge30W3(Integer.parseInt(row.getCell(59).getStringCellValue()));
            data.setAge30W4(Integer.parseInt(row.getCell(60).getStringCellValue()));

            data.setAge30W5(Integer.parseInt(row.getCell(61).getStringCellValue()));
            data.setAge30W6(Integer.parseInt(row.getCell(62).getStringCellValue()));
            data.setAge40W1(Integer.parseInt(row.getCell(63).getStringCellValue()));
            data.setAge40W2(Integer.parseInt(row.getCell(64).getStringCellValue()));
            data.setAge40W3(Integer.parseInt(row.getCell(65).getStringCellValue()));
            data.setAge40W4(Integer.parseInt(row.getCell(66).getStringCellValue()));
            data.setAge40W5(Integer.parseInt(row.getCell(67).getStringCellValue()));
            data.setAge40W6(Integer.parseInt(row.getCell(68).getStringCellValue()));
            data.setAge50W1(Integer.parseInt(row.getCell(69).getStringCellValue()));
            data.setAge50W2(Integer.parseInt(row.getCell(70).getStringCellValue()));
            data.setAge50W3(Integer.parseInt(row.getCell(71).getStringCellValue()));
            data.setAge50W4(Integer.parseInt(row.getCell(72).getStringCellValue()));
            data.setAge50W5(Integer.parseInt(row.getCell(73).getStringCellValue()));
            data.setAge50W6(Integer.parseInt(row.getCell(74).getStringCellValue()));
            data.setAge60W1(Integer.parseInt(row.getCell(75).getStringCellValue()));
            data.setAge60W2(Integer.parseInt(row.getCell(76).getStringCellValue()));
            data.setAge60W3(Integer.parseInt(row.getCell(77).getStringCellValue()));
            data.setAge60W4(Integer.parseInt(row.getCell(78).getStringCellValue()));
            data.setAge60W5(Integer.parseInt(row.getCell(79).getStringCellValue()));
            data.setAge60W6(Integer.parseInt(row.getCell(80).getStringCellValue()));
            data.setStPopul(Integer.parseInt(row.getCell(81).getStringCellValue()));
            data.setBdPopul(Integer.parseInt(row.getCell(82).getStringCellValue()));
            data.setRPopul(Integer.parseInt(row.getCell(83).getStringCellValue()));
            data.setWPopul(Integer.parseInt(row.getCell(84).getStringCellValue()));
            data.setSumFoodEx(Integer.parseInt(row.getCell(85).getStringCellValue()));
            data.setSumCltEx(Integer.parseInt(row.getCell(86).getStringCellValue()));
            data.setSumNecEx(Integer.parseInt(row.getCell(87).getStringCellValue()));
            data.setSumMedEx(Integer.parseInt(row.getCell(88).getStringCellValue()));
            data.setSumTrpEx(Integer.parseInt(row.getCell(89).getStringCellValue()));
            data.setSumLeiEx(Integer.parseInt(row.getCell(90).getStringCellValue()));

            data.setSumCulEx(Integer.parseInt(row.getCell(91).getStringCellValue()));
            data.setSumEduEx(Integer.parseInt(row.getCell(92).getStringCellValue()));
            data.setSumEntEx(Integer.parseInt(row.getCell(93).getStringCellValue()));
            data.setCtAptCom(Integer.parseInt(row.getCell(94).getStringCellValue()));
            data.setCtAptHou(Integer.parseInt(row.getCell(95).getStringCellValue()));
            data.setIdxStbArea(Integer.parseInt(row.getCell(96).getStringCellValue()));

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

            //5000row 잘라서 insert
            if(i == line){
                reSearchAreaService.insertReSearchAreaExcel(dataList);
                dataList = new ArrayList<>();
                line = line+5000;
            }

        }
        if(dataList.size() > 0){    //추가할 데이터가 남아있으면 마지막으로 insert해준다
            reSearchAreaService.insertReSearchAreaExcel(dataList);
        }
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchArea2DataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");
        List<ReSearchAreaCom> dataList = new ArrayList<>();
        int line = 5000;
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ReSearchAreaCom data = new ReSearchAreaCom();

            System.out.println("Setting COUNT :: "+i);

            Map<String, Object> map = new HashMap<>();
            map.put("area_cd",row.getCell(4).getStringCellValue());
            map.put("emd_cd",row.getCell(5).getStringCellValue());
            map.put("area_nm",row.getCell(6).getStringCellValue());
            map.put("com_cd",row.getCell(7).getStringCellValue());
            map.put("com_cd2",row.getCell(8).getStringCellValue());
            map.put("com_nm",row.getCell(9).getStringCellValue());

            //String join = row.getCell(5).getStringCellValue();
            int reSearchAreaComCnt = reSearchAreaMapper.checkReSearchAreaCom(map);
            if(reSearchAreaComCnt > 0){ //같은 상권이 있으면 패스
                continue;
            }

            data.setYear(Integer.parseInt(row.getCell(0).getStringCellValue()));
            data.setQrt(Integer.parseInt(row.getCell(1).getStringCellValue()));
            data.setAreaDivCd(row.getCell(2).getStringCellValue());
            data.setAreaDivNm(row.getCell(3).getStringCellValue());
            data.setAreaCd(Integer.parseInt(row.getCell(4).getStringCellValue()));
            data.setEmdCd(row.getCell(5).getStringCellValue());
            data.setAreaNm(row.getCell(6).getStringCellValue());
            data.setComCd(row.getCell(7).getStringCellValue());
            data.setComCd2(row.getCell(8).getStringCellValue());
            data.setComNm(row.getCell(9).getStringCellValue());
            data.setCtShop(Integer.parseInt(row.getCell(10).getStringCellValue()));
            data.setCtShopSim(Integer.parseInt(row.getCell(11).getStringCellValue()));
            data.setPerOpen(Integer.parseInt(row.getCell(12).getStringCellValue()));
            data.setCtOpen(Integer.parseInt(row.getCell(13).getStringCellValue()));
            data.setPerClose(Integer.parseInt(row.getCell(14).getStringCellValue()));
            data.setCtClose(Integer.parseInt(row.getCell(15).getStringCellValue()));
            data.setCtFranchise(Integer.parseInt(row.getCell(16).getStringCellValue()));
            data.setSum0006(Integer.parseInt(row.getCell(17).getStringCellValue()));
            data.setSum0611(Integer.parseInt(row.getCell(18).getStringCellValue()));
            data.setSum1114(Integer.parseInt(row.getCell(19).getStringCellValue()));
            data.setSum1417(Integer.parseInt(row.getCell(20).getStringCellValue()));
            data.setSum1721(Integer.parseInt(row.getCell(21).getStringCellValue()));
            data.setSum2124(Integer.parseInt(row.getCell(22).getStringCellValue()));

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

            //5000row 잘라서 insert
            if(i == line){
                reSearchAreaService.insertReSearchAreaComExcel(dataList);
                dataList = new ArrayList<>();
                line = line+5000;
            }

        }
        if(dataList.size() > 0){    //추가할 데이터가 남아있으면 마지막으로 insert해준다
            reSearchAreaService.insertReSearchAreaComExcel(dataList);
        }
   }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchRegionDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");
        List<ReSearchRegion> dataList = new ArrayList<>();
        int line = 5000;
        for (int i = 1; i < worksheet.getPhysicalNumberOfRows(); i++) { // 4

            Row row = worksheet.getRow(i);

            ReSearchRegion data = new ReSearchRegion();

            System.out.println("Setting COUNT :: "+i);

            Map<String, Object> map = new HashMap<>();
            map.put("year",row.getCell(0).getStringCellValue());
            map.put("qrt",row.getCell(1).getStringCellValue());
            map.put("emd_cd",row.getCell(5).getStringCellValue());
            map.put("cmd_nm",row.getCell(6).getStringCellValue());

            //String join = row.getCell(5).getStringCellValue();
            int reSearchRegionCnt = reSearchRegionMapper.checkReSearchRegion(map);
            if(reSearchRegionCnt > 0){ //같은 상권이 있으면 패스
                continue;
            }

            data.setYear(Integer.parseInt(row.getCell(0).getStringCellValue()));
            data.setQrt(Integer.parseInt(row.getCell(1).getStringCellValue()));
            data.setCtprvnCd(row.getCell(2).getStringCellValue());
            data.setCtprvnNm(row.getCell(3).getStringCellValue());
            data.setSignguCd(row.getCell(4).getStringCellValue());
            data.setSignguNm(row.getCell(5).getStringCellValue());
            data.setEmdCd(row.getCell(6).getStringCellValue());
            data.setEmdNm(row.getCell(7).getStringCellValue());
            data.setSumPopul(Integer.parseInt(row.getCell(8).getStringCellValue()));
            data.setRPopul(Integer.parseInt(row.getCell(9).getStringCellValue()));
            data.setWPopul(Integer.parseInt(row.getCell(10).getStringCellValue()));
            data.setHouse1(Integer.parseInt(row.getCell(11).getStringCellValue()));
            data.setHouse2(Integer.parseInt(row.getCell(12).getStringCellValue()));
            data.setHouse3(Integer.parseInt(row.getCell(13).getStringCellValue()));
            data.setHouse4(Integer.parseInt(row.getCell(14).getStringCellValue()));
            data.setHouse5(Integer.parseInt(row.getCell(15).getStringCellValue()));
            data.setHouse6(Integer.parseInt(row.getCell(16).getStringCellValue()));
            data.setHouse7(Integer.parseInt(row.getCell(17).getStringCellValue()));
            data.setCtShopU20s(Integer.parseInt(row.getCell(18).getStringCellValue()));
            data.setCtShop30s(Integer.parseInt(row.getCell(19).getStringCellValue()));
            data.setCtShop40s(Integer.parseInt(row.getCell(20).getStringCellValue()));
            data.setCtShop50s(Integer.parseInt(row.getCell(21).getStringCellValue()));
            data.setCtShopO60s(Integer.parseInt(row.getCell(22).getStringCellValue()));
            data.setRtAll(Integer.parseInt(row.getCell(23).getStringCellValue()));
            data.setRt1f(Integer.parseInt(row.getCell(24).getStringCellValue()));
            data.setRtOther(Integer.parseInt(row.getCell(25).getStringCellValue()));

            data.setLoginUserSeq(loginUserSeq);

            dataList.add(data);

            //5000row 잘라서 insert
            if(i == line){
                reSearchRegionService.insertReSearchRegionExcel(dataList);
                dataList = new ArrayList<>();
                line = line+5000;
            }

        }
        if(dataList.size() > 0){    //추가할 데이터가 남아있으면 마지막으로 insert해준다
            reSearchRegionService.insertReSearchRegionExcel(dataList);
        }
    }

}
