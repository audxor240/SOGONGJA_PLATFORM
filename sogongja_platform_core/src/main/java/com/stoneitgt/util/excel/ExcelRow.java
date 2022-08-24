package com.stoneitgt.util.excel;

import java.util.Map;

public class ExcelRow {

	private ExcelCell cells;

	public void parse(Map<String, Object> obj) {
		ExcelCell cell = new ExcelCell();
		cell.parse(obj);
		cells = cell;
	}

	public ExcelCell getCells() {
		return cells;
	}
}
