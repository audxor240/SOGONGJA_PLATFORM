package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.CategoryService;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.sogongja.domain.Board;
import com.stoneitgt.sogongja.domain.Category1;
import com.stoneitgt.util.StoneUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/category")
public class CategoryController extends BaseController {

    @Autowired
    private EducationService educationService;

    @Autowired
    private CategoryService categoryService;

    @GetMapping("")
    public String categoryList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = educationService.getEducationList(paramsMap, paging);
        Integer total = educationService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        //model.addAttribute("paging", StoneUtil.setTotalPaging(list, paging));
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "콘텐츠 관리");
        breadcrumb.put("menu_name", "카테고리 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("category1", getCodeList("CATEGORY_1", "전체"));
        model.addAttribute("supportOrg", getCodeList("SUPPORT_ORG", "전체"));

        return "pages/category/category_list";
    }

    @PostMapping("/category1")
    public String saveCategory1(@RequestParam(required = false) String menuCode,
                            @ModelAttribute("category1") @Valid Category1 category1,
                            RedirectAttributes rttr) throws IOException {

        String returnUrl = "";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        returnUrl = "redirect:/category";

        category1.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        categoryService.insertCategory1(category1);

        return returnUrl;
    }

}
