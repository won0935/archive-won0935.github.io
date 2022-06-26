---
title: "[JPA] @Transactional 와 AOP"
date: '2022-06-24'
category: 'spring'
description: ''
emoji: '✏️'
---

> 개발을 하며 `@Transactional`에 대해 잘못 사용하고 있는 경우가 있었다.
> `@Transactional`의 동작구조를 이해하기 위해서는 스프링의 AOP 를 다시 한번 생각해보는 것이 중요했다.
> 따라서 각 기술에 대해 공부해보았다.

- **AOP**란 무엇이며 왜 사용하는가
- Spring AOP는 왜 **프록시**를 사용하는가
- `@Transactional`은 어떻게 동작하는가

# AOP(Aspect Oriented Programming)란 무엇이며 왜 사용하는가

![image](https://user-images.githubusercontent.com/55419159/175801451-20c84e73-e4e2-42b5-8136-7ab4adbbb3a3.png)

AOP란 Aspect Oriented Programming의 약자로 관점 지향 프로그래밍이라고 한다.
여기서 **Aspect(관점)이란 흩어진 관심사들을 하나로 모듈화 한 것**을 의미한다.

**객체 지항 프로그래밍(OOP)**에서는 주요 관심사에 따라 클래스를 분할한다.
이 클래스들은 보통 **SRP(Single Responsibility Principle)**에 따라 하나의 책임만을 갖게 설계된다.
하지만 클래스를 설계하다보면 **로깅, 보안, 트랜잭션** 등 여러 클래스에서 공통적으로 사용하는 부가 기능들이 생긴다.
이들은 주요 비즈니스 로직은 아니지만, 반복적으로 여러 곳에서 쓰이는 데 이를 **흩어진 관심사(Cross Cutting Concerns)**라고 한다.

> AOP 없이 흩어진 관심사를 처리하면 다음과 같은 문제가 발생한다.
> - 여러 곳에서 반복적인 코드를 작성해야 한다.
> - 코드가 변경될 경우 여러 곳에 가서 수정이 필요하다.
> - 주요 비즈니스 로직과 부가 기능이 한 곳에 섞여 가독성이 떨어진다.

따라서 **흩어진 관심사를 별도의 클래스로 모듈화**하여 위의 문제들을 해결하고, 결과적으로 **OOP를 더욱 잘 지킬 수 있도록 도움을 주는 것이 AOP**이다.

## AOP의 주요 개념

- `Aspect`: Advice + PointCut로 AOP의 기본 모듈
- `Advice`: Target에 제공할 부가 기능을 담고 있는 모듈
- `Target`: Advice이 부가 기능을 제공할 대상 (Advice가 적용될 비즈니스 로직)
- `JointPoint`: Advice가 적용될 위치 (메서드 진입 지점, 생성자 호출 시점, 필드에서 값을 꺼내올 때 등 다양한 시점에 적용 가능)
- `PointCut`: Target을 지정하는 정규 표현식

--- 

# Spring AOP는 왜 프록시 방식을 사용하는가?

> Spring AOP는 기본적으로 **프록시 방식**으로 동작한다.
>
> 프록시 패턴이란 어떤 객체를 사용하고자 할 때, 객체를 직접적으로 참조 하는 것이 아니라, 해당 객체를 **대행(대리, proxy)하는 객체를 통해 대상객체에 접근하는 방식**을 말한다.

그렇다면 Spring은 왜 `Target` 객체를 직접 참조하지 않고 프록시 객체를 사용할까?
프록시 객체 없이 `Target` 객체를 사용하고 있다고 생각해보자.

`Aspect` 클래스에 정의된 부가 기능을 사용하기 위해서, 우리는 원하는 위치에서 직접 `Aspect` 클래스를 호출해야 한다.
이 경우, `Target` 클래스 안에 부가 기능을 호출하는 로직이 포함되기 때문에 **AOP를 적용하지 않았을 때와 동일한 문제**가 발생한다.
**여러 곳에서 반복적**으로 `Aspect`를 호출해야 하고, 그로 인해 유지보수성이 크게 떨어진다.

그래서 Spring에서는 `Target` 클래스 혹은 그의 상위 **인터페이스를 상속하는 프록시 클래스를 생성**하고, **프록시 클래스에서 부가 기능에 관련된 처리**를 한다.
이렇게 하면 `Target`에서 `Aspect`을 알 필요 없이 순수한 **비즈니스 로직에 집중**할 수 있다.

예를 들어 다음 코드의 `logic()` 메서드가 `Target`이라면,

```java
public interface TargetService {
    void logic();
}

@Service
public class TargetServiceImpl implements TargetService {
    @Override
    public void logic() {
...
    }
}
```

Proxy에서 `Target` 전/후에 부가 기능을 처리하고 `Target`을 호출한다.

```java
@Service
public class TargetServiceProxy implements TargetService {
    // 지금은 구현체를 직접 생성했지만, 외부에서 의존성을 주입 받도록 할 수 있다.
    TargetService targetService = new TargetServiceImpl();
...

    @Override
    public void logic() {
        // Target 호출 이전에 처리해야하는 부가 기능

        // Target 호출
        targetService.logic();

        // Target 호출 이후에 처리해야하는 부가 기능
    }
}
```

사용하는 입장에서는 `Target` 객체를 사용하는 것처럼 Proxy 객체를 사용할 수 있다.

```java
@Service
public class UseService {
    // 지금은 구현체를 직접 생성했지만, 외부에서 의존성을 주입 받도록 할 수 있다.
    TargetService targetService = new TargetServiceProxy();
...

    public void useLogic() {
        // Target 호출하는 것처럼 부가 기능이 추가된 Proxy를 호출한다.
        targetService.logic();
    }
}
```

## JDK Proxy와 CGLib Proxy
Spring에서는 몇 가지 설정을 하면 자동으로 `Target`의 프록시 객체를 생성해주는데, **JDK Proxy(Dynamic Proxy)**와 **CGLib Proxy**를 만들 수 있다.

두 방식의 가장 큰 차이점은 `Target`의 어떤 부분을 상속 받아서 프록시를 구현하느냐에 있다.

![image](https://user-images.githubusercontent.com/55419159/175801301-1af8e29f-4d05-4f0b-8fda-cfbc373dade0.png)

### JDK Proxy
JDK Proxy는 `Target`의 상위 **인터페이스를 상속** 받아 프록시를 만든다.
따라서 인터페이스를 구현한 클래스가 아니면 의존할 수 없다.
`Target`에서 다른 구체 클래스에 의존하고 있다면, JDK 방식에서는 그 클래스(빈)를 찾을 수 없어 런타임 에러가 발생한다.

### CGLib Proxy
CGLib Proxy는 `Target` **클래스를 상속** 받아 프록시를 만든다.
JDK 방식과는 달리 인터페이스를 구현하지 않아도 되고, 구체 클래스에 의존하기 때문에 런타임 에러가 발생할 확률도 상대적으로 적다.
또한 JDK Proxy는 내부적으로 Reflection을 사용해서 추가적인 비용이 들지만, CGLib는 그렇지 않다고 한다.
여러 성능 상 이점으로 인해 **Spring Boot**에서는 **CGLib**를 사용한 방식을 기본으로 채택하고 있다.

---

# @Transactional은 어떻게 동작하는가

`@Transactional`는 Proxy 형태로 동작한다.
트랜잭션 처리를 위한 `@Transactional` 애노테이션은 **Spring AOP의 대표적인 예**이다.
(**Spring은 JDK Proxy**, **Spring Boot는 CGLIb Proxy**를 기본으로 하기 때문에, 사용하는 것에 따라 생성된 프록시 객체 형태는 다를 수 있다.)


## @Transactional의 동작 순서

![image](https://user-images.githubusercontent.com/55419159/175801322-34c8e4d5-54b7-4691-84bb-3ee3aa700d3c.png)

1. `Target`에 대한 호출이 들어오면 AOP proxy가 이를 가로채서(intercept) 가져온다. 
2. AOP proxy에서 `Transaction Advisor`가 commit 또는 rollback 등의 트랜잭션 처리를 한다. 
3. 트랜잭션 처리 외에 다른 부가 기능이 있을 경우 해당 `Custom Advisor`에서 그 처리를 한다. 
4. 각 `Advisor`에서 부가 기능 처리를 마치면 `Target Method`를 수행한다. 
5. interceptor chain을 따라 caller에게 결과를 다시 전달한다.

코드 레벨로 보자면 아래와 유사한 작업이 이루어진다.

```java
public class TransactionProxy {
    private final TransactonManager manager = TransactionManager.getInstance();
...

    public void transactionLogic() {
        try {
            // 트랜잭션 전처리(트랜잭션 시작, autoCommit(false) 등)
            manager.begin();

            // 다음 처리 로직(타겟 비스니스 로직, 다른 부가 기능 처리 등)
            target.logic();

            // 트랜잭션 후처리(트랜잭션 커밋 등)
            manager.commit();
        } catch (Exception e) {
            // 트랜잭션 오류 발생 시 롤백
            manager.rollback();
        }
    }
```

## @Transactional 적용 예제

`@Transactional`이 프록시 방식으로 동작하는 것을 모른다면 실수하기 쉬운 부분들이 있다.
여기서는 몇 가지 예제를 통해 그 부분을 짚고 넘어가고자 한다.


1. `private` **메소드는 트랜잭션 처리를 할 수 없다.**
앞서 트랜잭션이 코드 레벨에서 어떻게 동작하는지 대락적으로 살펴봤다. 
프록시 객체는 타겟 객체/인터페이스를 상속 받아서 구현하는데, `private`으로 되어 있으면 **자식인 프록시 객체에서 호출할 수 없다**. 
따라서 `@Transactional` 이 붙는 메서드, 클래스는 프록시 객체에서 접근 가능한 레벨로 지정해야 한다.


2. 트랜잭션은 객체 외부에서 **처음 진입하는 메서드를 기준**으로 동작한다.

#### 다음과 같이 A, B, C의 메서드가 있다고 가정하자.

- A 메서드는 쿠폰을 생성하는 메서드이고, 트랜잭션이 적용되어 있다.
- B 메서드는 A 메서드를 3번 호출하고, 트랜잭션이 적용되어 있지 않다.
- C 메서드도 A 메서드를 3번 호출한다. 하지만 C에는 트랜잭션이 적용되어 있다.

```java
@Service
public class TestService {

    @Autowired
    CouponGroupMapper couponGroupMapper;

    @Transactional
    public void A(CouponGroupParam param) {
        param.setStatus(CouponGroupStatus.CREATED);    // 상태 변경
        couponGroupMapper.insertCouponGroup(param);
    }

    public void B() {
        for (int i = 0; i < 3; i++) {
            CouponGroupParam param = new CouponGroupParam();
            param.setName("1000포인트 쿠폰");
            param.setAmount(1000);
            param.setMaxCount(100);
            param.setValidFromDt(new Date());
            param.setValidToDt(new Date());
            param.setIssuerId("0101");
            param.setCode("B000" + i);

            A(param);
        }

        throw new RuntimeException(); // 오류 발생!
    }

    @Transactional
    public void C() {
        for (int i = 0; i < 3; i++) {
            CouponGroupParam param = new CouponGroupParam();
            param.setName("1000 포인트 쿠폰");
            param.setAmount(1000);
            param.setMaxCount(100);
            param.setValidFromDt(new Date());
            param.setValidToDt(new Date());
            param.setIssuerId("0101");
            param.setCode("C000" + i);

            A(param);
        }

        throw new RuntimeException(); // 오류 발생!
    }
}
```

B, C 메서드 모두 정상적인 경우라면 쿠폰 3개를 신규 생성한다.
그렇다면 B와 C 메서드는 동일한 기능을 한다고 볼 수 있을까?

#### 쿠폰을 3개를 모두 생성한 뒤 오류가 발생했다고 가정해보자.
B,C 메서드에서 호출하는 A 메서드에는 트랜잭션 처리가 되어있기 때문에, B,C 모두 3개의 쿠폰을 정상적으로 생성한다고 예상할 수도 있다.
직접 코드를 실행했을 때의 결과는 다음과 같았다.


#### 진입 메서드에 트랜잭션이 적용되어 있지 않은 경우 (B 메서드)

![image](https://user-images.githubusercontent.com/55419159/175801356-b011c140-6d5f-4b52-ab39-78acb6660b76.png)
B 메서드를 실행하면, 쿠폰을 생성하는 3번의 쿼리가 호출된 뒤 `RuntimeExcetption`이 발생하는 것을 확인할 수 있다.
![image](https://user-images.githubusercontent.com/55419159/175801371-2db19b53-d8c9-41ff-b73a-d3aecfe6f19d.png)
DB에도 3개의 쿠폰 데이터가 잘 생성되어 있는 것을 확인할 수 있다.

#### 진입 메서드에 트랜잭션이 적용되어 있는 경우 (C 메서드)

![image](https://user-images.githubusercontent.com/55419159/175801390-e5543954-9257-4700-94ce-528984d835fe.png)
C 메서드도 B 메서드와 동일하게 쿠폰을 생성하는 3번의 쿼리가 호출된 뒤 `RuntimeExcetption`이 발생한다.
![image](https://user-images.githubusercontent.com/55419159/175801405-ed696d2f-d423-4780-9e1b-dc8f0dac0bce.png)
하지만 DB를 확인해보면 아무런 쿠폰 데이터가 생성되어 있지 않다!

이렇게 B, C 메서드를 실행한 결과가 다른 것은 트랜잭션이 프록시로 동작한다는 사실을 이해한다면 당연한 결과이다.

![image](https://user-images.githubusercontent.com/55419159/175801427-7699470e-ec80-4912-8f6c-46005211da35.png)

클래스에 `@Transactional` 처리가 되어 있는 부분(A, C 메서드)이 있다면, Spring은 해당 부분에 트랜잭션 처리를 추가한 프록시를 자동으로 생성한다.
그리고 외부에서 호출하면, 원래 클래스가 아닌 프록시가 대신 호출된다.

1. C 메서드를 호출하면, `TestService`가 아닌 `TestService`의 프록시에 구현된 C 메서드가 대신 호출된다. 따라서 C와 C에서 호출하는 A 모두 프록시 객체에서 트랜잭션 처리를 해준다. 
2. 하지만 B 메서드를 호출하는 것은 트랜잭션 처리가 되어 있지 않은 순수 B 메서드를 호출하는 것과 같다. 이때 B에서 호출하는 A 역시 트랜잭션 처리가 되어 있지 않다.

결과적으로 트랜잭션은 **객체 외부에서 처음 진입하는 메서드를 기준으로 동작**한다는 사실을 알 수 있다.

---

# 결론
- **AOP는 흩어진 관심사를 별도의 클래스로 모듈화하는 프로그래밍 방법**을 말하며, OOP를 더욱 잘 지킬 수 있도록 도움을 준다.
- **Spring AOP**는 **프록시** 객체를 자동으로 생성해주어, `Aspect`/`Advice`에 직접적으로 의존하지 않게 해준다.
- `@Transactional` 도 Spring AOP 중 하나로 **프록시 방식**으로 동작한다.
  - 원본 클래스/인터페이스를 상속 받아 프록시를 생성하기 때문에 접근 제어가 `private`**으로 되어 있으면 안된다**.
  - 객체 외부에서 처음으로 진입하는 메서드에 트랜잭션 처리가 되어 있어야, 해당 요청을 프록시 객체가 대신 처리할 수 있다. 따라서 트랜잭션은 객체 **외부에서 처음 진입하는 메서드를 기준**으로 동작한다.
