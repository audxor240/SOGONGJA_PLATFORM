package com.stoneitgt.sogongja.admin.service;

import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.config.DataSourceConfig;
import com.stoneitgt.sogongja.admin.mapper.FaqMapper;
import com.stoneitgt.sogongja.domain.Faq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class FaqService extends BaseService {

    @Autowired
    private FaqMapper faqMapper;

    public List<Map<String, Object>> getFaqList(Map<String, Object> params, Paging paging) {
        return faqMapper.getFaqList(params, paging.getPaging());
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void saveFaqBoard(List<Faq> faq) throws IOException {
        faqMapper.insertFaqBoard(faq);
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public void deleteAllFaq(int loginUserSeq) throws IOException {
        faqMapper.deleteAllFaq(loginUserSeq);

    }

    public Faq getFaq(int faqSeq) {
        Faq faq = faqMapper.getFaq(faqSeq);
        return faq;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int saveFaq(Faq faq) throws IOException {
        int result = 0;

        if (faq.getFaqSeq() == 0) {
            result = faqMapper.insertFaq(faq);
        } else {
            result = faqMapper.updateFaq(faq);
        }

        return result;
    }

    @Transactional(DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
    public int deleteFaq(Map<String, Object> params) {
        int result = faqMapper.deleteFaq(params);

        return result;
    }

    public Integer selectTotalRecords() {
        return faqMapper.selectTotalRecords();
    }

}
