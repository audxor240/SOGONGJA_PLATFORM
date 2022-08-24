package com.stoneitgt.sogongja.user.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

import com.stoneitgt.sogongja.user.component.PasswordConstraintValidator;

@Constraint(validatedBy = PasswordConstraintValidator.class)
@Target({ ElementType.TYPE, ElementType.FIELD, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface ValidPassword {
	String message() default "Invalid Password";

	int min() default 9;

	int max() default 13;

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}