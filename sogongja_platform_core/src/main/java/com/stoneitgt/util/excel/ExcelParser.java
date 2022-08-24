package com.stoneitgt.util.excel;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.stoneitgt.util.StringUtil;

public class ExcelParser {
	private ExcelRow[] rows;
	private int[] widths;

	private boolean header = false;
	private boolean footer = false;
	private boolean withoutHeader = false;

	private String profile = "gray";
	private String fileName = "EXCEL";
	private String sheetName = "Sheet1";
	private String fontName = "맑은 고딕";

	private short fontSize = 10;
	private short rowHeight = 360;

	private Map<String, Object> settings;
	private List<Map<String, Object>> column;
	private List<Map<String, Object>> data;
	private List<Map<String, Object>> dataList;
	private List<List<Map<String, Object>>> headerData;
	private List<String> rowsGroup;

	@SuppressWarnings("unchecked")
	public void setInit(Map<String, Object> map) throws Exception {

		if (map.containsKey("settings")) {
			settings = (Map<String, Object>) map.get("settings");
		}
		column = (List<Map<String, Object>>) map.get("columns");
		if (map.containsKey("rowsGroup")) {
			rowsGroup = (List<String>) map.get("rowsGroup");
		}

		if (map.get("dataList") != null) {
			dataList = (List<Map<String, Object>>) map.get("dataList");
			/*
			 * logger.debug("dataList : " + dataList.size()); for(HashMap<String, Object>
			 * dataMap : dataList){ logger.debug("dataMap SheetName : " +
			 * dataMap.get("SheetName")); logger.debug("dataMap Data : " +
			 * ((List<HashMap<String, Object>>) dataMap.get("Data")).size()); }
			 */
		} else {
			data = (List<Map<String, Object>>) map.get("data");
		}

		if (map.containsKey("isCall") && (boolean) map.get("isCall") && rowsGroup != null && rowsGroup.size() > 0) {
			mergeColumn(0, data.size() - 1, rowsGroup.toArray(new String[rowsGroup.size()]));
		}

		if (map.get("headerData") != null) {
			headerData = (List<List<Map<String, Object>>>) map.get("headerData");
		}

		String strHeader = StringUtil.getString(map.get("header"));
		if (!"".equals(strHeader) && strHeader.equalsIgnoreCase("true")) {
			header = true;
		}

		String strFooter = StringUtil.getString(map.get("footer"));
		if ((strFooter != null) && (strFooter.equalsIgnoreCase("true"))) {
			footer = true;
		}

		String strWithoutHeader = StringUtil.getString(map.get("without_header"));
		if (!"".equals(strWithoutHeader) && strWithoutHeader.equalsIgnoreCase("true")) {
			withoutHeader = true;
		}

		if (settings != null) {
			if (settings.containsKey("file") && !"".equals(StringUtil.getString(settings.get("file")))) {
				fileName = StringUtil.getString(settings.get("file"));
			}

			long time = System.currentTimeMillis();
			SimpleDateFormat today = new SimpleDateFormat("yyyymmddhhmmss");
			fileName += "_";
			fileName += today.format(new Date(time));

			if (settings.containsKey("sheet") && !"".equals(StringUtil.getString(settings.get("sheet")))) {
				sheetName = StringUtil.getString(settings.get("sheet"));
			}

			if (settings.containsKey("font") && !"".equals(StringUtil.getString(settings.get("font")))) {
				fontName = StringUtil.getString(settings.get("font"));
			}

			if (settings.containsKey("fontSize") && !"".equals(StringUtil.getString(settings.get("fontSize")))) {
				fontSize = Short.parseShort(StringUtil.getString(settings.get("fontSize")));
			}

			if (settings.containsKey("height") && !"".equals(StringUtil.getString(settings.get("height")))) {
				rowHeight = Short.parseShort(StringUtil.getString(settings.get("height")));
			}

			if (settings.containsKey("footerData") && settings.get("footerData") != null) {
				for (HashMap<String, Object> hm : (List<HashMap<String, Object>>) settings.get("footerData")) {
					data.add(hm);
				}
			}
		}

	}

	public ExcelColumn[][] getColumnsInfo(String mode) {
		ExcelColumn[][] columns;
		ArrayList<ExcelColumn> colList;

		if ("header".equals(mode)) {
			if (headerData != null && headerData.size() > 0) {
				int len = headerData.size();
				columns = new ExcelColumn[len][];
				for (int i = 0; i < len; i++) {
					colList = new ArrayList<>();
					for (Map<String, Object> obj : headerData.get(i)) {
						if ((boolean) obj.get("hidden")) {
							continue;
						}
						ExcelColumn col = new ExcelColumn();
						col.parse(obj);
						colList.add(col);
						columns[i] = colList.toArray(new ExcelColumn[colList.size()]);
					}
				}
				createWidthsArray(columns);
			} else {
				columns = getDataColumnsInfo(true);
			}
		} else {
			columns = getDataColumnsInfo(false);
		}

		return columns;
	}

	public ExcelColumn[][] getDataColumnsInfo(boolean isWidth) {
		ExcelColumn[][] columns = null;
		int len = column.size();
		if (len > 0) {
			ArrayList<ExcelColumn> colList = new ArrayList<>();
			for (Map<String, Object> obj : column) {
				// 컬럼속성이 visible=false 이거나 hidden=true(grid 에서는 사용, excel 생성시 미사용)일 경우에는 엑셀 컬럼을
				// 생성하지 않는다.
//                logger.debug("obj : " + obj);
				if ((obj.containsKey("visible") && !Boolean.parseBoolean(obj.get("visible").toString()))
						|| (obj.containsKey("hidden") && Boolean.parseBoolean(obj.get("hidden").toString()))) {
					continue;
				}
				ExcelColumn col = new ExcelColumn();
				// obj.put("sRowSpan", isRowSpan(obj));
				col.parse(obj);
				colList.add(col);
			}
			columns = new ExcelColumn[1][];
			columns[0] = colList.toArray(new ExcelColumn[colList.size()]);

			if (isWidth) {
				createWidthsArray(columns);
			}
		}
		return columns;
	}

	private void mergeColumn(int iStartRow, int iFinishRow, String[] columnsIndexes) {
		String[] columnsIndexesCopyShift = Arrays.copyOfRange(columnsIndexes, 1, columnsIndexes.length);
		int shiftLen = columnsIndexesCopyShift.length;
		String currentColumn = columnsIndexes[0].replace(":name", "");
		String columnName = "sRowSpan" + currentColumn;
//        logger.debug("[1] columnName : " + columnName + " / columnsIndexesCopyShift : " + columnsIndexesCopyShiftLength + " / iStartRow : " + iStartRow + " / iFinishRow : " + iFinishRow);
		int newSequenceRow = iStartRow;
		for (int iRow = iStartRow + 1; iRow <= iFinishRow; ++iRow) {
			if (!data.get(iRow).get(currentColumn).equals(data.get(newSequenceRow).get(currentColumn))) {
				data.get(newSequenceRow).put(columnName, iRow - newSequenceRow);
				if (shiftLen > 0) {
					mergeColumn(newSequenceRow, iRow, columnsIndexesCopyShift);
				}
				newSequenceRow = iRow;
			}
			data.get(newSequenceRow).put(columnName, iRow - newSequenceRow);
			if (shiftLen > 0) {
				mergeColumn(newSequenceRow, iRow, columnsIndexesCopyShift);
			}
		}
	}

	@SuppressWarnings("unused")
	private boolean isRowSpan(Map<String, Object> cols) {
		if (rowsGroup != null) {
			for (String rows : rowsGroup) {
				rows = rows.replace(":name", "");
				// logger.debug("rows : " + rows);
				// logger.debug("mData : " + (cols.get("mData").toString()));
				if ((cols.containsKey("mData") && rows.equals(cols.get("mData").toString()))
						|| (cols.containsKey("data") && rows.equals(cols.get("data").toString()))) {
					return true;
				}
			}
		}
		return false;
	}

	private void createWidthsArray(ExcelColumn[][] columns) {
		int len = columns[0].length;
		widths = new int[len];
		for (int i = 0; i < len; i++) {
			widths[i] = columns[0][i].getWidth();
		}
	}

	public ExcelRow[] getGridContent() {
		if (data == null) {
			return null;
		}
		rows = new ExcelRow[data.size()];
		// logger.debug("rows : " + rows.length);
		int i = 0;
		for (Map<String, Object> obj : data) {
			rows[i] = new ExcelRow();
			rows[i].parse(obj);
			i++;
		}
		return rows;
	}

	@SuppressWarnings("unchecked")
	public ExcelRow[] getGridContents(int index) {
		List<Map<String, Object>> rowData = (List<Map<String, Object>>) dataList.get(index).get("Data");
		rows = new ExcelRow[rowData.size()];
		// logger.debug("rows : " + rows.length);
		int i = 0;
		for (Map<String, Object> obj : rowData) {
			rows[i] = new ExcelRow();
			rows[i].parse(obj);
			i++;
		}
		return rows;
	}

	public int[] getWidths() {
		return widths;
	}

	public String getProfile() {
		return profile;
	}

	public String getSheetName() {
		return sheetName;
	}

	public String getFileName() {
		return fileName;
	}

	public boolean getHeader() {
		return header;
	}

	public Boolean getFooter() {
		return footer;
	}

	public boolean getWithoutHeader() {
		return withoutHeader;
	}

	public short getFontSize() {
		return fontSize;
	}

	public String getFontName() {
		return fontName;
	}

	public short getRowHeight() {
		return rowHeight;
	}

	public int getDataListLength() {
		return dataList.size();
	}

	public String getSheetNames(int index) {
		return dataList.get(index).get("SheetName").toString();
	}

}