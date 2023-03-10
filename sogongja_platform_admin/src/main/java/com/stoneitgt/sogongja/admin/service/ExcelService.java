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
import java.lang.reflect.Array;
import java.text.SimpleDateFormat;
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

    private boolean insertCheck = false;

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    //public String insertExcel(Sheet worksheet, String excelType, int loginUserSeq) throws IOException {
    public String insertExcel(List<List<String>> excelDatas, String excelType, int loginUserSeq) throws IOException {

        String returnUrl = "";
        switch (excelType){
            case "edu": eduDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/education"; break;   //??????
            case "con": conDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/consulting"; break;  //?????????
            case "cou": couDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/counseling"; break;  //????????????
            case "pro": proDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/board/project"; break;     //?????? ??? ??????
            case "faq": faqDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/faq"; break;         //faq
            case "shop": reSearchShopDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/areaSetting/shop"; break;         //???????????????
            case "analysis2": reSearchArea2DataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/areaSetting/analysis?type=2&subType=0"; break;         //???????????????(??????)
            case "analysis1": reSearchArea1DataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/areaSetting/analysis?type=1&subType=0"; break;         //???????????????(??????)
            case "region": reSearchRegionDataInsert(excelDatas, loginUserSeq); returnUrl = "redirect:/areaSetting/regional?type=region0"; break;         //???????????????(??????)
        }
        insertCheck = false;    //?????? ???????????? ?????????
        return returnUrl;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void faqDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        faqService.deleteAllFaq(loginUserSeq);  //faq ?????? ??????

        long startTime = System.currentTimeMillis();
        List<Faq> dataList = new ArrayList<>();
        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            Faq data = new Faq();
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 : String type = str;
                        switch (type){
                            case "????????? ?????????": data.setType("CON"); data.setTypeColor("primary"); data.setTypeName(type); break;
                            case "????????? ??????": data.setType("EDU"); data.setTypeColor("success"); data.setTypeName(type); break;
                            case "?????? ?????????": data.setType("GUIDE"); data.setTypeColor("info"); data.setTypeName(type); break;
                            case "????????? ??????": data.setType("USER"); data.setTypeColor("dark"); data.setTypeName(type); break;
                        }
                        break;
                    case 1 : data.setSubject(str); break;
                    case 2 : data.setContent(str); break;

                }
                data.setLoginUserSeq(loginUserSeq);
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                faqService.saveFaqBoard(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            faqService.saveFaqBoard(dataList);
        }

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void eduDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();

        List<Education> dataList = new ArrayList<>();
        List<Files> f_dataList = new ArrayList<>();

        //??????????????? ????????? ???????????? ??????
        Education education = educationService.getLastEducationInfo();
        int edu_seq = 0 ;
        if(education != null ){
            edu_seq = education.getEduSeq();
        }
        int next_edu_Seq = 0;

        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            Education data = new Education();
            Files f_data = new Files();
            String subject = "";
            String file_ext = "";

            next_edu_Seq = edu_seq +j;
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 :
                        subject = str;
                        data.setSubject(str);
                        break;
                    case 1 : data.setContent(str); break;
                    case 2 :
                        String supportName = str;
                        Support support = supportMapper.getSupport(supportName);
                        data.setSupportOrg(String.valueOf(support.getSupportSeq()));
                        break;
                    case 3 : data.setEduUrl(str); break;
                    case 4 : data.setTags(str); break;
                    case 5 :
                        String category1Name = str;
                        Category1 category1 = categoryMapper.getCategory1Infomation(category1Name);
                        data.setCategory1(String.valueOf(category1.getCategory1Seq()));
                        break;
                    case 6 :
                        String category2Name = str;
                        Category2 category2 = categoryMapper.getCategory2Infomation(category2Name);
                        data.setCategory2(String.valueOf(category2.getCategory2Seq()));
                        break;
                    case 7 :
                        String category3Name = str;
                        Category3 category3 = categoryMapper.getCategory3Infomation(category3Name);
                        data.setCategory3(String.valueOf(category3.getCategory3Seq()));
                        break;
                    case 8 :
                        if(str.equals("")){ //???????????? ????????? null??????
                            f_data.setFileName("null");
                        }else{
                            String[] file_namr_arr = str.split("\\.");
                            file_ext = file_namr_arr[1];    //????????? ?????????
                        }

                        f_data.setRefType("EDUCATION_IMAGE");
                        f_data.setRefSeq(next_edu_Seq);
                        f_data.setFileName(str);
                        break;
                    case 9 :
                        if(!str.equals("")) { //??????????????? ?????????
                            f_data.setFilePath(str);
                            f_data.setThumbnailPath(str + "_thumb." + file_ext);
                        }
                        break;
                    case 10 :f_data.setCrawlUrl(str); break;
                }
                data.setLoginUserSeq(loginUserSeq);
                f_data.setLoginUserSeq(loginUserSeq);

            }

            int subjectCnt = educationMapper.checkEducationSubject(subject);
            if(subjectCnt > 0){ //?????? ????????? ????????? ????????? ??????
                continue;
            }

            dataList.add(data);
            //if(!f_data.getFileName().equals(null)){ //???????????? null??? ????????? ???????????????
                f_dataList.add(f_data);
            //}
            System.out.println("f_dataList :: "+f_dataList);
            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                educationService.insertEducationExcel(dataList);
                educationService.insertEducationExcelFile(f_dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            System.out.println("dataList :: "+dataList);
            System.out.println("f_dataList :: "+f_dataList);
            educationService.insertEducationExcel(dataList);
            educationService.insertEducationExcelFile(f_dataList);
        }

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void conDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();
        List<Consulting> dataList = new ArrayList<>();
        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            Consulting data = new Consulting();
            String subject = "";
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 :
                        subject = str;
                        data.setSubject(str);
                        break;
                    case 1 : data.setContent(str); break;
                    case 2 : data.setSupportContent(str); break;
                    case 3 : data.setSupportBy(str); break;
                    case 4 : data.setRegion(str); break;
                    case 5 :
                        String supportName = str;
                        Support support = supportMapper.getSupport(supportName);
                        data.setSupportOrg(String.valueOf(support.getSupportSeq()));
                        break;
                    case 6 : data.setConUrl(str); break;
                    case 7 : data.setTags(str); break;
                    case 8 :
                        String category1Name = str;
                        Category1 category1 = categoryMapper.getCategory1Infomation(category1Name);
                        data.setCategory1(String.valueOf(category1.getCategory1Seq()));
                        break;
                    case 9 :
                        String category2Name = str;
                        Category2 category2 = categoryMapper.getCategory2Infomation(category2Name);
                        data.setCategory2(String.valueOf(category2.getCategory2Seq()));
                        break;
                    case 10 :
                        String category3Name = str;
                        Category3 category3 = categoryMapper.getCategory3Infomation(category3Name);
                        data.setCategory3(String.valueOf(category3.getCategory3Seq())); break;

                }
                data.setLoginUserSeq(loginUserSeq);
            }
            int subjectCnt = consultingMapper.checkConsultingSubject(subject);
            if(subjectCnt > 0){ //?????? ????????? ???????????? ????????? ??????
                continue;
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                consultingService.insertConsultingExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            consultingService.insertConsultingExcel(dataList);
        }


        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void couDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();
        List<Counseling> dataList = new ArrayList<>();
        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            Counseling data = new Counseling();
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 :
                        switch (str){
                            case "??????": data.setField(1); break;
                            case "??????": data.setField(2); break;
                            case "??????": data.setField(3); break;
                            case "??????": data.setField(4); break;
                            case "????????????": data.setField(5); break;
                            case "??????": data.setField(6); break;
                            case "??????": data.setField(7); break;
                            case "???????????????": data.setField(8); break;
                        }
                        break;
                    case 1 :
                        String supportName = str;
                        Support support = supportMapper.getSupport(supportName);
                        data.setSupportOrg(String.valueOf(support.getSupportSeq()));
                        break;
                    case 2 : data.setYear(str); break;
                    case 3 : data.setCounselor(str); break;
                    case 4 : data.setQuestion(str); break;
                    case 5 : data.setContent(str); break;
                    case 6 : data.setTags(str); break;

                }
                data.setLoginUserSeq(loginUserSeq);
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                counselingService.insertCounselingExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            counselingService.insertCounselingExcel(dataList);
        }

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void proDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();
        List<Project> dataList = new ArrayList<>();
        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            Project data = new Project();
            Map<String, Object> map = new HashMap<>();
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 : data.setProjectType(str); map.put("type",str); break;
                    case 1 : data.setSubject(str); map.put("title",str); break;
                    case 2 : data.setProjectUrl(str);  break;
                    case 3 : data.setProjectYear(str); map.put("year",str);break;
                    case 4 :
                        String playType = str;
                        switch (playType){
                            case "??????": data.setPlaceType("1"); break;
                            case "??????/??????": data.setPlaceType("2"); break;
                            case "??????/??????": data.setPlaceType("3"); break;
                            case "??????/??????/??????": data.setPlaceType("4"); break;
                            case "??????/??????": data.setPlaceType("5"); break;
                            case "??????/??????/??????": data.setPlaceType("6"); break;
                            case "??????/??????/??????": data.setPlaceType("7"); break;
                        }
                        map.put("placeType",data.getPlaceType());
                        break;
                }
                data.setLoginUserSeq(loginUserSeq);
            }
            String projectSeq = boardMapper.getProjectCheck(map);
            if(projectSeq != null){ //??????????????? ????????? ??????
                continue;
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                boardService.insertProjectExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            boardService.insertProjectExcel(dataList);
        }

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    //public void reSearchShopDataInsert(Sheet worksheet, int loginUserSeq) throws IOException {
    public void reSearchShopDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        insertCheck = false;    //?????? ???????????? ???????????? ????????? ?????????.

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");
        long startTime = System.currentTimeMillis();

        List<ReSearchShop> dataList = new ArrayList<>();
        int line = 1000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            ReSearchShop data = new ReSearchShop();
            int shopNo = 0;

            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);
                String apprvDate = "";


                switch (i){
                    case 0:
                        shopNo = Integer.parseInt(str);
                        data.setShopNo(Integer.parseInt(str));
                        break;
                    case 1: data.setShopNm(str); break;
                    case 2: data.setBranch(str); break;
                    case 3: data.setCodeType1(str); break;
                    case 4: data.setNmType1(str); break;
                    case 5: data.setCodeType2(str); break;
                    case 6: data.setNmType2(str); break;
                    case 7: data.setCodeType3(str); break;
                    case 8: data.setNmType3(str); break;
                    case 9: data.setAddrCd(str); break;
                    case 10: data.setAddr(str); break;
                    case 11: data.setStAddr(str); break;
                    case 12: data.setEmdCd(str); break;
                    case 13: data.setEmdNm(str); break;
                    case 14: data.setLongitude(Float.parseFloat(str)); break;
                    case 15: data.setLatitude(Float.parseFloat(str)); break;
                    case 16: data.setSubStaNm(str); break;
                    case 17: data.setSubStaNo(str); break;
                    case 18: data.setAveSubPassOn(Float.parseFloat(str)); break;
                    case 19: data.setAveSubPassOff(Float.parseFloat(str)); break;
                    case 20: data.setSumSubPassOn(Float.parseFloat(str)); break;
                    case 21: data.setSumSubPassOff(Float.parseFloat(str)); break;
                    case 22: data.setBusStaNm(str); break;
                    case 23: data.setArsId(str); break;
                    case 24: data.setAveBusPassOn(Float.parseFloat(str)); break;
                    case 25: data.setAveBusPassOff(Float.parseFloat(str)); break;
                    case 26: data.setSumBusPassOn(Float.parseFloat(str)); break;
                    case 27: data.setSumBusPassOff(Float.parseFloat(str)); break;
                    case 28:
                        if(str.equals("") || str.contains("0000-00-00")){
                            apprvDate = null;
                        }else{
                            apprvDate = str;
                        }

                        data.setApprvDate(apprvDate);
                        break;
                    case 29: data.setCtGrd(Integer.parseInt(str)); break;
                    case 30: data.setCtBase(Integer.parseInt(str)); break;
                    case 31: data.setPincpUseCd(Integer.parseInt(str)); break;
                    case 32: data.setPincpUse(str); break;
                    case 33: data.setOtherUse(str); break;
                }
                data.setLoginUserSeq(loginUserSeq);
            }
            int reSearchShopCnt = reSearchShopMapper.checkReSearchShop(shopNo);
            if(reSearchShopCnt > 0){ //?????? ????????? ????????? ??????
                continue;
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                reSearchShopService.insertReSearchShopExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+1000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            reSearchShopService.insertReSearchShopExcel(dataList);
        }
        insertCheck = true;

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchArea1DataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        System.out.println("START-------------------!!!!!!!!!!!!!!!!");

        long startTime = System.currentTimeMillis();
        List<ReSearchArea> dataList = new ArrayList<>();
        int line = 3000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            ReSearchArea data = new ReSearchArea();
            String join = "";
            for(int i =0; i < dataRow.size();i++){  //??????????????????
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0: data.setYear(Integer.parseInt(str)); break;
                    case 1: data.setQrt(Integer.parseInt(str)); break;
                    case 2: data.setAreaDivCd(str); break;
                    case 3: data.setAreaCd(str); break;
                    case 4: data.setAreaNm(str); break;
                    case 5:
                        join = str;
                        data.setJoin(str);
                        break;
                    case 6: data.setLivPopul(Integer.parseInt(str)); break;
                    case 7: data.setMPopul(Integer.parseInt(str)); break;
                    case 8: data.setFPopul(Integer.parseInt(str)); break;
                    case 9: data.setAge10D1(Integer.parseInt(str)); break;
                    case 10: data.setAge10D2(Integer.parseInt(str)); break;
                    case 11: data.setAge10D3(Integer.parseInt(str)); break;
                    case 12: data.setAge10D4(Integer.parseInt(str)); break;
                    case 13: data.setAge10D5(Integer.parseInt(str)); break;
                    case 14: data.setAge10D6(Integer.parseInt(str)); break;
                    case 15: data.setAge20D1(Integer.parseInt(str)); break;
                    case 16: data.setAge20D2(Integer.parseInt(str)); break;
                    case 17: data.setAge20D3(Integer.parseInt(str)); break;
                    case 18: data.setAge20D4(Integer.parseInt(str)); break;
                    case 19: data.setAge20D5(Integer.parseInt(str)); break;
                    case 20: data.setAge20D6(Integer.parseInt(str)); break;
                    case 21: data.setAge30D1(Integer.parseInt(str)); break;
                    case 22: data.setAge30D2(Integer.parseInt(str)); break;
                    case 23: data.setAge30D3(Integer.parseInt(str)); break;
                    case 24: data.setAge30D4(Integer.parseInt(str)); break;
                    case 25: data.setAge30D5(Integer.parseInt(str)); break;
                    case 26: data.setAge30D6(Integer.parseInt(str)); break;
                    case 27: data.setAge40D1(Integer.parseInt(str)); break;
                    case 28: data.setAge40D2(Integer.parseInt(str)); break;
                    case 29: data.setAge40D3(Integer.parseInt(str)); break;
                    case 30: data.setAge40D4(Integer.parseInt(str)); break;

                    case 31: data.setAge40D5(Integer.parseInt(str)); break;
                    case 32: data.setAge40D6(Integer.parseInt(str)); break;
                    case 33: data.setAge50D1(Integer.parseInt(str)); break;
                    case 34: data.setAge50D2(Integer.parseInt(str)); break;
                    case 35: data.setAge50D3(Integer.parseInt(str)); break;
                    case 36: data.setAge50D4(Integer.parseInt(str)); break;
                    case 37: data.setAge50D5(Integer.parseInt(str)); break;
                    case 38: data.setAge50D6(Integer.parseInt(str)); break;
                    case 39: data.setAge60D1(Integer.parseInt(str)); break;
                    case 40: data.setAge60D2(Integer.parseInt(str)); break;
                    case 41: data.setAge60D3(Integer.parseInt(str)); break;
                    case 42: data.setAge60D4(Integer.parseInt(str)); break;
                    case 43: data.setAge60D5(Integer.parseInt(str)); break;
                    case 44: data.setAge60D6(Integer.parseInt(str)); break;
                    case 45: data.setAge10W1(Integer.parseInt(str)); break;
                    case 46: data.setAge10W2(Integer.parseInt(str)); break;
                    case 47: data.setAge10W3(Integer.parseInt(str)); break;
                    case 48: data.setAge10W4(Integer.parseInt(str)); break;
                    case 49: data.setAge10W5(Integer.parseInt(str)); break;
                    case 50: data.setAge10W6(Integer.parseInt(str)); break;
                    case 51: data.setAge20W1(Integer.parseInt(str)); break;
                    case 52: data.setAge20W2(Integer.parseInt(str)); break;
                    case 53: data.setAge20W3(Integer.parseInt(str)); break;
                    case 54: data.setAge20W4(Integer.parseInt(str)); break;
                    case 55: data.setAge20W5(Integer.parseInt(str)); break;
                    case 56: data.setAge20W6(Integer.parseInt(str)); break;
                    case 57: data.setAge30W1(Integer.parseInt(str)); break;
                    case 58: data.setAge30W2(Integer.parseInt(str)); break;
                    case 59: data.setAge30W3(Integer.parseInt(str)); break;
                    case 60: data.setAge30W4(Integer.parseInt(str)); break;

                    case 61: data.setAge30W5(Integer.parseInt(str)); break;
                    case 62: data.setAge30W6(Integer.parseInt(str)); break;
                    case 63: data.setAge40W1(Integer.parseInt(str)); break;
                    case 64: data.setAge40W2(Integer.parseInt(str)); break;
                    case 65: data.setAge40W3(Integer.parseInt(str)); break;
                    case 66: data.setAge40W4(Integer.parseInt(str)); break;
                    case 67: data.setAge40W5(Integer.parseInt(str)); break;
                    case 68: data.setAge40W6(Integer.parseInt(str)); break;
                    case 69: data.setAge50W1(Integer.parseInt(str)); break;
                    case 70: data.setAge50W2(Integer.parseInt(str)); break;
                    case 71: data.setAge50W3(Integer.parseInt(str)); break;
                    case 72: data.setAge50W4(Integer.parseInt(str)); break;
                    case 73: data.setAge50W5(Integer.parseInt(str)); break;
                    case 74: data.setAge50W6(Integer.parseInt(str)); break;
                    case 75: data.setAge60W1(Integer.parseInt(str)); break;
                    case 76: data.setAge60W2(Integer.parseInt(str)); break;
                    case 77: data.setAge60W3(Integer.parseInt(str)); break;
                    case 78: data.setAge60W4(Integer.parseInt(str)); break;
                    case 79: data.setAge60W5(Integer.parseInt(str)); break;
                    case 80: data.setAge60W6(Integer.parseInt(str)); break;
                    case 81: data.setStPopul(Integer.parseInt(str)); break;
                    case 82: data.setBdPopul(Integer.parseInt(str)); break;
                    case 83: data.setRPopul(Integer.parseInt(str)); break;
                    case 84: data.setWPopul(Integer.parseInt(str)); break;
                    case 85: data.setSumFoodEx(Integer.parseInt(str)); break;
                    case 86: data.setSumCltEx(Integer.parseInt(str)); break;
                    case 87: data.setSumNecEx(Integer.parseInt(str)); break;
                    case 88: data.setSumMedEx(Integer.parseInt(str)); break;
                    case 89: data.setSumTrpEx(Integer.parseInt(str)); break;
                    case 90: data.setSumLeiEx(Integer.parseInt(str)); break;

                    case 91: data.setSumCulEx(Integer.parseInt(str)); break;
                    case 92: data.setSumEduEx(Integer.parseInt(str)); break;
                    case 93: data.setSumEntEx(Integer.parseInt(str)); break;
                    case 94: data.setCtAptCom(Integer.parseInt(str)); break;
                    case 95: data.setCtAptHou(Integer.parseInt(str)); break;
                    case 96: data.setIdxStbArea(Integer.parseInt(str)); break;
                }
                data.setLoginUserSeq(loginUserSeq);
            }
            int reSearchAreaCnt = reSearchAreaMapper.checkReSearchArea(join);
            if(reSearchAreaCnt > 0){ //?????? ????????? ????????? ??????
                continue;
            }

            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                reSearchAreaService.insertReSearchAreaExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+3000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            reSearchAreaService.insertReSearchAreaExcel(dataList);
        }
        insertCheck = true;

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    //public void reSearchArea2DataInsert(Sheet worksheet, int loginUserSeq) throws IOException {
    public void reSearchArea2DataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();
        List<ReSearchAreaCom> dataList = new ArrayList<>();
        int line = 3000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            ReSearchAreaCom data = new ReSearchAreaCom();
            boolean duple_check = false;
            Map<String, Object> map = new HashMap<>();
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 : data.setYear(Integer.parseInt(str)); break;    //??????
                    case 1 : data.setQrt(Integer.parseInt(str)); break;     //??????
                    case 2 : data.setAreaDivCd(str); break;                 //?????? ?????? ??????
                    case 3 : data.setAreaDivNm(str); break;                 //?????? ?????? ?????????
                    case 4 : data.setAreaCd(Integer.parseInt(str)); map.put("area_cd",str); break;  //?????? ??????
                    case 5 : data.setEmdCd(str); map.put("emd_cd",str); break;  //???????????????
                    case 6 : data.setAreaNm(str);  map.put("area_nm",str); break;   //?????????
                    case 7 : data.setComCd(str);  map.put("com_cd",str); break;     //????????? ?????? ??????
                    case 8 : data.setComCd2(str); map.put("com_cd2",str); break;    //100??? ?????? ?????? ?????? ??????
                    case 9 : data.setComNm(str); map.put("com_nm",str); break;      //????????? ?????? ?????????
                    case 10 : data.setCtShop(Integer.parseInt(str)); break;         //?????????
                    case 11 : data.setCtShopSim(Integer.parseInt(str)); break;      //???????????? ?????????
                    case 12 : data.setCtFranchise(Integer.parseInt(str)); break;        //??????????????? ?????????
                    case 13 : data.setSum0006(Integer.parseInt(str)); break;         //????????? 00~06 ?????? ??????
                    case 14 : data.setSum0611(Integer.parseInt(str)); break;       //????????? 06~11 ?????? ??????
                    case 15 : data.setSum1114(Integer.parseInt(str)); break;        //????????? 11~14 ?????? ??????
                    case 16 : data.setSum1417(Integer.parseInt(str)); break;    //????????? 14~17 ?????? ??????
                    case 17 : data.setSum1721(Integer.parseInt(str)); break;        //????????? 17~21 ?????? ??????
                    case 18 : data.setSum2124(Integer.parseInt(str)); break;        //????????? 21~24 ?????? ??????
                    case 19 : data.setPerOpen(Integer.parseInt(str)); break;        //?????????
                    case 20 : data.setCtOpen(Integer.parseInt(str)); break;        //???????????? ???
                    case 21 : data.setPerClose(Integer.parseInt(str)); break;        //?????????
                    case 22 : data.setCtClose(Integer.parseInt(str)); break;        //???????????? ???

                }

                data.setLoginUserSeq(loginUserSeq);
            }
            int reSearchAreaComCnt = reSearchAreaMapper.checkReSearchAreaCom(map);
            if(reSearchAreaComCnt > 0){ //?????? ????????? ????????? ??????
                continue;
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                reSearchAreaService.insertReSearchAreaComExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+3000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            reSearchAreaService.insertReSearchAreaComExcel(dataList);
        }
        insertCheck = true;

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
   }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void reSearchRegionDataInsert(List<List<String>> excelDatas, int loginUserSeq) throws IOException {

        long startTime = System.currentTimeMillis();
        List<ReSearchRegion> dataList = new ArrayList<>();
        int line = 5000;
        int j = 1;
        for(List<String> dataRow : excelDatas){ // row ????????? ????????????.
            System.out.println("count----->> "+j);
            ReSearchRegion data = new ReSearchRegion();

            Map<String, Object> map = new HashMap<>();
            for(int i =0; i < dataRow.size();i++){
                String str = dataRow.get(i);
                //System.out.println("str :: "+str);

                switch (i){
                    case 0 : data.setYear(Integer.parseInt(str)); map.put("year",str); break;
                    case 1 : data.setQrt(Integer.parseInt(str)); map.put("qrt",str); break;
                    case 2 : data.setCtprvnCd(str); break;
                    case 3 : data.setCtprvnNm(str); map.put("ctprvn_nm",str); break;
                    case 4 : data.setSignguCd(str); map.put("signgu_cd",str); break;
                    case 5 : data.setSignguNm(str); map.put("signgu_nm",str); break;
                    case 6 : data.setEmdCd(str); map.put("emd_cd",str); break;
                    case 7 : data.setEmdNm(str); break;
                    case 8 : data.setSumPopul(Integer.parseInt(str)); break;
                    case 9 : data.setRPopul(Integer.parseInt(str)); break;
                    case 10 : data.setWPopul(Integer.parseInt(str)); break;
                    case 11 : data.setHouse1(Integer.parseInt(str)); break;
                    case 12 : data.setHouse2(Integer.parseInt(str)); break;
                    case 13 : data.setHouse3(Integer.parseInt(str)); break;
                    case 14 : data.setHouse4(Integer.parseInt(str)); break;
                    case 15 : data.setHouse5(Integer.parseInt(str)); break;
                    case 16 : data.setHouse6(Integer.parseInt(str)); break;
                    case 17 : data.setHouse7(Integer.parseInt(str)); break;
                    case 18 : data.setCtShopU20s(Integer.parseInt(str)); break;
                    case 19 : data.setCtShop30s(Integer.parseInt(str)); break;
                    case 20 : data.setCtShop40s(Integer.parseInt(str)); break;
                    case 21 : data.setCtShop50s(Integer.parseInt(str)); break;
                    case 22 : data.setCtShopO60s(Integer.parseInt(str)); break;
                    case 23 : data.setRtAll(Integer.parseInt(str)); break;
                    case 24 : data.setRt1f(Integer.parseInt(str)); break;
                    case 25 : data.setRtOther(Integer.parseInt(str)); break;

                }
                data.setLoginUserSeq(loginUserSeq);
            }
            int reSearchRegionCnt = reSearchAreaMapper.checkReSearchRegion(map);
            if(reSearchRegionCnt > 0){ //?????? ????????? ????????? ??????
                continue;
            }
            dataList.add(data);

            //5000row ????????? insert
            if(j == line){
                System.out.println("insert Start !!!!!!!!!!!");
                System.out.println("dataList.size() >> "+dataList.size());
                reSearchRegionService.insertReSearchRegionExcel(dataList);
                System.out.println("insert END @@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                dataList = new ArrayList<>();
                line = line+5000;
            }
            j++;
        }
        if(dataList.size() > 0) {    //????????? ???????????? ??????????????? ??????????????? insert?????????
            reSearchRegionService.insertReSearchRegionExcel(dataList);
        }
        insertCheck = true;

        long endTime = System.currentTimeMillis();
        long resutTime = endTime - startTime;
        System.out.println(" ????????????  : " + resutTime/1000 + "(ms)");
    }

    public boolean insertSuccessCheck(){
        boolean result = false;
        if(insertCheck) {
            result = true;
            insertCheck = false;    //???????????? ?????? ?????????
            System.out.println("INSERT END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }else{
            result = false;
            System.out.println("INSERT ING.............................................");
        }
        return result;
    }

}
