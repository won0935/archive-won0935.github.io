---
title: "[Spring] JDK Dynamic Proxy VS CGLIB"
date: '2022-10-30'
category: 'spring'
description: ''
emoji: '🪔'
---


# [Spring] JDK Dynamic Proxy VS CGLIB - 재원

# IoC 컨테이너와 AOP Proxy의 관계

**Spring AOP**는 Proxy의 메커니즘을 기반으로 AOP Proxy를 제공하고 있다.

![image](https://user-images.githubusercontent.com/55419159/199493071-61bc4982-a9ea-47ee-87ca-98c2cb481aa5.png)

다음 그림처럼 **Spring AOP**는 사용자의 특정 호출 시점에 IoC 컨테이너에 의해 AOP를 할 수 있는 `Proxy Bean`을 생성한다.

동적으로 생성된 `Proxy Bean`은 타깃의 메소드가 호출되는 시점에 부가기능을 추가할 메소드를 자체적으로 판단하고 가로채어 부가기능을 주입해주는데, 이처럼 호출 시점에 동적으로 위빙을 한다 하여 **런타임 위빙(Runtime Weaving)**이라 한다.

따라서 Spring AOP는 **런타임 위빙의 방식을 기반**으로 하고 있으며, Spring에선 런타임 위빙을 할 수 있도록 상황에 따라 **JDK Dynamic Proxy**와 **CGLIB** 방식을 통해 `Proxy Bean`을 생성을 해준다. 그렇다면 이 두 가지 AOP Proxy는 어떠한 상황에 생성하게 되는걸까?

# 두 가지 AOP Proxy는 어떠한 상황에 생성하게 될까?

Spring은 AOP Proxy를 생성하는 과정에서 자체 검증 로직을 통해 타깃의 인터페이스 유무를 판단한다.

![image](https://user-images.githubusercontent.com/55419159/199493124-9884541d-902c-4988-8316-954db007dd13.png)

- 하나 이상의 인터페이스를 구현하고 있는 클래스라면 **JDK Dynamic Proxy** 방식으로 생성
- 인터페이스를 구현하지 않은 클래스라면 **CGLIB** 방식으로 AOP 프록시를 생성

# JDK Dynamic Proxy

**JDK Dynamic Proxy**란 Java의 리플렉션 패키지에 존재하는 `Proxy`라는 클래스를 통해 생성된 Proxy 객체를 의미한다. 핵심은 타깃의 **인터페이스를 기준**으로 `Proxy`를 생성해준다는 점이다.

## JDK Dynamic Proxy의 Proxy

JDK Dynamic Proxy를 사용하여 Proxy 객체를 생성하는 방법은 아래와 같다.

```java
Object proxy = Proxy.newProxyInstance(ClassLoader       // 클래스로더
                                    , Class<?>[]        // 타깃의 인터페이스
                                    , InvocationHandler // 타깃의 정보가 포함된 Handler
              										  );
```

단순히 리플랙션의 `Proxy` 클래스의 `newProxyInstance` 메소드를 사용하면 되는데, **JDK Dynamic Proxy**가 이 파라미터를 가지고 Proxy 객체를 생성해주는 과정은 다음과 같다.

![image](https://user-images.githubusercontent.com/55419159/199493214-8eafce4d-22ac-444c-af98-f55d690e518f.png)

타깃의 인터페이스를 구현하여 Proxy 생성

1. 타깃의 인터페이스를 자체적인 검증 로직을 통해 `ProxyFactory`에 의해 타깃의 인터페이스를 상속한 `Proxy` 객체 생성
2. `Proxy` 객체에 `InvocationHandler`를 포함시켜 하나의 객체로 반환

# CGLib(Code Generator Library)

**CGLib**은 **Code Generator Library**의 약자로, 클래스의 **바이트코드를 조작하여 Proxy 객체를 생성**해주는 라이브러리다.

Spring은 CGLib을 사용하여 인터페이스가 아닌 타깃의 클래스에 대해서도 Proxy를 생성해주고 있는데, CGLib은 `Enhancer`라는 클래스를 통해 Proxy를 생성할 수 있다.

```java
Enhancer enhancer = new Enhancer();
         enhancer.setSuperclass(MemberService.class); // 타깃 클래스
         enhancer.setCallback(MethodInterceptor);     // Handler
Object proxy = enhancer.create(); // Proxy 생성
```

다음과 같이 **CGlib**은 타깃의 **클래스를 상속**받아 다음 그림과 같이 Proxy를 생성해준다.

![image](https://user-images.githubusercontent.com/55419159/199493261-63ee0a19-8947-4efe-878c-e525fcc3d5a4.png)

타깃 클래스를 상속받아 Proxy 생성

이 과정에서 CGLib은 타깃 클래스에 포함된 **모든 메소드를 재정의**하여 Proxy를 생성한다.

이 때문에 CGLib은 Final 메소드 또는 클래스에 대해 재정의를 할 수 없으므로 Proxy를 생성할 수 없다는 단점이 있다.

## 권장하지 않았던 CGLib

이러한 이유엔, 기존의 CGLiB은 **3 가지의 한계**가 존재했기 때문이다.

- `net.sf.cglib.proxy.Enhancer` 의존성 추가
- `default` 생성자
- 타깃의 생성자 **두 번** 호출

우선, 첫 번째는 Spring에서 기본적으로 지원하지 않는 방식이었기 때문에 별도로 **의존성을** **추가하여** 개발했다.

그다음으론 CGLib을 구현하기 위해선 반드시 파라미터가 없는 **default** **생성자가** 필요했고,

생성된 CGLib Proxy의 메소드를 호출하게 되면 **타깃의** **생성자가** **2번** 호출된다는 단점이 존재했다.

## Spring Boot가 선택한 CGLib

**Spring Boot에서는 CGLib**을 기본 전략으로 가져가고 있다.

이유는 아래의 **한계들이 해결되어서** 이다.

- `~~net.sf.cglib.proxy.Enhancer` 의존성 추가~~
    - [Spring 3.2](https://docs-stage.spring.io/spring/docs/current/spring-framework-reference/core.html#aop-api) 버전부터 CGLib을 `Spring Core` 패키지에 포함시켜 더이상 의존성을 추가하지 않아도 개발할 수 있게 되었다.
- `~~default` 생성자~~
    - 4 버전에선 [Objensis 라이브러리](http://objenesis.org/) 의 도움을 받아 `default` 생성자 없이도 Proxy를 생성할 수 있게 되었다.
- ~~타깃의 생성자 **두 번** 호출~~
    - 생성자가 2번 호출되던 상황도 개선되었다.
