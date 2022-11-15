package com.stoneitgt.sogongja.user.domain;

import com.stoneitgt.sogongja.domain.BaseParameter;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class MapParameter extends BaseParameter {

    private double x1;
    private double y1;
    private double x2;
    private double y2;

    private double lat;
    private double lng;

    private int zoom;

    private String[] codeType1;
}
