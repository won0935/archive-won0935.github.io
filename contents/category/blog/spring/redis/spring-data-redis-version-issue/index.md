---
title: '[Spring] Spring Boot 2.3.2.RELEASE 버전 Redis 이슈'
date: '2020-11-20'
category: 'blog'
description: ''
emoji: '❓'
---

## 발생한 이슈

프로젝트에 여러대의 WAS를 운영해도 문제 없도록 세션을 공유하기 위한 메모리 캐시 서버로 Redis를 두려고 `Spring Data Redis`를 적용했습니다.

다음과 같은 코드에서 이슈가 발생했는데요.

사용자로부터 인증 코드를 받고 `Redis`에 저장되어 있던 인증 코드와 비교하는 로직이 있는 코드입니다.

```java:title=java
public void verifyAuthenticationCode (){
    // ...

    String id = NCPAuthCode.generateId(phoneNumber, LocalDateTime.now());
    NCPAuthCode ncpAuthCode = ncpAuthCodeRepository.findById(id)
            .orElseThrow(SMSCodeExpiredException::new);
    System.out.println(ncpAuthCode);

    if (ncpAuthCode.isNotEqualCode(code)) throw new SMSNotMatchingCodeException();

    // ...
}
```

여기서, Redis에 존재하는 인증 코드를 넘겨주었을 땐 아래와 같이 값이 정상적으로 잘 출력되었습니다.

```java
NCPAuthCode(id=4823941:2020-11-20, authCode=123456)
```

하지만, 존재하지 않는 인증 코드를 넘겨주었을 땐 `SMSCodeExpiredException`이 발생하는 것이 아닌 계속 아래와 같은 결과가 출력되었습니다.

```java
NCPAuthCode(id=null, authCode=null)
```

`orElseThrow()`는 Optional 래퍼 클래스 메서드로 값이 존재하지 않으면 Exception을 발생시키는데 위와 같이 객체 인스턴스는 존재하지만 빈 값을 가지고 있는 객체가 반환되었습니다.

코드상 문제가 있는지 확인했지만 이상이 없었고 저와 비슷한 상황을 가진 개발자가 있나 구글링을 한 끝에 원인을 발견했습니다.

## 원인

원인은 정말 단순하게 `Spring Boot`의 버전 문제였습니다.. 🙀

저는 현재 `2.3.2.RELEASE` 버전을 사용하고 있었는데, 해당 버전에서만 위와 같은 이슈가 발생했다고 합니다.

아무것도 건들이지 않고 버전만 `2.3.3.RELEASE` 버전으로 업그레이드하니 위와 같은 문제가 발생하지 않았습니다.

버전 이슈는 아무리 경험해도 파악하기 어려운 것 같습니다 😿

## 참고

- https://stackoverflow.com/questions/63132068/why-spring-data-redis-findbyid-returns-null-values-in-optional-after-upgrading-t
- https://jira.spring.io/browse/DATAREDIS-1192
