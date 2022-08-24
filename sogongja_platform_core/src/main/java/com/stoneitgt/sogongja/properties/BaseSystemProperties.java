package com.stoneitgt.sogongja.properties;

import lombok.Data;

/**
 * yml 파일에 등록되어 있는 시스템 변수에 대한 클래스
 *
 * @author yh.kim
 *
 */
@Data
public class BaseSystemProperties {

	private String uploadFilePath;

	private String staticFilePath;

	private String thumbnailFilePath;

	private String sitemapUrl;

	private String version;

}
