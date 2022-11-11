package com.stoneitgt.sogongja.admin.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MatchingParameter extends BaseParameter {

    private String registered;

}
