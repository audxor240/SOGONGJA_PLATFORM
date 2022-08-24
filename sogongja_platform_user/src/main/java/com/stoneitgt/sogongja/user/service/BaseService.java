package com.stoneitgt.sogongja.user.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.stoneitgt.sogongja.user.properties.SystemProperties;

public class BaseService {

	@Autowired
	public SystemProperties systemProperties;

	@Autowired
	public FilesService filesService;

}
