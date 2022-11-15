package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Faq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.RowBounds;

import java.util.List;
import java.util.Map;

@Mapper
public interface FaqMapper {

    List<Map<String, Object>> getFaqList(Map<String, Object> params, RowBounds rowBounds);
    int insertFaqBoard(List<Faq> faq);

    void deleteAllFaq(int loginUserSeq);

    Faq getFaq(int faqSeq);

    int updateFaq(Faq faq);

    int deleteFaq(Map<String, Object> params);

    int selectTotalRecords();
}
