---
title: "[JPA] @Transactional 옵션 정리"
date: '2022-02-15'
category: 'spring'
description: ''
emoji: '🧺'
---

> JPA를 활용할 때, `@Transactional`의 각 옵션들에 대해 정확히 알고 사용하려고 한다.
> 
> 따라서 각 기술에 대해 공부해보았다.

---

# @Transactional 의 옵션

Spring 에서 `@Transactional` 을 사용할 때 지정할 수 있는 옵션들은 아래와 같다.

- [isolation](https://won0935.github.io/category/spring/transactional-isolation/)
- [propagation](https://won0935.github.io/category/spring/transactional-propagation/)
- readOnly
- rollbackFor
- timeout


## @Transactional(readOnly= ?)

```java
@Transactional(readOnly = true)
public void doSomething(){...}
```

- **기본값**은 `false` 이며 `true` 로 세팅하는 경우 트랜잭션을 **읽기 전용**으로 변경한다.
- 만약 읽기 전용 트랜잭션 내에서 INSERT, UPDATE, DELETE 작업을 해도 반영이 되지 않거나 DB 종류에 따라서 아예 예외가 발생하는 경우가 있다. (MySQL의 경우 오류사항 없이 데이터 반영이 되지 않음)
- `@Transaction(readOnly = true)`로 설정하면 **읽기 성능 향상의 장점**이 있다.
- 읽기 외의 다른 동작을 방지하기 위해 사용하기도 한다.


#### @Transaction(readOnly = true) 가 더 빠른 이유
> **Dirty Checking** 을 하지 않기 때문
 1. JPA 에는 Dirty Checking 이라는 기능이 있다.
 2. 개발자가 임의로 UPDATE 쿼리를 사용하지 않아도 트랜잭션 커밋 시에 1차 캐시에 저장되어 있는 Entity 와 스냅샷을 비교해서 변경된 부분이 있으면 UPDATE 쿼리를 날려주는 기능이다.
 3. readOnly = true 옵션을 주면 스프링 프레임워크가 하이버네이트의 FlushMode 를 MANUAL 로 설정해서 Dirty Checking 에 필요한 스냅샷 비교 등을 생략하기 때문에 성능이 향상된다.


## @Transactional(rollbackFor= ?)

```java
@Transactional(rollbackFor = {IOException.class, ClassNotFoundException.class})
public void doSomething(){...}
```

- 기본값은 `RuntimeException`, `Error` 이며, 기본적으로 트랜잭션은 종료 시 변경된 데이터를 커밋한다.
- 하지만 @Transactional 에서 rollbackFor 속성을 지정하면 **특정 Exception 발생 시 데이터를 커밋하지 않고 롤백하도록 변경**할 수 있다.
- rollbackFor 속성으로 다른 Exception 을 추가해도 RuntimeException 이나 Error 는 여전히 데이터를 롤백한다.
- 만약 강제로 데이터 롤백을 막고 싶다면 `noRollbackFor` 옵션으로 지정해주면 된다.

## @Transactional(timeout= ?)

```java
@Transactional(timeout = 2)
public void doSomething(){...}
```

- **기본값은 -1**(무한)이며, 지정한 시간 내에 해당 메소드 수행이 완료되이 않은 경우 `JpaSystemException` 을 발생시킨다.
- `JpaSystemException` 은 `RuntimeException` 을 상속받기 때문에 데이터 역시 **롤백 처리** 된다.
- **초 단위**로 지정할 수 있으며 기본값인 -1 인 경우엔 timeout 을 지원하지 않는다.