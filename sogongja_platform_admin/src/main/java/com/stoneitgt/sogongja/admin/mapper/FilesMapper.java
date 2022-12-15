package com.stoneitgt.sogongja.admin.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.stoneitgt.sogongja.domain.Files;

@Mapper
public interface FilesMapper {

	List<Map<String, Object>> getFileList(Map<String, Object> params);

	Files getFile(int fileSeq);

	int insertFile(Files file);

	int updateFile(Files file);

	int deleteFile(Map<String, Object> params);

	int deleteFileByTypeAndSeq(Map<String, Object> params);

	int deleteFileAll(Map<String, Object> params);

	int updateFileTitle(Files file);
}
