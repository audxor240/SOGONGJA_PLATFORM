package com.stoneitgt.sogongja.user.config;

import javax.sql.DataSource;

import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.type.JdbcType;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.stoneitgt.sogongja.interceptor.QueryRowBoundsInterceptor;

@Configuration
@EnableTransactionManagement
@MapperScan(basePackages = "com.stoneitgt.sogongja.user.mapper", sqlSessionFactoryRef = DataSourceConfig.PRIMARY_SESSION_FACTORY)
public class MyBatisConfigPrimary {

	@Autowired
	@Qualifier(DataSourceConfig.PRIMARY_DATASOURCE)
	private DataSource dataSource;

	/**
	 * Oracle sqlSessionFactory 설정 상단 @MapperScan - sqlSessionFactoryRef 명칭과 메소드명이
	 * 동일해야 한다!!! (중요)
	 *
	 * @return
	 * @throws Exception
	 */
	@Bean(name = DataSourceConfig.PRIMARY_SESSION_FACTORY)
	public SqlSessionFactory sqlSessionFactory() throws Exception {
		SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
		factoryBean.setDataSource(dataSource);
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		// Mapper Location
		factoryBean.setMapperLocations(resolver.getResources("classpath:user/mapper/*.xml"));
		// MyBatis Plugins
		factoryBean.setPlugins(new Interceptor[] { new QueryRowBoundsInterceptor() });
		// Aliases Package
		factoryBean.setTypeAliasesPackage("com.stoneitgt.sogongja.user.domain");
		// Configuration
		org.apache.ibatis.session.Configuration configuration = factoryBean.getObject().getConfiguration();
		configuration.setCallSettersOnNulls(true);
		configuration.setLazyLoadingEnabled(false);
		configuration.setAggressiveLazyLoading(false);
		configuration.setMapUnderscoreToCamelCase(true);
		configuration.setJdbcTypeForNull(JdbcType.NULL);
		factoryBean.setConfiguration(configuration);

		return factoryBean.getObject();
	}

	@Bean(name = DataSourceConfig.PRIMARY_SQL_SESSION)
	public SqlSessionTemplate sqlSessionTemplate() throws Exception {
		SqlSessionTemplate template = new SqlSessionTemplate(sqlSessionFactory());
		return template;
	}

	@Bean(name = DataSourceConfig.PRIMARY_TRANSACTION_MANAGER)
	public DataSourceTransactionManager dataSourceTransactionManager() {
		return new DataSourceTransactionManager(dataSource);
	}

}