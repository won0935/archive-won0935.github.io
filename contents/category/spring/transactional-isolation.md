---
title: "[JPA] @Transactional Isolation Level 정리"
date: '2022-02-14'
category: 'spring'
description: ''
emoji: '📦'
---

> JPA를 활용할 때, `@Transactional`의 각 옵션들에 대해 정확히 알고 사용하려고 한다.
> 
> 따라서 각 기술에 대해 공부해보았다.

---

# @Transactional(isolation= ?)
- **Isolation**(트랜잭션 격리수준)이란 **동시에 실행**되는 트랜잭션이 **서로에게 영향을 미치지 않도록** 지정하는 옵션이다.

---

# Propagation(전파) 항목 별 정리

`@Transactional`의 Isolation(트랜잭션 격리수준)에는 아래와 같은 4가지 항목이 있다.
아래로 갈수록 격리 수준이 높아진다.
4에 가까울 수록 동시성 접근 제어의 수준이 강해지며 동시 처리 성능은 낮아진다.
접근 제어를 강하게 수행한다는 것은 트랜잭션이 끝나기 전까지 해당 데이터를 잠그고 다른 트랜잭션에서 참조하지 못하게 하는 것이기 때문이다.

1. **Isolation.READ_UNCOMMITTED**: 커밋되지 않는 읽기
2. **Isolation.READ_COMMITTED**: 커밋된 읽기
3. **Isolation.REPEATABLE_READ**: 반복 가능한 읽기
4. **Isolation.SERIALIZABLE**: 직렬화 기능
 
## Isolation.READ_UNCOMMITTED

![image](https://user-images.githubusercontent.com/55419159/153827234-276cd414-5af4-449d-9f6c-f068fddc2cc4.png)


```java
@Transactional(isolation = Isolation.READ_UNCOMMITTED)
public void doSomething(){...}
```

- 트랜잭션 A가 특정 컬럼 데이터를 변경하고 있는 중에(커밋하지 않은 상태) 트랜잭션 B가 read하면 트랜잭션 A가 변경한 데이터를 읽어온다.
- 커밋되지 않는 읽기는 **Dirty Read**라는 문제가 있다. 
- 이는 트랜잭션 A가 특정 컬럼 데이터를 변경하고 rollback 했을 때 발생한다.

> Dirty Read란? 
> 
> 1. A 트랜잭션에서 10번 사원의 나이를 27살에서 28살로 바꿈
> 2. 아직 커밋하지 않음
> 3. B 트랜잭션에서 10번 사원의 나이를 조회함
> 4. 28살이 조회됨


## Isolation.READ_COMMITTED

![image](https://user-images.githubusercontent.com/55419159/153828461-1249ac01-fb86-4955-abea-4dab88d8c136.png)

```java
@Transactional(isolation = Isolation.READ_COMMITTED)
public void doSomething(){...}
```

- 커밋된 데이터만 조회할 수 있어 Dirty read는 발생하지 않는다.
- 트랜잭션 A가 특정 컬럼 데이터를 변경하고 있는 중에(커밋하지 않은 상태) 트랜잭션 B가 read하면 트랜잭션 A가 변경하기 전 데이터를 읽어온다. 
- 만약 트랜잭션 A가 데이터 변경 후 커밋하게 되면 트랜잭션 B는 변경된 데이터를 읽어온다.
- 이 격리 수준 이하에선 **Non-Repeatable Read** 문제가 발생한다.

> Non-Repeatable Read 란?
> 
> 하나의 트랜잭션이 같은 값을 조회할 때 다른 값이 검색되는 현상


##Isolation.REPEATABLE_READ

![image](https://user-images.githubusercontent.com/55419159/153828575-caeadbef-c366-49f4-b65a-35044f6182f7.png)

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void doSomething(){...}
```

- 트랜잭션이 시작되고 종료되기 전까지 한 번 조회한 값은 계속 같은 값이 조회되는 격리 수준이다.
- 트랜잭션 시작 전에 커밋된 내용에 한해서만 조회된다.
- 데이터를 변경하려고 하면 UNDO 영역에 백업해두고 실제 레코드를 변경하게 된다.
- 이 격리 수준에서는 Non-Repeatable Read 는 발생하지 않는다.
- 이 격리 수준에서는 UPDATE 한 데이터에 대해서는 정합성을 보장하지만, INSERT/DELETE 는 보장되지 않는다.
- 격리 수준 이하에서는 **Phantom Read** 문제가 발생한다.

> Phantom Read 란?
> 
> 한 트랜잭션 내에서 같은 쿼리를 두 번 수행 시, 첫 번째 쿼리에서 없던 레코드(유령, Phantom)가 두 번째 쿼리에서 발생하는 현상

##Isolation.SERIALIZABLE

```java
@Transactional(isolation = Isolation.SERIALIZABLE)
public void doSomething(){...}
```

- 트랜잭션이 특정 테이블을 읽으면 다른 트랜잭션은 그 테이블의 데이터를 **추가/변경/삭제할 수 없다.**
- **가장 강력한** 격리 수준이며 **데이터 정합성을 가장 잘 보장**한다.
- 그러나 동시 처리 성능이 가장 떨어진다.
- 이 격리 수준에서는 위에서 언급했던 Dirty Read, Non-Repeatable Read, Phantom Read 와 같은 정합성 문제가 전혀 발생하지 않는다.


## 참고 : 각 DB별 기본 격리수준
- **MYSQL** : `REPEATABLE READ`
- **ORACLE** : `READ COMMITTED`
- **H2** : `READ COMMITTED`