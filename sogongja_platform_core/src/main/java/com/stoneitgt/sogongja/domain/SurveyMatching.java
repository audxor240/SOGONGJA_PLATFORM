package com.stoneitgt.sogongja.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class SurveyMatching {

    private String question;
    private List<String> answer;
    private List<List<String>> keyword;
    private List<List<String>> category2;
    private List<Integer> rank;
}
