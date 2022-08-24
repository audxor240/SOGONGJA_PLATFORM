package com.stoneitgt.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.validation.BindingResult;
import org.springframework.validation.DataBinder;
import org.springframework.validation.ObjectError;
import org.springframework.validation.Validator;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ValidatorUtil {

	/**
	 * 유효성 검증
	 *
	 * @param validator
	 * @param target
	 * @return
	 */
	public static BindingResult validate(Validator validator, Object target) {
		ValidatorUtil validatorUtil = new ValidatorUtil();
		BindingResult result = validatorUtil.getBindingResult(validator, target);
		List<String> collectionTypes = validatorUtil.getCollectionTypeMethodNames(target);
		try {
			for (String methodName : collectionTypes) {
				Method method = target.getClass().getMethod(methodName);
				Object object = method.invoke(target);
				if (object != null) {
					for (ObjectError error : validatorUtil.getBindingResult(validator, object).getAllErrors()) {
						result.addError(error);
					}
				}
			}
		} catch (Exception e) {
			if (log.isErrorEnabled()) {
				log.error("validate : " + e.getLocalizedMessage());
			}
		}
		return result;
	}

	/**
	 * 유효성 검증
	 *
	 * @param validator
	 * @param target
	 * @return
	 */
	public BindingResult getBindingResult(Validator validator, Object target) {
		DataBinder binder = new DataBinder(target);
		binder.setValidator(validator);
		binder.validate();
		return binder.getBindingResult();
	}

	/**
	 * Collection 타입의 메소드명을 추출한다.
	 *
	 * @param target
	 * @return
	 */
	public List<String> getCollectionTypeMethodNames(Object target) {
		List<String> methods = new ArrayList<String>();
		try {
			for (Method method : target.getClass().getDeclaredMethods()) {
				Class<?> cls = method.getReturnType();
				if (Collection.class.isAssignableFrom(cls)) {
					methods.add(method.getName());
				} else if (cls.getName().indexOf("com.stoneitgt.edu.") != -1) {
					methods.add(method.getName());
				}
			}
		} catch (Throwable e) {
			if (log.isErrorEnabled()) {
				log.error("getCollectionTypeMethodNames : " + e.getLocalizedMessage());
			}
		}
		return methods;
	}
}
