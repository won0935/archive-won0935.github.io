---
title: '[토비의 스프링] 1. 오브젝트와 의존관계 - 의존관계 주입(DI)'
date: '2020-06-13'
category: 'study'
description: '의존관계 주입(DI)에 대하여'
emoji: '📥'
---

## 의존관계 주입(DI)

#### 제어의 역전(IoC)과 의존관계 주입(DI)

IoC 는 매우 폭 넓게 사용되는 용어이고 스프링이 제공하는 IoC 동작 방식을 구체화하면 `의존관계 주입(DI)`이 더 명확합니다.

DI는 오브젝트를 오브젝트에 주입하는 동작이 아닌 `오브젝트 레퍼런스를 외부로부터` 제공받는 것입니다.

#### 런타임 의존관계 설정

**의존 관계란 ?**

`A -> B` 라는 관계에서 A는 B에 의존한다고 말합니다.

즉, B가 변하면 A에 영향을 미치는 관계일 때 의존한다고 합니다.

반대로, 'B는 A에 의존하지 않는다'도 맞는 말입니다.

**의존 관계의 조건**

책에서는 이러한 `직접적인 의존 관계`를 없애려고 노력합니다.

요구사항이 바뀔 때마다, 업데이트 될 때마다 `서로가 서로에게 영향`을 주기 때문에 비용이 큽니다.  
(결합도가 높음)

따라서, 의존관계 주입은 다음과 같은 조건을 만족해야합니다.

1. 코드에는 런타임 시점의 의존관계가 드러나지 않아야합니다.

   - 즉, `인터페이스`에만 의존하고 있어야합니다.

2. 런타임 시점의 의존관계는 컨테이너 or 팩토리 같은 `제 3의 존재`가 결정합니다.

3. 의존관계는 사용할 오브젝트의 레퍼런스를 주입해줌으로써 만들어집니다.

`DI`는 자신이 사용할 오브젝트에 대한 선택과 생성을 외부로 넘기고 자신은 수동적으로 주입받는 오브젝트를 사용한다는 점에서 IoC 개념과 잘 들어맞는다.

#### DI의 장점

- 인터페이스를 통해 `결합도가 낮은` 코드를 만들 수 있습니다.

  - 결합도가 낮은 코드는 `변경을 통한 확장에 자유롭다`는 장점을 가져옵니다.

- `관심사의 분리(SoC)`를 통해 얻어지는 `높은 응집도`를 가질 수 있습니다.

  - 높은 응집도는 `서로 독립적으로 작용`한다는 의미이므로 유지보수 비용이 낮아집니다.

#### 메소드를 통한 의존관계 주입

**DI의 조건**

DI를 위해서는 주입되는 오브젝트와 주입받는 오브젝트 양쪽 모두 스프링 빈으로 등록되어야합니다.  
스프링이 생성하고 관리하는 IoC 대상이어야 DI에 참여할 수 있기 때문입니다.

보통 DI 해주는 3가지 방법이 있습니다.

1. 생성자 메소드를 이용한 주입

2. 수정자 메소드(Setter)를 이용한 주입

3. 일반 메소드를 이용한 주입

   > 한 번에 여러개 파라미터를 받거나 하는 장점

책에서는 XML과 수정자 메서드를 자주 사용한다고 되어 있으나 최근 `XML`보다는 `JavaConfig`가 자주 사용됩니다.

또한, 객체를 `immutable` 하도록(변경이 필요한 것 제외하고는) 프로그래밍을 하는 것이 좋고 생성자 메소드를 사용하면 다음과 같은 이점이 있습니다.

1. `null` 을 주입하지 않는 한 `NullPointerException` 은 발생하지 않습니다.

2. 의존관계에 대한 내용을 외부로 노출시킴으로써 `컴파일 타임에 오류`를 잡아낼 수 있습니다.

참고 링크 : https://yaboong.github.io/spring/2019/08/29/why-field-injection-is-bad

## DI 설정

`Spring Boot`로 개발을 많이 진행하면서, 또 몇가지 이유 등으로 `XML` 파일 설정은 최근 잘 사용되지 않으니 해당 포스팅은 참고용으로 보시길 바랍니다. !

**JavaConfig의 이점**

참고 링크 : https://stackoverflow.com/questions/29162278/benefits-of-javaconfig-over-xml-configurations-in-spring

## XML을 이용한 DI 설정

**클래스 설정과 XML 설정의 대응 항목**

|             | 자바 코드 설정 정보    | XML 설정 정보            |
| :---------- | :--------------------- | :----------------------- |
| 빈 설정파일 | @Configuration         | `<beans>`                |
| 빈의 이름   | @Bean methodName()     | `<bean id="methodName">` |
| 빈의 클래스 | return new BeanClass() | `class="BeanClass">`     |

---

또한, XML에서는 `<property>` 태그를 사용해 의존 오브젝트와의 관계를 정의합니다.

`<property>` 태그는 name과 ref 라는 두 개의 애트리뷰트를 갖습니다.

- **name**

  - 수정자 메소드의 프로퍼티의 이름

- **ref**

  - 수정자 메소드를 통해 주입해줄 오브젝트의 빈 ID

**예시)**

JAVA

```java:title=Java
@Configuration
public class DaoFactory{
  @Bean ConnectionMaker myConnectionMaker(){
    return new DConnectionMaker();
  }

  @Bean
  public UserDao userDao(){
    UserDao userDao = new UserDao();
    userDao.setConnectionMaker(myConnectionMaker());
    return userDao;
  }
}
```

XML

```xml:title=XML
</beans>
  <bean id="myConnectionMaker" class="springbook.user.dao.DConnectionMaker" />

  <bean id="userDao" class="springbook.dao.UserDao">
    <property name="connectionMaker" ref="myConnectionMaker" />
  </bean>
</beans>
```

#### 프로퍼티 값의 주입

**값 주입**

다른 오브젝트의 레퍼런스가 아닌 단순 정보도 수정자 메소드에 넣을 수 있습니다.

**EX)**

```xml:title=XML
<property name="username" value="spring" />
```

단, 여기서 모두 `String` 타입으로 주입되는 것이 스프링이 프로퍼티의 값을, 수정자 메소드의 파라미터 타입을 참고로 해서 적절한 형태로 변환 시켜줍니다.

> Integer, Double, String, Boolean 기본 타입 + Class, URL, File 같은 오브젝트 + List, Map, Set 등으로도 값의 주입이 가능합니다.
