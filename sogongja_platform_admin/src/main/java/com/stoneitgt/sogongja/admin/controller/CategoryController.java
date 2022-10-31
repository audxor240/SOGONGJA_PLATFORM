package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.CategoryService;
import com.stoneitgt.sogongja.admin.service.EducationService;
import com.stoneitgt.sogongja.admin.service.SupportService;
import com.stoneitgt.sogongja.domain.*;
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

    @Autowired
    private SupportService supportService;

    @GetMapping("")
    public String categoryList(@ModelAttribute EducationParameter params, Model model) {

        List<Map<String, Object>> category1List = categoryService.getCategory1List();
        List<Map<String, Object>> category2List = categoryService.getCategory2List();
        List<Map<String, Object>> category3List = categoryService.getCategory3List();
        List<Map<String, Object>> supportList = supportService.getSupportList();
        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "콘텐츠 관리");
        breadcrumb.put("menu_name", "카테고리 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("category1List", category1List);
        model.addAttribute("category1Size", category1List.size());
        model.addAttribute("category2List", category2List);
        model.addAttribute("category3List", category3List);
        model.addAttribute("supportList", supportList);
        if(supportList.size() > 0){
            model.addAttribute("supportGroup", supportList.get(0).get("group_name"));
        }




        return "pages/category/category_list";
    }

    @PostMapping("/add")
    public String saveCategory(@RequestParam(required = false) String menuCode,
                               @ModelAttribute("category1") @Valid Category1 category1,
                               RedirectAttributes rttr) throws IOException {

        String returnUrl = "";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        returnUrl = "redirect:/category";
        System.out.println("category1 :::: "+category1);
        category1.setLoginUserSeq(authenticationFacade.getLoginUserSeq());

        if(category1.getType() == 3){   //소분류가 있으면
            categoryService.insertCategory3(category1);
        }else if(category1.getType() == 2){     //중분류가 있으면
            categoryService.insertCategory2(category1);
        }else if(category1.getType() == 1){     //대분류가 있으면
            categoryService.insertCategory1(category1);
        }


        return returnUrl;
    }

    @PostMapping("/delete")
    public String deleteCategory(@RequestParam int categorySeq, @RequestParam int type,
                                RedirectAttributes rttr) throws IOException {
        System.out.println("categorySeq :: "+categorySeq);
        System.out.println("type :: "+type);

        String returnUrl = "";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        returnUrl = "redirect:/category";

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("type",type);
        data.put("categorySeq",categorySeq);
        data.put("loginUserSeq",authenticationFacade.getLoginUserSeq());

        categoryService.deleteCategory(data);
        //category1.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        //categoryService.deleteCategory(category1);

        return returnUrl;
    }

    @PostMapping("/support/add")
    public String saveSupport(@RequestParam(required = false) String menuCode,
                               @ModelAttribute("support") @Valid Support support,
                               RedirectAttributes rttr) throws IOException {

        String returnUrl = "";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        returnUrl = "redirect:/category";
        support.setLoginUserSeq(authenticationFacade.getLoginUserSeq());

        supportService.insertSupport(support);

        return returnUrl;
    }

    @PostMapping("/support/delete")
    public String deleteSupport(@RequestParam int supportSeq,
                                 RedirectAttributes rttr) throws IOException {

        String returnUrl = "";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        returnUrl = "redirect:/category";

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("supportSeq",supportSeq);
        data.put("loginUserSeq",authenticationFacade.getLoginUserSeq());

        supportService.deleteSupport(data);

        return returnUrl;
    }

}
