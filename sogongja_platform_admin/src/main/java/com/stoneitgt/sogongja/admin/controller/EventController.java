package com.stoneitgt.sogongja.admin.controller;

import com.stoneitgt.common.GlobalConstant;
import com.stoneitgt.common.Paging;
import com.stoneitgt.sogongja.admin.domain.EducationParameter;
import com.stoneitgt.sogongja.admin.service.EventService;
import com.stoneitgt.sogongja.domain.BaseParameter;
import com.stoneitgt.sogongja.domain.Event;
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
@RequestMapping("/event")
public class EventController extends BaseController {

    @Autowired
    private EventService eventService;

    @GetMapping("")
    public String eventList(@ModelAttribute EducationParameter params, Model model) {

        Paging paging = new Paging();
        paging.setPage(params.getPage());
        paging.setSize(params.getSize());

        //현재 사용중인 이벤트 팝업이 있는지 확인
        String eventUsedSeq = eventService.getEventUsedCheck();

        Map<String, Object> paramsMap = StoneUtil.convertObjectToMap(params);

        List<Map<String, Object>> list = eventService.getEventList(paramsMap, paging);
        Integer total = eventService.selectTotalRecords();
        paging.setTotal(total);

        model.addAttribute("list", list);
        model.addAttribute("eventUsedSeq", eventUsedSeq);
        model.addAttribute("paging", paging);
        model.addAttribute("params", params);

        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "이벤트 팝업 관리");
        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));

        return "pages/event/event_list";
    }

    @GetMapping("/{eventSeq}")
    public String eventView(@PathVariable int eventSeq, @ModelAttribute BaseParameter params, Model model) {

        Event event = eventService.getEvent(eventSeq);

        //현재 사용중인 이벤트 팝업이 있는지 확인
        String eventUsedSeq = eventService.getEventUsedCheck();
        event.setEventUsedSeq(eventUsedSeq);

        String eventStart = event.getEventStart().substring(0,event.getEventStart().length()-11);
        String eventEnd = event.getEventEnd().substring(0,event.getEventEnd().length()-11);
        event.setEventStart(eventStart);
        event.setEventEnd(eventEnd);

        model.addAttribute("event", event);
        model.addAttribute("menuCode", params.getMenuCode());
        //model.addAttribute("breadcrumb", getBreadcrumb(params.getMenuCode()));
        Map<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "이벤트 팝업 관리");

        List<Map<String, Object>> fileList = getFileList(GlobalConstant.FILE_REF_TYPE.EVENT_POP, eventSeq);

        model.addAttribute("breadcrumb", breadcrumb);
        model.addAttribute("pageParams", getBaseParameterString(params));
        model.addAttribute("fileList", fileList);
        return "pages/event/event_form";
    }

    @GetMapping("/form")
    public String eventForm(@ModelAttribute EducationParameter params, Model model) {

        HashMap<String, Object> breadcrumb = new HashMap<String, Object>();
        breadcrumb.put("parent_menu_name", "시스템 관리");
        breadcrumb.put("menu_name", "이벤트 팝업 관리");
        model.addAttribute("breadcrumb", breadcrumb);



        Event event = new Event();
        //현재 사용중인 이벤트 팝업이 있는지 확인
        String eventUsedSeq = eventService.getEventUsedCheck();
        event.setEventUsedSeq(eventUsedSeq);
        model.addAttribute("event", event);

        return "pages/event/event_form";
    }

    @PostMapping("/form")
    public String saveEvent(@RequestParam(required = false) String menuCode,
                             @ModelAttribute("event") @Valid Event event, BindingResult bindingResult, Model model,
                             RedirectAttributes rttr) throws IOException {
        System.out.println("event :: "+event);
        String returnUrl = "redirect:/event/";
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.INSERT);
        event.setLoginUserSeq(authenticationFacade.getLoginUserSeq());
        eventService.saveEvent(event);
        return returnUrl;
    }

    @PostMapping("/delete")
    public String deleteEvent(@RequestParam int eventSeq, @RequestParam(required = false) String menuCode,
                               Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("event_seq", eventSeq);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());
        eventService.deleteEvent(params);
        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.DELETE);
        return "redirect:/event";
    }

    @PostMapping("/useUpdate")
    public String useUpdate(@RequestParam int eventSeq, @RequestParam String use,
                            Model model, RedirectAttributes rttr) throws IOException {
        Map<String, Object> params = new HashMap<String, Object>();

        params.put("event_seq", eventSeq);
        params.put("use", use);
        params.put("login_user_seq", authenticationFacade.getLoginUserSeq());

        eventService.updateEventUsed2(params);

        rttr.addFlashAttribute("result_code", GlobalConstant.CRUD_TYPE.UPDATE);

        return "redirect:/event";
    }
}
