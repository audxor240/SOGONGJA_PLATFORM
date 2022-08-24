package com.stoneitgt.sogongja.admin.config;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class DataSourceConfig {

	public static final String PRIMARY_DATASOURCE = "primaryDataSource";
	public static final String PRIMARY_SESSION_FACTORY = "primarySqlSessionFactory";
	public static final String PRIMARY_SQL_SESSION = "primarySqlSession";
	public static final String PRIMARY_TRANSACTION_MANAGER = "primaryTransactionManager";


	@Primary
	@Bean(name = PRIMARY_DATASOURCE)
	@ConfigurationProperties(prefix = "spring.primary.datasource")
	public DataSource dataSourcePrimary() {
		return DataSourceBuilder.create().build();
	}
}
