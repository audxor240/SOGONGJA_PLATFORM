package com.stoneitgt.sogongja.admin.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.stoneitgt.sogongja.admin.properties.SystemProperties;

public class BaseService {

	@Autowired
	public SystemProperties systemProperties;

	@Autowired
	public FilesService filesService;

}
