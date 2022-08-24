package com.stoneitgt.util.excel;

import java.util.HashMap;
import java.util.Map;

import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;

import com.stoneitgt.util.StringUtil;

public class ExcelCell {

	private String italic = "";
	private String align = "";
	private String format = "";
	private boolean bold = false;
	private boolean footer = false;
	private short rowColor = HSSFColorPredefined.WHITE.getIndex();
	private Map<String, Object> obj = new HashMap<>();

	public void parse(Map<String, Object> obj) {
		this.obj = obj;

		if (obj.containsKey("RowColor") && !"0".equals(StringUtil.getString(obj.get("RowColor")))) {
			rowColor = Short.parseShort(StringUtil.getString(obj.get("RowColor")));
		}

		if (obj.containsKey("RowBold") && "1".equals(StringUtil.getString(obj.get("RowBold")))) {
			bold = true;
		}

		if (obj.containsKey("RowFooter") && "1".equals(StringUtil.getString(obj.get("RowFooter")))) {
			footer = true;
		}
	}

	public String getValue(String key) {
		return StringUtil.getString(obj.get(key));
	}

	public int getRowSpan(String key) {
		String rowSpan = getValue("sRowSpan" + key);
		return "".equals(rowSpan) ? 1 : Integer.parseInt(rowSpan);
	}

	public Boolean getBold() {
		return bold;
	}

	public Boolean getFooter() {
		return footer;
	}

	public Boolean getItalic() {
		return "italic".equalsIgnoreCase(italic);
	}

	public String getAlign() {
		return align;
	}

	public String getFormat() {
		return format;
	}

	public short getRowColor() {
		return rowColor;
	}

}