package com.stoneitgt.util;

import org.apache.commons.lang3.StringUtils;
import org.commonmark.node.Node;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document.OutputSettings;
import org.jsoup.safety.Safelist;

import lombok.extern.slf4j.Slf4j;

/**
 * 기본 apache commons StringUtils를 확장한 문자열 유틸 클래스
 *
 * @author yh.kim
 *
 */
@Slf4j
public class StringUtil extends StringUtils {

	public static String replaceCarriageReturn(String str) {
		return replaceCarriageReturn(str, SPACE);
	}

	public static String replaceCarriageReturn(String str, String replaceString) {
		if (str == null || EMPTY.equals(str.trim())) {
			return EMPTY;
		}
		return str.replaceAll("(\r\n|\r|\n|\n\r)", replaceString).trim();
	}

	public static String replaceSubstringCarriageReturn(String str, int length) {
		return replaceSubstringCarriageReturn(str, length, SPACE);
	}

	public static String replaceSubstringCarriageReturn(String str, int length, String replaceStr) {
		return StringUtils.substring(replaceCarriageReturn(str, replaceStr), 0, length);
	}

	public static String firstUpperCase(String str) {
		if (str == null || EMPTY.equals(str.trim())) {
			return EMPTY;
		}
		char[] array = str.trim().toCharArray();
		array[0] = Character.toUpperCase(array[0]);
		return new String(array);
	}

	public static Object getValue(Object obj) {
		if (obj instanceof Number) {
			return Integer.parseInt(getString(obj, "0"));
		}
		return getString(obj);
	}

	public static String getString(Object obj) {
		return getString(obj, EMPTY);
	}

	public static String getString(Object obj, String defaultStr) {
		return obj == null || "null".equalsIgnoreCase(obj.toString().trim()) ? defaultStr
				: StringUtils.defaultString(obj.toString().trim(), defaultStr);
	}

	public static int getIntValue(Object obj) {
		int result = 0;
		if (obj != null) {
			try {
				result = Integer.parseInt(obj.toString());
			} catch (Exception e) {
				log.error("getInteger error", e);
				result = 0;
			}
		}
		return result;
	}

	public static double getDoubleValue(Object obj) {
		double result = 0;
		if (obj != null) {
			try {
				result = Double.parseDouble(obj.toString());
			} catch (Exception e) {
				log.error("getInteger error", e);
				result = 0;
			}
		}
		return result;
	}

	public static boolean isBoolean(Object obj) {
		boolean result = false;
		if (obj != null) {
			try {
				result = "true".equals(obj.toString().toLowerCase()) || Integer.parseInt(obj.toString()) == 1;
			} catch (Exception e) {
				result = false;
			}
		}
		return result;
	}

	public static String removeHTMLTag(String html) {
		html = html.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");
		return html;
	}

	public static String removeHTML(String html) {
		if (isBlank(html)) {
			return "";
		}
		return Jsoup.parse(html).text();
	}

	public static String removeHTMLWihteTags(String html, String... tags) {
		return Jsoup.clean(html, "", Safelist.none().addTags(tags), new OutputSettings().prettyPrint(false));
	}

	public static String getAccountFormat(String symbol, int precisions) {
		StringBuilder builder = new StringBuilder();
		builder.append(symbol);
		builder.append("#,##0");
		for (int i = 0; i < precisions; i++) {
			if (i == 0) {
				builder.append(".");
			}
			builder.append("0");
		}
		return builder.toString();
	}

	public static String getMarkdownToHtml(String text) {
		if (isBlank(text)) {
			return "";
		}
		Parser parser = Parser.builder().build();
		Node document = parser.parse(text);
		HtmlRenderer renderer = HtmlRenderer.builder().build();
		return renderer.render(document);
	}

	public static String getMarkdownToPlainText(String text) {
		if (isBlank(text)) {
			return "";
		}
		return getMarkdownToPlainText(text, 3);
	}

	public static String getMarkdownToPlainText(String text, int loop) {
		String result = removeHTML(getMarkdownToHtml(text));
		if (result.contains("(/topic/")) {
			if (loop == 0) {
				return result;
			}
			return getMarkdownToPlainText(result, --loop);
		}
		return result;
	}
}
