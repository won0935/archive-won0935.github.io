---
title: '[토비의 스프링] 5-2. 단일 책임 원칙과 테스트 추상화'
date: '2020-07-07'
category: 'study'
description: '단일 책임 원칙과 테스트 추상화 (테스트 대역 - Mock 테스트)'
emoji: '⚠️'
---

## 개요

지난 포스팅에서는 추상화 기법을 통해서 특정 기술 환경(DBMS의 종류에 상관 없이, 여러 DBMS를 한번에 사용하던지 등)에 종속되지 않은 서비스 추상화에 대해서 알아보았습니다.

이번 포스팅에서는 각자의 책임을 분리하는 `단일 책임 원칙`과 의존 관계에 종속되지 않은 테스트를 만들 수 있는 `테스트 추상화`에 대해 알아보겠습니다.

## 단일 책임 원칙

이전에 JDBC Connection을 UserService에서 직접 생성해서 사용하는 경우에는 사용자 레벨을 관리하는 `비즈니스 로직`과 `트랜잭션 관리` 두가지 책임을 가지고 있었습니다.

하지만, 트랜잭션 서비스 추상화 방식을 도입하고 나서는 UserService에서는 비즈니스 로직만 담고 있기에 다른 코드에서 수정이나 문제가 발생했을 때 UserService의 코드는 수정하지 않아도 됩니다.

#### 단일 책임 원칙의 장점

- 어떤 수정사항이 발생할 경우 `수정할 대상`이 명확해집니다.

  - DAO의 개수나 서비스 클래스가 많아질 수록 적절하게 책임과 관심을 분리하고, 서로 영향을 주지 않도록 다양한 추상화 기법을 적용하는 것이 단일 책임 원칙을 지키는 방법입니다.

- 많은 디자인 패턴이 적용되어야 가능하기 때문에 자연스럽게 습득이 가능합니다.

이처럼, DI는 단일 책임 원칙을 지키는 가장 핵심적인 도구라고 이야기할 수 있습니다.

단순히 런타임 오브젝트 DI 뿐만 아니라 자바 엔터프라이즈 기술의 많은 문제를 해결할 수 있으며 깔끔하고 유연한 코드를 만들 수 있습니다.

## 테스트 추상화

테스트 환경을 만들어주기 위해 기존의 의존 오브젝트를 대체할 수 있도록 만든 오브젝트를 `테스트 대역`(test double)이라고 부릅니다.

`테스트 대역`을 세분화하면 다음과 같이 여러 카테고리로 분류됩니다.

`Dummy` - `Fake` - `Stub` - `Mock`

> 참고 : https://beomseok95.tistory.com/295

책에서는 `Stub`와 `Mock`에 대해서 설명해주고 있습니다.

#### Stub 오브젝트

테스트가 정상적으로 수행될 수 있도록 의존 오브젝트에 간접적으로 입력을 제공해 테스트를 돕는 오브젝트입니다.

인터페이스의 기능을 최소한으로 구현한 오브젝트입니다.

> 이 책에서는 Dummy와 Stub의 구분을 짓지 않은 것 같습니다.

```java:title=Java
public class DummyMailSender implements MailSender {
    @Override
    public void send(SimpleMailMessage mailMessage) throws MailException {}

    @Override
    public void send(SimpleMailMessage[] mailMessages) throws MailException {}
}
```

#### Mock 오브젝트

스텁 오브젝트에서 출력값을 반환하게하여 의존 오브젝트 간에 일어나는 작업을 검증까지 가능하도록 만든 오브젝트입니다.

```java:title=Java
public class MockMailSender implements MailSender {
    private List<String> requests = new ArrayList<>();

    // 모든 send가 끝난 후 이 메소드를 호출해서 잘 저장되었는지 검증할 수 있습니다.
    public List<String> getRequests() {
        return requests;
    }

    @Override
    public void send(SimpleMailMessage mailMessage) throws MailException {
        requests.add(mailMessage.getTo()[0]);
    }

    @Override
    public void send(SimpleMailMessage[] mailMessages) throws MailException {

    }
}
```

## 정리

- 비즈니스 로직을 담은 코드는 데이터 액세스 로직을 담은 코드와 깔끔하게 분리되어야 합니다.

  - 비즈니스 로직의 코드 안에서도 책임과 역할에 따라 깔끔하게 분리되어야 합니다.

- DAO를 사용하는 비즈니스 로직에는 단위 작업을 보장해주는 트랜잭션(의 경계설정)이 필요합니다.

- 스프링이 제공하는 트랜잭션 동기화 기법을 활용하자 !

- 트랜잭션 서비스 추상화로 DI를 느슨하게 조절하자 !

- 테스트 대상이 사용하는 '의존 오브젝트'를 대체하는 오브젝트를 '테스트 대역'이라 부릅니다.

- 테스트 대역 중에서도 목 오브젝트는 테스트 '대상으로부터' 전달받은 정보를 '검증'할 수 있도록 설계된 것을 말합니다.

## 마무리

오늘은 `단일 책임 원칙`과 `테스트 추상화`에 대해서 알아 보았습니다.

다음 포스팅은 이 책에서 가장 큰 범위를 가진 `AOP`에 대해서 알아보겠습니다 !
