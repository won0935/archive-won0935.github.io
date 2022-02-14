---
title: "[JPA] @Transactional Propagation 정리"
date: '2022-02-13'
category: 'spring'
description: ''
emoji: '📡'
---

> JPA를 활용할 때, `@Transactional`의 각 옵션들에 대해 정확히 알고 사용하려고 한다.
> 
> 따라서 각 기술에 대해 공부해보았다.

---

# @Transactional(propagation= ?)
- propagation(영속성 전파)란 트랜잭션 동작 도중 **다른 트랜잭션을 호출할 때, 어떻게 할 것인지** 지정하는 옵션이다.
- `@Transactional`을 클래스 또는 메소드 레벨에 명시하면 해당 메소드 호출시 지정된 트랜잭션이 작동하게 된다. 
- 단, 해당 클래스의 `Bean`을 다른 클래스의 `Bean`에서 호출할 때만 `@Transactional`을 인지하고 작동하게된다.

---

# Propagation(전파) 항목 별 정리

`@Transactional`의 Propagation(영속성 전파)에는 아래와 같은 7가지 항목이 있다.

1. **Propagation.REQUIRED**: 기본(default) 값, 대부분의 경우 사용한다.
2. **Propagation.REQUIRES_NEW**: 새로운 트랜젝션을 실행(부모 트랜잭션이 있을 시에도)한다. 롤백 및 커밋이 전파되지 않는다.
3. **Propagation.NESTED**: 새로운 트랜잭션은 아니지만 트랜잭션 안에서 별도로 커밋되거나 롤백할 수 있다. SAVEPOINT(Oracle) 기능을 지원하는 DB만 사용 가능하다. 부모 트랜잭션이 없을 시에는 Propagation.REQUIRED과 동일하게 동작한다. 
4. **Propagation.MANDATORY**: 부모 트랜잭션 내에서만 실행한다.
5. **Propagation.SUPPORT**: 부모 트랜잭션이 존재하면 부모 트랜잭션으로 동작하고, 없을경우 non-transactional 하게 동작한다.
6. **Propagation.NOT_SUPPORT**: non-transactional로 동작한다. 부모 트랜잭션이 존재하면 일시 정지한다.
7. **Propagation.NEVER**: non-transactional로 동작한다. 부모 트랜잭션이 있을 때 오류를 발생한다.


## Propagation.REQUIRED
```java
@Transactional(propagation = Propagation.REQUIRED)
public void doSomething(){...}
```

- `default` 값이기 때문에 생략가능
- **부모 트랜잭션 내에서** 실행하며, 부모 트랜잭션이 없을 경우 **새로운 트랜잭션** 생성
  - 해당 메소드를 호출한 곳에서 별도의 트랜잭션이 설정되어 있지 않다면 트랜잭션을 새로 시작
  - 만약, 호출한 곳에서 이미 트랜잭션이 설정되어 있다면 기존의 트랜잭션 내에서 로직을 실행
- 예외가 발생하면 롤백이 되고 호출한 곳에도 롤백이 전파된다.


## Propagation.REQUIRES_NEW
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void doSomeThing() {...}
```

- `Propagation.REQUIRES_NEW`로 설정되어있을 때에는 매번 **새로운 트랜잭션을 시작**한다. (새로운 연결을 생성하고 실행)
- 만약, 호출한 곳에서 **이미 트랜잭션이 설정되어 있다면**(기존 연결이 있다면) 기존의 트랜잭션은 메소드가 종료할 때까지 잠시 대기 상태로 두고 자신의 트랜잭션을 실행한다.(부모 트랜잭션 상관X)
- 새로운 트랜잭션 안에서 예외가 발생해도 호출한 곳에는 **롤백이 전파되지 않는다**. 
- 즉, 2개의 트랜잭션이 **완전 독립적**으로 동작한다.


##Propagation.NESTED
```java
@Transactional(propagation = Propagation.NESTED)
public void doSomeThing() {...}
```

- 해당 메소드가 부모 트랜잭션에서 진행될 경우 별개로 커밋되거나 롤백될 수 있다. 
- 둘러싼 부모 트랜잭션이 없을 경우 `Propagation.REQUIRED`와 동일하게 작동한다. 
- 차이점은 SAVEPOINT를 지정한 시점까지 부분 롤백이 가능하다. 
- 유의해야 할 점은 DB가 **SAVEPOINT 기능을 지원해야** 사용이 가능(Oracle)하다. 
- 또한 이미 진행중인 트랜잭션이 있다면 **중첩 트랜잭션**을 시작한다.


## Propagation.MANDATORY
```java
@Transactional(propagation = Propagation.MANDATORY)
public void doSomeThing() {...}
```

- 부모 트랜잭션 내에서 실행되며, 부모 트랜잭션이 없을 경우 `Exception`이 발생한다.


## Propagation.SUPPORT
```java
@Transactional(propagation = Propagation.SUPPORT)
public void doSomeThing() {...}
```

- 부모 트랜잭션이 존재하면 부모 트랜잭션으로 동작하고, 없을경우 `non-transactional` 하게 동작한다.


## Propagation.NOT_SUPPORT
```java
@Transactional(propagation = Propagation.SUPPORT)
public void doSomeThing() {...}
```

- `non-transactional` 로 실행되며 부모 트랜잭션이 존재하면 일시 정지한다.


## Propagation.NEVER
```java
@Transactional(propagation = Propagation.NEVER)
public void doSomeThing() {...}
```

- `non-transactional` 로 실행되며 부모 트랜잭션이 존재하면 `Exception`이 발생한다.