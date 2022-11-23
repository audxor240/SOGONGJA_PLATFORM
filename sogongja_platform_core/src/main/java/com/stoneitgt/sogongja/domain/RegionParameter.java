package com.stoneitgt.sogongja.domain;

import com.stoneitgt.common.Paging;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RegionParameter extends BaseParameter {

    private String regionName1;
    private String regionName2;
    private String regionName3;
}
