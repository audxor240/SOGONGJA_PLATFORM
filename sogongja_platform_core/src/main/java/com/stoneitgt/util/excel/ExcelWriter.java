package com.stoneitgt.util.excel;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor.HSSFColorPredefined;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.util.IOUtils;

import com.stoneitgt.util.FileUtil;
import com.stoneitgt.util.StringUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ExcelWriter {

	private Workbook workbook;
	private Sheet sheet;

	private ExcelColumn[][] cols;
	private ExcelParser parser;

	private int rowsStat = 0;
	private String rootPath = "";

	private Map<String, HSSFFont> fontStyleMap;
	private Map<String, CellStyle> cellStyleMap;

	private short ROW_HEIGHT = 360;

	private Map<String, Object> model;
	private HttpServletRequest request;
	private HttpServletResponse response;

	@SuppressWarnings("unchecked")
	public ExcelWriter(Workbook workbook, Map<String, Object> model, HttpServletResponse response,
			HttpServletRequest request) {
		this.workbook = workbook;
		this.model = (Map<String, Object>) model.get("excel");
		this.request = request;
		this.response = response;
	}

	public void generate() {
		parser = new ExcelParser();
		fontStyleMap = new HashMap<>();
		cellStyleMap = new HashMap<>();
		try {
			rootPath = request.getServletContext().getRealPath("/");
			parser.setInit(model);
			createExcel(parser);
			headerPrint(parser);
			rowsPrint(parser);
			outputExcel(parser, response, request);
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	private void createExcel(ExcelParser parser) throws IOException {
		// Workbook 생성
		workbook = new HSSFWorkbook();
		// Sheet 생성
		sheet = workbook.createSheet(parser.getSheetName());
	}

	private void headerPrint(ExcelParser parser) throws Exception {
		cols = parser.getColumnsInfo("header");

		int widths[] = parser.getWidths();

		Font font = createFont(HSSFColorPredefined.BLACK.getIndex());
		CellStyle cellStyle = createStyle(font, HorizontalAlignment.CENTER, HSSFColorPredefined.PALE_BLUE.getIndex(),
				HSSFColorPredefined.BLACK.getIndex(), "");

		Row row;
		Cell cell;

		if (!parser.getWithoutHeader()) {
			List<int[]> mergeList = new ArrayList<>();
			for (ExcelColumn[] col : cols) {
				row = sheet.createRow(rowsStat);
				row.setHeight((short) (ROW_HEIGHT + 40));
				int colLen = col.length;
				for (int j = 0; j < colLen; j++) {
					cell = row.createCell(j);
					cell.setCellStyle(cellStyle);
					sheet.autoSizeColumn(j);
					sheet.setColumnWidth(j, widths[j] * 70);

					String name = col[j].getName();
					cell.setCellValue(name);

					// Cell이 미리 생성되지 않아서 머지대상만 별도의 리스트로 담아서 후처리한다.
					int colSpan = col[j].getColSpan();
					int rowSpan = col[j].getRowSpan();
					if (colSpan > 1 || rowSpan > 1) {
						int[] merge = new int[4];
						merge[0] = rowsStat; // firstRow
						merge[1] = (rowSpan > 1) ? rowsStat + rowSpan - 1 : rowsStat; // lastRow
						merge[2] = j; // firstCol
						merge[3] = (colSpan > 1) ? j + colSpan - 1 : j; // lastCol
						// System.out.println("["+ j + "] ===== [0] : " + merge[0] + " / [1]: " +
						// merge[1] + " / [2]: " + merge[2]+ " / [3]: " + merge[3]);
						mergeList.add(merge);
					}
				}
				rowsStat++;
			}

			// 가로 세로 머지
			for (int[] merge : mergeList) {
				// System.out.println("[0] : " + merge[0] + " / [1]: " + merge[1] + " / [2]: " +
				// merge[2]+ " / [3]: " + merge[3]);
				sheet.addMergedRegion(new CellRangeAddress(merge[0], merge[1], merge[2], merge[3]));
			}

			// 헤더 틀고정
			sheet.createFreezePane(0, rowsStat);
		}
	}

//	@SuppressWarnings("deprecation")
	private void rowsPrint(ExcelParser parser) throws Exception {

		ExcelRow[] rows = parser.getGridContent();

		if (rows == null || rows.length == 0) {
			return;
		}

		cols = parser.getColumnsInfo("rows");

		Row row;
		Cell cell;
		Font font;
		CellStyle cellStyle;

		Drawing<?> drawing = null;

		HorizontalAlignment align;
//        short color;

		String formatString;

		ExcelCell cells;

		// short rowHeight = parser.getRowHeight();

		int rowsLen = rows.length;
		for (int i = 0; i < rowsLen; i++) {
			cells = rows[i].getCells();
			row = sheet.createRow(rowsStat);

			row.setHeight(getRowHeight(cells));

//            color = (i % 2 == 1) ? HSSFColor.WHITE.index : HSSFColor.WHITE.index;

			int colsLen = cols[0].length;

			for (int j = 0; j < colsLen; j++) {

				cell = row.createCell(j);

				int al = cols[0][j].getAlign();

				if (al == ExcelColumn.ALIGN.CENTER || al == ExcelColumn.ALIGN.DATE) {
					align = HorizontalAlignment.CENTER;
				} else if (al == ExcelColumn.ALIGN.RIGHT) {
					align = HorizontalAlignment.RIGHT;
				} else {
					align = HorizontalAlignment.LEFT;
				}

				if (i == 0 && cols[0][j].isImage()) {
					drawing = sheet.createDrawingPatriarch();
				}

				formatString = cols[0][j].getFormat();

				try {
					// 우측정렬인 경우에는 숫자로 변환한다.
					if (al == ExcelColumn.ALIGN.RIGHT) {
						cell.setCellValue(Double.parseDouble(cells.getValue(cols[0][j].getData())));
//						cell.setCellType(CellType.NUMERIC);

						if (cols[0][j].isMoney()) {
							try {
								formatString = StringUtil.getAccountFormat(cells.getValue("ExcelSymbol"),
										Integer.parseInt(cells.getValue("Precisions")));
							} catch (Exception e) {
								formatString = "#,##0";
							}
						}
					} else {
						if (cols[0][j].isImage()) {
							String filePath = cells.getValue(cols[0][j].getData());
							if (!"".equals(filePath)) {
								setImgCell(workbook, rowsStat, j, rootPath + filePath, drawing);
							}
						} else {
							if (cols[0][j].isRowNum() && !cells.getFooter()) {
								cell.setCellValue(i + 1);
							} else {
								cell.setCellValue(cells.getValue(cols[0][j].getData()));
							}
						}
					}
				} catch (Exception e) {
					cell.setCellValue(cells.getValue(cols[0][j].getData()));
				}

				font = createFont(HSSFColorPredefined.BLACK.getIndex(), cells.getBold(),
						"0".equals(cells.getValue("Flag")));
				cellStyle = createStyle(font, align, cells.getRowColor(), HSSFColorPredefined.BLACK.getIndex(),
						formatString);
				cell.setCellStyle(cellStyle);

				// log.info("cols[" + 0 + "][" + j + "] : " + cols[0][j].isRowSpan());
				// log.info("cells.getRowSpan() : " + cells.getRowSpan());

				if (cols[0][j].isRowSpan()) {
					int rowSpan = cells.getRowSpan(cols[0][j].getData());
					if (rowSpan > 1) {
						sheet.addMergedRegion(new CellRangeAddress(rowsStat, rowsStat + rowSpan - 1, j, j));
					}
				}
			}
			rowsStat++;
		}
	}

	private short getRowHeight(ExcelCell cells) {
		int colsLen = cols[0].length;
		boolean isImageRow = false;
		for (int i = 0; i < colsLen; i++) {
			if (cols[0][i].isImage()) {
				String filePath = cells.getValue(cols[0][i].getData());
				if (!"".equals(filePath)) {
					isImageRow = true;
				}
				break;
			}
		}
		return isImageRow ? 1600 : ROW_HEIGHT;
	}

	private void outputExcel(ExcelParser parser, HttpServletResponse response, HttpServletRequest request)
			throws Exception {

		String filename = FileUtil.encodeFilename(parser.getFileName(), request);

		response.setContentType("application/vnd.ms-excel");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Content-Disposition", "attachment;filename=" + filename + ".xls");
		response.setHeader("Cache-Control", "max-age=0");

		OutputStream os = null;
		BufferedOutputStream bos = null;

		try {
			os = response.getOutputStream();
			bos = new BufferedOutputStream(os);
			workbook.write(bos);
		} catch (Exception e) {
			log.error("", e);
		} finally {
			if (bos != null) {
				bos.close();
			}
			if (os != null) {
				os.close();
			}
		}
	}

	private void setImgCell(Workbook workbook, int row, int cell, String filePath, Drawing<?> drawing)
			throws Exception {

		InputStream is = null;

		try {
			File file = new File(filePath);

			if (!file.exists()) {
				return;
			}

			is = new FileInputStream(file);
			byte[] bytes = IOUtils.toByteArray(is);
			int pictureIdx = workbook.addPicture(bytes, HSSFWorkbook.PICTURE_TYPE_JPEG);

			// add a picture shape
			// HSSFClientAnchor(int dx1, int dy1, int dx2, int dy2,...) -> 꼭지점이라 생각하면된다
			// dx2와 dy2는 최대값이 있다 -> dx2 : 0~1023, dy2 : 0~255
			// 현재 헤더의 선 때문에 이미지가 약간씩 밀리고 또 이미지간의 구분을 위해 2씩 떼도록 설정하였다
//            HSSFCreationHelper helper = workbook.getCreationHelper();
//            HSSFClientAnchor anchor = helper.createClientAnchor();
//            anchor.setDx1(1);
//            anchor.setDy1(1);
//            anchor.setDx2(1023);
//            anchor.setDy2(253);
//            anchor.setCol1(cell);
//            anchor.setRow1(row);
//            anchor.setCol2(cell);
//            anchor.setRow2(row);

			ClientAnchor anchor = new HSSFClientAnchor(4, 2, 4, 2, (short) cell, row, (short) cell, row);
			anchor.setAnchorType(ClientAnchor.AnchorType.DONT_MOVE_AND_RESIZE);

			Picture pic = drawing.createPicture(anchor, pictureIdx);
//            double scale = 1.0;
			pic.resize();
		} finally {
			try {
				if (is != null)
					is.close();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			}
		}
	}

	private HSSFFont createFont(short fontColor) {
		return createFont(fontColor, true, false);
	}

	private HSSFFont createFont(short fontColor, boolean fontBold, boolean strikeout) {
		String strFontStyle = fontColor + "|" + fontBold + "|" + strikeout;

		if (fontStyleMap.containsKey(strFontStyle)) {
			return fontStyleMap.get(strFontStyle);
		}

		HSSFFont font = (HSSFFont) workbook.createFont();
		font.setBold(fontBold);
		font.setColor(fontColor);
		font.setFontName(parser.getFontName());
		font.setFontHeightInPoints(parser.getFontSize());
		font.setStrikeout(strikeout);

		fontStyleMap.put(strFontStyle, font);

		return font;
	}

	private CellStyle createStyle(Font font, HorizontalAlignment cellAlign, short cellColor, short cellBorderColor,
			String cellFormat) {
		String strCellStyle = font.getIndexAsInt() + "|" + cellAlign + "|" + cellColor + "|" + cellBorderColor + "|"
				+ cellFormat;

		if (cellStyleMap.containsKey(strCellStyle)) {
			return cellStyleMap.get(strCellStyle);
		}

		CellStyle style = workbook.createCellStyle();
		DataFormat format = workbook.createDataFormat();

		style.setFont(font);
		style.setAlignment(cellAlign);
		style.setVerticalAlignment(VerticalAlignment.CENTER);
		style.setFillForegroundColor(cellColor);
		style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style.setWrapText(true);

		if (!"".equals(cellFormat)) {
			style.setDataFormat(format.getFormat(cellFormat));
		}

		style.setBorderTop(BorderStyle.THIN);
		style.setBorderLeft(BorderStyle.THIN);
		style.setBorderRight(BorderStyle.THIN);
		style.setBorderBottom(BorderStyle.THIN);

		style.setTopBorderColor(cellBorderColor);
		style.setLeftBorderColor(cellBorderColor);
		style.setRightBorderColor(cellBorderColor);
		style.setBottomBorderColor(cellBorderColor);

		cellStyleMap.put(strCellStyle, style);

		return style;
	}
}
