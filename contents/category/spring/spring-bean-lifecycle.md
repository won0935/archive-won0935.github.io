---
title: "[Spring] Spring Bean Lifecycle"
date: '2022-10-25'
category: 'spring'
description: ''
emoji: '🔋'
---

# Spring Bean Lifecycle 설정

스프링 컨테이너 내에서 **Bean의 생명주기를 설정하는 방법**은 3가지가 있다.

1. 스프링에서 제공하는 인터페이스 (`InitializingBean`, `DisposableBean`)
2. 설정 정보에서 초기화 메서드, 종료 메서드 지정하는 방법
3. `@PostConstruct`, `@PreDestroy` 어노테이션

## 1. ~~스프링에서 제공하는 인터페이스(잘 안씀)~~

```java
public class ExampleBean implements InitializingBean, DisposableBean {
  
  // 중략
  
  @Override
  public void afterPropertiesSet() throws Exception {
    // 초기화 
  }
  
  @Override
  public void destroy() throws Exception {
    // 메모리 반납, 연결 종료와 같은 과정 
  }
}
```

### 이 방식의 단점

- **스프링 전용 인터페이스**에 코드가 의존
- 메서드를 오버라이드하기 때문에 **메서드명 변경 불가능**
- 코드를 커스터마이징할 수 없는 외부 라이브러리에 적용 불가능

## 2. 설정 정보에서 초기화 메서드, 종료 메서드 지정하는 방법

```java
public class ExampleBean {
  
  // 중략
  
  public void initialize() throws Exception {
    // 초기화 
  }
  
  public void close() throws Exception {
    // 메모리 반납, 연결 종료와 같은 과정 
  }
}

@Configuration
static class LifeCycleConfig {

  @Bean(initMethod = "initialize", destroyMethod = "close")
  public ExampleBean exampleBean() {
    // 생략
  }
}
```

### 이 방식의 장점

- 메서드 **이름을 자유롭게** 부여 가능
- 스프링 코드에 **의존하지 않음**
- 설정 정보를 사용하기 때문에 코드를 커스터마이징 할 수 없는 **외부 라이브러리**에서도 적용 가능

### 이 방식의 단점

- `Bean` 지정 시 `initMethod`와 `destroyMethod`를 직접 지정해야 하는 번거로움
- `@Bean`의 `destroyMethod` 속성의 특징라이브러리는 대부분 종료 메서드명이 `close` 혹은 `shutdown`
- `@Bean`의 `destroyMethod`는 기본값이 inferred (추론)으로 등록 즉, `close`, `shutdown`라는 이름의 메서드가 종료 메서드라고 추론하고 자동으로 호출해줌 (즉, 종료 메서드를 따로 부여하지 않더라도 잘 작동)
- inferred 기능을 사용하기 싫다면 명시적으로 `destoroyMethod=""` 와 같이 공백을 지정해줘야 함

## 3. `@PostConstruct`, `@PreDestroy` 어노테이션

```java
public class ExampleBean {
  
  // 중략
  
  @PostConstruct
  public void initialize() throws Exception {
    // 초기화 
  }
  
  @PreDestroy
  public void close() throws Exception {
    // 메모리 반납, 연결 종료와 같은 과정 
  }
}

@Configuration
static class LifeCycleConfig {

  @Bean
  public ExampleBean exampleBean() {
    // 생략
  }
}
```

### 이 방식의 장점

- 최신 스프링에서 **권장하는 방법**
- **어노테이션**만 붙이면 되기 때문에 편리함
- 스프링에 종속적인 기술이 아니라 **자바 표준 코드**이기 때문에 다른 컨테이너에서도 동작
- **컴포넌트 스캔**과 잘 어울림

### 이 방식의 유일한 단점

- 커스터마이징이 불가능한 **외부 라이브러리**에서 사용 불가능 (외부 라이브러리에서 초기화, 종료를 해야 할 경우 두 번째 방법 즉, `@Bean`의 `initMethod`와 `destroyMethod` 키워드를 사용)

# 결론

```kotlin
if(코드수정이 되나?){
	@PostConstruct, @PreDestroy 사용
}
else{ //그럼 외부 라이브러리 인가?
  @Bean(initMethod = "", destroyMethod = "") 사용
}
```
