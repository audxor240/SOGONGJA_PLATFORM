package com.stoneitgt.sogongja.admin;

import javax.annotation.PreDestroy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

/**
 * Sring-boot 메인 실행 파일.
 *
 * @author yh.kim
 *
 */
@Slf4j
@SpringBootApplication
@EnableEncryptableProperties
public class AdminApplication {

	/**
	 * 메인 함수.
	 *
	 * @param args
	 */
	public static void main(String[] args) {
		SpringApplication.run(AdminApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void doSomethingAfterStartup() {
		log.warn("SOGONAJA Admin Application started!");
	}

	/**
	 * App이 닫히기 전에 실행되는 함수.
	 */
	@PreDestroy
	public void closeApp() {
		log.warn("SOGONAJA Admin Application closed!");
	}
}
