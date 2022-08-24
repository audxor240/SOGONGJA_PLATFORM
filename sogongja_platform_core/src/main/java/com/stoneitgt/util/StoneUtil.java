package com.stoneitgt.util;

import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.RowBounds;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.stoneitgt.common.IPManagement;
import com.stoneitgt.common.Paging;
import com.stoneitgt.util.excel.ExcelColumn;

import lombok.extern.slf4j.Slf4j;

/**
 * Stone Util
 *
 * @author yh.kim
 *
 */
@Slf4j
public class StoneUtil {

	public static int toInteger(Object value) {
		if (value == null) {
			return 0;
		}
		return Integer.parseInt(value.toString());
	}

	public static RowBounds getPaging(int page, int pageSize) {
		int offSet = (page - 1) * pageSize + 1;
		int limit = page * pageSize;
		return new RowBounds(offSet, limit);
	}

	public static Paging setTotalPaging(List<Map<String, Object>> list, Paging paging) {
		if (list.size() > 0) {
			int total = Integer.valueOf(list.get(0).get("total_count").toString());
			paging.setTotal(total);
		} else {
			paging.setTotal(0);
		}
		return paging;
	}

	public static Paging setTotalPaging2(List<Map<String, Object>> list, Paging paging) {
		if (list.size() > 0) {
			int total = list.size();
			paging.setTotal(total);
		} else {
			paging.setTotal(0);
		}
		return paging;
	}

	public static Paging setSearchTotalPaging(int total, Paging paging) {
		if (total > 0) {
			paging.setTotal(total);
		} else {
			paging.setTotal(0);
		}
		return paging;
	}

	/**
	 * 사용자 IP 정보를 가져온다.
	 *
	 * @param request
	 * @return
	 */
	public static String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("X-FORWARDED-FOR");

		log.info(">>>> X-FORWARDED-FOR : " + ip);

		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
			log.info(">>>> Proxy-Client-IP : " + ip);
		}

		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
			log.info(">>>> WL-Proxy-Client-IP : " + ip);
		}

		if (ip == null) {
			ip = request.getHeader("HTTP_CLIENT_IP");
			log.info(">>>> HTTP_CLIENT_IP : " + ip);
		}

		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
			log.info(">>>> HTTP_X_FORWARDED_FOR : " + ip);
		}

		if (ip == null) {
			ip = request.getRemoteAddr();
		}

		log.info(">>>> Result : IP Address : " + ip);

		return ip;
	}

	public static long ipToLong(String ipAddress) {
		long result = 0;
		if (ipAddress == null || "".equals(ipAddress)) {
			return result;
		}
		if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
			ipAddress = "127.0.0.1";
		}

		try {
			String[] ipAddressInArray = ipAddress.split("\\.");
			int len = ipAddressInArray.length;
			for (int i = 0; i < len; i++) {
				int power = 3 - i;
				int ip = Integer.parseInt(ipAddressInArray[i]);
				result += ip * Math.pow(256, power);
			}
		} catch (NumberFormatException e) {
			log.error("", e);
		}
		return result;
	}

	public static long ipToLong2(String ipAddress) {
		long result = 0;
		if (ipAddress == null || "".equals(ipAddress)) {
			return result;
		}
		String[] ipAddressInArray = ipAddress.split("\\.");
		for (int i = 3; i >= 0; i--) {
			long ip = Long.parseLong(ipAddressInArray[3 - i]);
			// left shifting 24,16,8,0 and bitwise OR
			// 1. 192 << 24
			// 1. 168 << 16
			// 1. 1 << 8
			// 1. 2 << 0
			result |= ip << (i * 8);
		}
		return result;
	}

	public static String longToIp(long ip) {
		StringBuilder result = new StringBuilder(15);
		for (int i = 0; i < 4; i++) {
			result.insert(0, Long.toString(ip & 0xff));
			if (i < 3) {
				result.insert(0, '.');
			}
			ip = ip >> 8;
		}
		return result.toString();
	}

	public static String longToIp2(long ip) {
		return ((ip >> 24) & 0xFF) + "." + ((ip >> 16) & 0xFF) + "." + ((ip >> 8) & 0xFF) + "." + (ip & 0xFF);
	}

	public static boolean hasIpAddress(List<IPManagement> ipList, String ipAddress) {
		long ip = ipToLong(ipAddress);
		Optional<IPManagement> result = ipList.stream().filter(predicate -> {
			long from = predicate.getFromIpLong();
			long to = predicate.getToIpLong();
			if (to == 0) {
				if (ip == from) {
					return true;
				}
			} else {
				if (ip >= from && ip <= to) {
					return true;
				}
			}
			return false;
		}).findFirst();
		log.info("result :" + result);
		return result.isPresent();
	}

	public static int randomRange(int n1, int n2) {
		return (int) (Math.random() * (n2 - n1 + 1)) + n1;
	}

	public static String getKoreanDateFormat(String strDate) {
		if (StringUtil.isBlank(strDate) || strDate.length() < 8) {
			return "";
		}

		int year = Integer.parseInt(strDate.substring(0, 4));
		int month = Integer.parseInt(strDate.substring(4, 6)) - 1;
		int day = Integer.parseInt(strDate.substring(6, 8));

		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.YEAR, year);
		cal.set(Calendar.MONTH, month);
		cal.set(Calendar.DATE, day);

		Format sDateFormat = new SimpleDateFormat("yyyy년 M월 d일 EEE요일", Locale.KOREAN);
		return sDateFormat.format(cal.getTime());
	}

	public static String addDay(int day) {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, day);
		SimpleDateFormat sdFormat = new SimpleDateFormat("yyyyMMdd");
		return sdFormat.format(calendar.getTime());
	}

	public static String getToday() {
		return getToday("yyyyMMdd");
	}

	public static String getToday(String pattern) {
		if (pattern == null || "".equals(pattern)) {
			pattern = "yyyyMMdd";
		}
		SimpleDateFormat sdFormat = new SimpleDateFormat(pattern);
		return sdFormat.format(Calendar.getInstance().getTime());
	}

	public static Map<String, Object> convertObjectToMap(Object obj) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
		JavaType type = mapper.constructType(Map.class);
		Map<String, Object> mappedObject = mapper.convertValue(obj, type);
		return mappedObject;
	}

	public static String dateToFormatString(String value) {
		String result = "";
		if (StringUtil.isBlank(value)) {
			return result;
		}
		SimpleDateFormat dateformat = new SimpleDateFormat("yyyyMMdd");
		try {
			Date date = dateformat.parse(value);
			result = new SimpleDateFormat("yyyy-MM-dd").format(date);
		} catch (ParseException e) {
		}
		return result;

	}

	public static String dateString(String value) {
		if (StringUtil.isBlank(value)) {
			return null;
		}
		return value.replaceAll("[^0-9]", "");
	}

	public static boolean isValidTelNo(String tel) {
		String regex = "^0(\\d{1}|\\d{2})[.-]?(\\d{3,4})[.-]?(\\d{4})$";
		return tel.matches(regex);
	}

	public static boolean isValidHp(String tel) {
		String regex = "^01([0|1|6|7|8|9]?)[.-]?(\\d{3,4})[.-]?(\\d{4})$";
		return tel.matches(regex);
	}

	public static boolean isValidEmail(String email) {
		String regex = "^[\\w!#$%&'*+/=?`{|}~^-]+(?:\\.[\\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$";
		return email.matches(regex);
	}

	public static Map<String, Object> getExcelHeaderMap(String title, String field) {
		return getExcelHeaderMap(title, field, 0);
	}

	public static Map<String, Object> getExcelHeaderMap(String title, String field, int width) {
		return getExcelHeaderMap(title, field, width, 0);
	}

	public static Map<String, Object> getExcelHeaderMap(String title, String field, int width, int align) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("title", title);
		map.put("data", field);
		map.put("width", width > 0 ? width : 100);
		map.put("align", align > 0 ? align : ExcelColumn.ALIGN.LEFT);
		return map;
	}

	public static Map<String, Object> getExcelHeader(String title, int rowSpan, int colSpan, int width) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("title", title);
		map.put("rowSpan", rowSpan);
		map.put("colSpan", colSpan);
		map.put("width", width);
		return map;
	}

	public static Map<String, Object> getExcelHeaderMap(String title, String field, int width, int align,
			String formatter) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("title", title);
		map.put("data", field);
		map.put("width", width > 0 ? width : 100);
		map.put("align", align > 0 ? align : ExcelColumn.ALIGN.LEFT);
		map.put("formatter", formatter);
		return map;
	}

}
