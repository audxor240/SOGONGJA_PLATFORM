package com.stoneitgt.util.excel;

import java.util.Map;

import com.stoneitgt.util.StringUtil;


public class ExcelColumn {

	public static final class ALIGN {
		public static final int CENTER = 1;
		public static final int LEFT = 2;
		public static final int RIGHT = 3;
		public static final int DATE = 4;
	}

	private String colName = "";
	private int align = 0;
	private String dataName;
	private String format = "";
	private int colSpan = 1;
	private int rowSpan = 1;
	private int width = 100;
	private int height = 1;
	private boolean isFooter = false;
	private boolean isRowNum = false;
	private boolean isImage = false;
	private boolean isRowSpan = false;
	private boolean isMoney = false;

	public void parse(Map<String, Object> map) {

		isFooter = map.containsKey("foot") && "true".equals(map.get("foot"));

		colName = StringUtil.getString(map.get("title"));

		// 헤더에 html tag가 있는 경우에는 모두 치환해준다.
		colName = colName.replaceAll("<(/)?([a-zA-Z]*)(\\s[a-zA-Z]*=[^>]*)?(\\s)*(/)?>", "");

		String strWidth = StringUtil.getString(map.get("width"), "0");

		if (strWidth.length() > 0) {
			width = Integer.parseInt(strWidth.replaceAll("/^[0-9]/gi", ""));
		}

		align = StringUtil.getIntValue(map.get("align"));

		isMoney = !"".equals(StringUtil.getString(map.get("money")));

		format = StringUtil.getString(map.get("formatter"));

		dataName = "".equals(StringUtil.getString(map.get("mData"))) ? StringUtil.getString(map.get("data"))
				: StringUtil.getString(map.get("mData"));

		isImage = "img".equalsIgnoreCase(StringUtil.getString(map.get("edit")));

		String strColSpan = StringUtil.getString(map.get("colSpan"));
		if (!"".equals(strColSpan)) {
			colSpan = Integer.parseInt(strColSpan);
		}

		String strRowSpan = StringUtil.getString(map.get("rowSpan"));
		if (!"".equals(strRowSpan)) {
			rowSpan = Integer.parseInt(strRowSpan);
		}

		// isRowSpan = (boolean) map.get("sRowSpan");

		isRowSpan = false;

		isRowNum = "No".equalsIgnoreCase(StringUtil.getString(map.get("sTitle")))
				|| "No".equalsIgnoreCase(StringUtil.getString(map.get("title")));
	}

	public int getWidth() {
		return width;
	}

	public boolean isFooter() {
		return isFooter;
	}

	public boolean isImage() {
		return isImage;
	}

	public boolean isRowSpan() {
		return isRowSpan;
	}

	public boolean isRowNum() {
		return isRowNum;
	}

	public boolean isMoney() {
		return isMoney;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getColSpan() {
		return colSpan;
	}

	public int getRowSpan() {
		return rowSpan;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public String getName() {
		return colName;
	}

	public String getData() {
		return dataName;
	}

	public int getAlign() {
		return align;
	}

	public String getFormat() {
		return format;
	}

}
