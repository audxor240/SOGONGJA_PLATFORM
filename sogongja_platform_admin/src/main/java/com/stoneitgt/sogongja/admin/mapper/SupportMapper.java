package com.stoneitgt.sogongja.admin.mapper;

import com.stoneitgt.sogongja.domain.Category1;
import com.stoneitgt.sogongja.domain.Category3;
import com.stoneitgt.sogongja.domain.Support;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface SupportMapper {

    List<Map<String, Object>> getSupportList();

    int insertSupport(Support support);

    int deleteSupport(Support support);

    Support getSupportInfo(int supportSeq);
}
