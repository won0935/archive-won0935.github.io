---
title: '[토비의 스프링] 1. 오브젝트와 의존관계 - 스프링의 IoC'
date: '2020-06-09'
category: 'study'
description: '스프링 IoC에 대하여'
emoji: '📖'
---

## 스프링의 IoC

스프링은 애플리케이션 개발의 다양한 영역과 기술에 관여하고 많은 기능을 제공합니다.

하지만, 스프링의 핵심을 담당하는 것은 `빈 팩토리` 또는 `애플리케이션 컨텍스트`이 스프링의 핵심입니다.  
이 두가지는 `DaoFactory`가 하는 일을 더 일반화 시킨 버전입니다.

> Factory의 역할 : 애플리케이션의 설계도 역할

컴포넌트를 생성한다던지, 의존 관계를 맺어주는 등등 ..

## 오브젝트 팩토리를 이용한 스프링 IoC

#### 애플리케이션 컨텍스트와 설정 정보

스프링에서는 스프링이 `제어권 + 관계`를 부여하는 객체를 `빈(bean)`이라고 부릅니다.  
동시에, `빈의 생성`과 `관계 설정`과 같은 제어를 담당하는 IoC 객체를 `빈 팩토리(bean factory)`라고 부르며 보통 빈 팩토리 보다는 `애플리케이션 컨텍스트`를 주로 사용합니다.

[[info | 애플리케이션 컨텍스트란 ?]]
| IoC 방식을 따라 확장된 일종의 빈 팩토리  
| 두 가지가 앞으로 동일하다고 생각하면 OK !

`애플리케이션 컨텍스트`는 설정 정보, 관계 정보 등을 직접 담고 있지는 않습니다.  
대신, 별도로 설정 정보를 담고 있는 무엇인가를 가져와 이를 활용하는 범용적인 IoC 엔진이라고 볼 수 있다.

> 별도의 설정 정보 : 자바 코드의 `@Configuration` or `XML 설정` 파일

#### DaoFactory를 사용하는 애플리케이션 컨텍스트

`애플리케이션 컨텍스트`가 사용할 설정 정보를 담은 `DaoFactory`

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // 애플리케이션 컨텍스트가 사용할 설정 정보라는 어노테이션
public class DaoFactory{
  @Bean // 오브젝트 생성을 담당하는 IoC용 메소드
  public UserDao userDao(){
    return new UserDao(connectionMaker());
  }

  @Bean
  public ConnectionMaker connectionMaker(){
      return new DConnectionMaker(); // 개발 전용
  }
}
```

애플리케이션 컨텍스트를 적용한 코드

```java
public class UserDaoTest{
  public static void main(String[] args) throws ClassNotFoundException, SQLException {
    ApplicationContext context = new AnnotationConfigApplicationContext(DaoFactory.class);
    // 위에서 등록한 @Bean 메서드의 이름으로 요청
    UserDao dao = context.getBean("userDao", UserDao.class);
  }
}
```

#### 오브젝트 팩토리 VS 애플리케이션 컨텍스트

기존의 `오브젝트 팩토리` 방식과 스프링의 `애플리케이션 컨텍스트` 방식을 비교해보자.

1. **오브젝트 팩토리**

   - 객체를 생성해주고 관계를 맺어주는 제한적인 역할만

2. **애플리케이션 컨텍스트**

   - 애플리케이션에서 IoC를 적용해서 관리할 모든 객체에 대한 생성과 관계 설정을 담당
   - 단, 직접적으로 맺어주는 코드는 없고 별도의 설정 정보를 통해 얻습니다.

#### 빈 팩토리 VS 애플리케이션 컨텍스트

1. **빈 팩토리**

   - 클라이언트가 요청할 때 되서야 `Lazy` 하게 요청을 처리힙니다.

2. **애플리케이션 컨텍스트**

   - 빈을 미리 `Eager` 하게 생성한 뒤 클라이언트가 요청할 때 준비된 오브젝트를 반환합니다.

##### 애플리케이션 컨텍스트 내부 동작 과정

1. `DaoFactory`를 설정정보로 등록한 뒤 `@Bean`이 붙은 메소드의 이름을 가져와 `Bean 목록`을 만듭니다.

2. 클라에서 `getBean()`으로 이름이 자신의 빈 목록에 있는지 확인합니다.

3. 있다면, 빈 객체를 생성한 뒤 or 가지고 있는 객체를 클라에게 return합니다.

##### 애플리케이션 컨텍스트의 장점

1. 클라이언트는 구체적인 팩토리 클래스를 알 필요가 없습니다.

   - 또, 설정을 자바 코드가 아닌 XML로 설정 가능 (관심사 분리)

2. 종합 IoC 서비스를 제공해줍니다.

   - 생성, 관계 설정 뿐 아니라 객체가 생성되는 방식, 전략, 자동 생성, 객체의 후처리 등등을 제공

3. 빈을 검색하는 다양한 방법을 제공합니다.

#### 스프링 IoC 용어 정리

기본적으로 비슷한 개념을 가진 다양한 용어가 혼용되므로 정리해보면

##### 빈(bean) ?

`스프링이 IoC 방식으로 관리하는 객체`

단, 모든 객체가 아닌 스프링이 직접 그 `생성과 제어를 담당하는 객체만` 빈이라고 부릅니다.

##### 빈 팩토리(bean factory) ?

`스프링의 IoC를 담당하는 핵심 컨테이너`

보통은 '빈 팩토리'를 바로 사용하지 않고 이를 확장한 '애플리케이션 컨텍스트'를 사용합니다.

##### 애플리케이션 컨텍스트(application context)

`빈 팩토리를 확장한 IoC 컨테이너`

'빈 팩토리'라고 부를 때는 빈의 생성과 제어 관점

'애플리케이션 컨텍스트'라고 부를 때는 스프링이 제공하는 애플리케이션 기능을 모두 포함한 관점

##### 컨테이너 또는 IoC 컨테이너 (container)

`IoC 방식으로 빈을 관리한다`는 의미에서 '애플리케이션 컨텍스트'나 '빈 팩토리'를 `컨테이너` 또는 `IoC 컨테이너`라고도 합니다.

보통 '컨테이너' 또는 '스프링 컨테이너'라고 할 때는 '애플리케이션 컨텍스트'를 의미하는 것으로 보면 됩니다.

## 마무리

이상으로 다음 포스팅은 `싱글톤 레지스트리`에 대해서 알아보겠습니다 🙇🏻‍♂️
