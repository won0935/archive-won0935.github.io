---
title: "[Spring] BeanPostProcessor"
date: '2022-10-20'
category: 'spring'
description: ''
emoji: '🛟'
---


# BeanPostProcessor란

`BeanPostProcessor`는 스프링이 빈 저장소에 등록할 목적으로 생성한 객체를 **빈 저장소에 등록하기 직전에 조작하고 싶을 때** 사용하는 기능이다.

`BeanPostProcessor`는 객체를 **조작**할 수도 있고, 완전히 다른 객체로 **교체**하는 것도 가능하다.

![image](https://user-images.githubusercontent.com/55419159/199490739-5578fc89-7c87-41d0-a36f-d2c1c364c252.png)

# BeanPostProcessor 과정

`BeanPostProcessor`를 통한 빈 등록 과정은 아래와 같다.

1. 스프링 빈 대상이 되는 객체를 **생성**
2. 생성된 객체를 빈 저장소에 등록하기 직전에 빈 후처리기에 **전달**
3. 전달된 스프링 빈 객체를 빈 후처리기가 조작 혹은 다른 객체로 **교체**
4. 전달된 빈을 그대로 반환하면 해당 빈이 등록되고 교체하면 다른 객체가 빈 저장소에 **등록**

# BeanPostProcessor 사용 방법

스프링에서 제공하는 `BeanPostProcessor`를 구현해주면 된다.

코드는 아래와 같다.

```java
public interface BeanPostProcessor {

	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

- `postProcessBeforeInitialization()` : 빈 생성 **이전** 시점에 개입한다.
- `postProcessAfterInitialization()` : 빈 생성 **이후** 시점에 개입한다.

# AOP와의 차이점

- `BeanPostProcessor` : **빈 객체 자체**를 바꿔치기 함
- `AOP PointCut` : **프록시 빈 객체**에 등록된 필터링 기능임. 프록시 빈 객체가 소환되고 동적으로 메서드가 넘어왔을 때, 이 메서드가 해당 클래스에서 실행되어도 될 지를 결정함

![image](https://user-images.githubusercontent.com/55419159/199490809-3c10f4fd-f455-4b9e-b013-c1359bd3c369.png)
