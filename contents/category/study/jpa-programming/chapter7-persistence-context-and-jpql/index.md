---
title: '[JPA 프로그래밍] 7. 영속성 컨텍스트와 JPQL'
date: '2020-11-11'
category: 'study'
description: ''
emoji: '📦'
---

# 영속성 컨텍스트와 JPQL, 플러시 모드

먼저 한 번에 여러 데이터를 수정할 수 있는 벌크 연산에 대해 알아보고

JPQL과 영속성 컨텍스트, JPQL의 플러시 모드에 대해 알아보자

## 1. 벌크 연산

**Update, Delete 벌크 연산**

```java:title=Java
String qlString = "UPDATE Product p " +
    "SET p.price = p.price * 1.1 " +
    "WHERE p.stockAmount < :stockAmount"; // 또는 delete 쿼리

int resultCount = em.createQuery(qlString)
                  .setParameter("stockAmount", 10)
                  .executeUpdate(); // 벌크 연산
```

JPA 표준은 아니지만 하이버네이트는 `insert` 벌크 연산도 지원한다.

#### 벌크 연산의 주의점

벌크 연산이 영속성 컨텍스트를 무시하고 데이터베이스에 직접 쿼리한다는 점에 주의 !

따라서, 엔티티를 조회 한 뒤 벌크 연산하고 해당 엔티티를 조회해보면 벌크 연산한 결과가 영속성 컨텍스트에 반영이 안되는 케이스가 발생함

위와 같은 상황을 해결하는 방법 몇 가지를 소개

1. `em.refresh()` 사용
   - 벌크 연산 수행 직후 호출
2. 벌크 연산 먼저 실행
3. 벌크 연산 수행 후 영속성 컨텍스트 초기화
   - `em.clear()`

---

**1차 캐시와 2차 캐시**

1차 캐시는 기본적으로 영속성 컨텍스트 범위의 캐시이다.

그럼 2차 캐시는 뭐지?

애플리케이션에서 공유하는 캐시를 JPA는 공유 캐시(Shared Cache)라 하는데 이를 2차 캐시라고 한다.

> 애플리케이션을 종료할 때까지 캐시가 유지된다.

**참고 사이트**

- [JPA 캐시 by Gunju Ko](https://gunju-ko.github.io/jpa/2019/01/14/JPA-2%EC%B0%A8%EC%BA%90%EC%8B%9C.html)
- [JPA 캐시 by 사용자 소확행개발자](https://derekpark.tistory.com/96)

---

## 2. 영속성 컨텍스트와 JPQL의 특징

#### 쿼리 후 영속 상태인 것과 아닌 것

JPQL의 조회 대상은 엔티티, 임베디드 타입, 값 타입 같이 다양한 종류가 있음

JPQL는 조회한 엔티티만 영속성 컨텍스트에서 관리함 !

```sql
select m from Member m // 엔티티 조회
select o.address from Order o // 임베디드 타입 조회 (관리 X)
select m.id, m.username from Member m // 단순 필드 조회 (관리 X)
```

#### JPQL로 조회한 엔티티와 영속성 컨텍스트

JPQL의 특징

- JPQL은 항상 데이터베이스를 조회
- JPQL로 조회한 엔티티는 영속 상태
- 영속성 컨텍스트에 이미 존재하는 엔티티가 있으면 기존 엔티티를 사용 !
  - 영속성 컨텍스트는 영속 상태인 엔티티의 동일성을 보장하기 때문
    > JPQL 쿼리 실행 전 `flush()` 작업이라든지

**참고 사이트**

- [JPA 영속성 컨텍스트 주의점 by Yun on](https://cheese10yun.github.io/jpa-persistent-context/)

## 3. JPQL과 플러시 모드

`flush`는 영속성 컨텍스트의 변경 내역을 데이터베이스와 동기화하는 작업 !

보통 트랜잭션 커밋 이후 자동으로 flush가 호출되나 플러스 모드(FlushMode) 설정으로 커스텀 가능

```java:title=Java
em.setFlushMode(FlushModeType.AUTO) // 커밋 또는 쿼리 실행 시 플러시 (default)
em.setFlushMode(FlushModeType.COMMIT) // 커밋시에만 플러시
```

`FlushModeType.COMMIT`은 성능 최적화를 위해 필요한 옵션 !

#### 쿼리와 플러시 모드

`FlushModeType.COMMIT`를 사용할 때는 주의 해야함 !

잘못 사용하면 다음과 같은 상황이 발생할 수 있음

```java:title=Java
// 가격 1000 -> 2000 변경
product.setPrice(2000);

Product product2 =
   em.createQuery("select p from Product p where p.price = 2000", Product.class)
      .getSingleResult();
```

`AUTO` 상태라면 쿼리 실행전 플러시 하기 때문에 Product 2000의 가격이 DB에 반영되어 select 가능

`COMMIT` 상태라면 쿼리시에는 플러시하지 않으므로 DB에 반영이 안되서 위의 Product 엔티티는 조회 안됨

> 해결 방법 : 직접 em.flush() 호출 하거나 AUTO로 변경

#### 플러시 모드와 최적화

`FlushModeType.COMMIT` 모드는 잘못하면 데이터 무결성에 심각한 피해를 줄 수 있다.

`그럼에도 불구하고` 플러시가 너무 자주 일어나는 상황에서 이 모드를 사용하면 플러시 횟수를 줄여서 `성능을 최적화` 할 수 있다 !

**비즈니스 로직**

```java
등록()
쿼리() // 플러시
등록()
쿼리() // 플러시
등록()
쿼리() // 플러시
커밋() // 플러시
```

> 결국 앞의 수정 -> 조회 예제와 다를바 없이 무결성에 문제가 되는 예제지만 성능 최적화를 위해 감수하는 것 -?

## 참고

Tip) 하이버네이트 배치 쿼리 설정

- https://woowabros.github.io/experience/2020/09/23/hibernate-batch.html
