---
title: '[JPA 프로그래밍] 4. 엔티티 매핑'
date: '2020-10-22'
category: 'study'
description: ''
emoji: '⛳️'
---

## 개요

JPA가 지원하는 다양한 매핑 어노테이션의 종류 4가지

- 객체와 테이블 매핑 : @Entity, @Table
- 기본 키 매핑 : @Id
- 필드와 컬럼 매핑 : @Column
- 연관관계 매핑 : @ManyToOne, @JoinColumn

이번 4장에서 `학습할 내용`은 다음과 같습니다.

- 객체와 테이블 매핑
- 필드와 컬럼 매핑
- 데이터베이스 스키마 자동 생성 기능
- 기본 키 매핑 & 매핑 전략
  - SEQUENCE, IDENTITY, TABLE

연관 관계 매핑은 5장에서 !

## 1. @Entity

> JPA를 사용해서 테이블과 매핑할 클래스는 @Entity 어노테이션을 필수로 붙여야 함!  
> @Entity가 붙은 클래스는 JPA가 관리하는 것으로 `엔티티`라고 부름

#### @Entity 적용 시 주의사항

- 기본 생성자는 필수 (public or protected)

  - JPA는 엔티티를 생성할 때 기본 생성자를 사용하기 때문

- final 클래스, final 필드, enum, interface, inner 클래스에는 사용할 수 없음

_자바는 생성자가 하나도 없으면 기본 생성자를 자동으로 만들어주지만, 있으면 생성해주지 않음 !_

#### 추가) Lombok 사용 시 주의사항

`Lombok`의 `@Builder` 기능을 이용하려고 `@AllArgsConstructor`를 추가했을 때 에러

**에러**

```java:title=Java
@Entity
@AllArgsConstructor
@Builder
public class Entity {
    // 필드 매핑
}
```

`@NoArgsConstructor` 를 붙여줘야 정상 동작함

- 아래의 주의사항에 해당되는 이슈였음
  > 자바는 생성자가 하나도 없으면 기본 생성자를 자동으로 만들어주지만, 있으면 생성해주지 않는다.

**OK**

```java:title=Java
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entity {
    // 필드 매핑
}
```

## 2. @Table

@Table 은 엔티티와 매핑할 테이블을 지정함 (생략 가능)

```java:title=Java
@Entity
@Table(name="MEMBER")
public class Member {
    ...
}
```

## 3. 데이터 베이스 스키마 자동 생성

일반적으로 테이블 설계 이후 엔티티를 매핑하는 방식을 사용할 수도 있지만 `JPA`는 데이터베이스 스키마 자동 생성 기능을 제공해줌 !

- `JPA`는 클래스의 매핑 정보와 데이터베이스 방언을 사용해서 데이터베이스 스키마를 생성

> 데이터베이스 방언(Dialect) ?  
> SQL 표준을 따르지 않은 각 데이터베이스의 고유한 기능

다음과 같은 설정을하면 어플리케이션 실행 시점에 데이터베이스 테이블을 자동으로 생성

```xml:title=persistence.xml
<property name="hibernate.hbm2ddl.auto" value="create" />
```

콘솔에 실행되는 DDL을 출력한다.

```xml:title=persistence.xml
<property name="hibernate.show_sql" value="true" />
```

**Spring Boot에서 .yml 설정 파일**

```yml:title=application.yml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update # hbm2ddl의 바로가기
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL5InnoDBDialect # MySQL logging
```

참고 링크 : [스프링 JPA 프로퍼티](https://zetawiki.com/wiki/%EC%8A%A4%ED%94%84%EB%A7%81%EB%B6%80%ED%8A%B8_JPA_%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0)

#### 주의 사항

이러한 데이터베이스 스키마 자동 생성 기능은 개발자에게 테이블을 직접 생성하는 비용을 없애주지만, 자동 생성 기능이 만든 DDL은 `운영 환경`에서 사용할 만큼 완벽하지 않음

따라서, 개발 환경에서 사용하거나 참고하는 용도로 이용하고 `운영 환경`에서는 사용하지 말자 !

> 운영 시에는 개발자가 DB를 직접 설계하고 생성된 스키마에 엔티티를 매핑하자 !

## 4. DDL 생성 기능

아래 처럼 제약 조건을 추가할 수도 있음

```java:title=Java
@Entity
@Table(name="MEMBER")
public class Member {

    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "NAME", nullable = false, length = 10) //추가
    private String username;

    // ...
}
```

- `nullable = false` : not null 제약 조건 추가
- `length = 10` : 크기를 지정

```sql
create table MEMBER (
    ...
    ID varchar(255) not null,
    NAME varchar(10) not null,
    ...
    primary key (ID)
)
```

이러한 `DDL 생성 기능`은 단지 DDL을 자동으로 생성할 때만 사용되고, JPA 실행 로직에는 영향을 주지 않는다.

## 5. 기본 키 매핑

```java:title=Java
@Entity
public class Member {

    @Id
    @Column(name = "ID")
    private String id;
}
```

앞의 예제들은 @Id 어노테이션을 이용해서 회원의 기본키를 직접 할당하는 방식으로 진행되었음

그렇다면, 직접 할당이 아닌 데이터 베이스에서 자동으로 생성된 키 값을 사용하려면 어떻게 매핑해야 할까?

> MySQL의 AUTO_INCREMENT 같은 기능  
> Oracle의 시퀀스 오브젝트

#### 기본 키 생성 전략 종류

데이터 베이스마다 기본 키를 자동으로 생성하는 방식이 서로 다르므로 JPA는 다음과 같은 `기본 키 생성 전략`을 제공함

- 직접 할당 : 기본 키를 어플리케이션에서 직접 할당
- 자동 생성 : 대리 키 사용 방식
  - `IDENTITY` : 기본 키 생성을 데이터베이스에 위임
  - `SEQUENCE` : 데이터베이스 시퀀스를 사용해 기본 키 할당
  - `TABLE` : 키 생성을 위한 테이블을 사용

**기본키 생성 방법**

- 기본 키를 직접 할당 : @Id만 사용
- 자동 생성 전략 사용 : @GeneratedValue 추가 및 키 생성 전략 선택.

**키 생성 전략 사용을 위한 속성 추가**

```xml
<property name="hibernate.id.new_generator_mappings" value="true" />
```

**Spring Boot 에서 설정은 ?**

위의 설정이 Spring Boot 2.0 버전부터 기본 값으로 `true`로 설정되어 동작함

[참고 링크](https://www.popit.kr/%EC%8A%A4%ED%94%84%EB%A7%81-%EB%B6%80%ED%8A%B8-2-0-jpa-auto-configuration%EC%9D%98-%EB%B3%80%ED%99%94/)

#### 1. 기본 키 직접 할당 전략

```java:title=Java
// 기본 키 직접 할당
@Id
@Column(name = "id")
private String id;
```

**기본 키 할당하는 방법**

```java:title=Java
Board board = new Board();
board.setId("id1"); //기본 키 직접 할당
em.persist(board);
```

#### 2. IDENTITY 전략

IDENTITY는 기본 키 생성을 데이터 베이스에 위임하는 전략

- 주로 `MySQL`, `PostgreSQL`, `SQL Server`, `DB2`, `H2`에서 사용.

**MySQL의 AUTO_INCREMENT 기능 예시**

```sql
CREATE TABLE BOARD {
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    DATA VARCHAR(255)
};

// 이후 ID 컬럼 비운 채로 저장 시 ID 자동으로 채워줌
INSERT INTO BOARD(DATA) VALUES('A');
INSERT INTO BOARD(DATA) VALUES('B');
```

**매핑 코드**

```java:title=Java
@Entity
public class Board {
    @Id
    @GenerateValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ...
}
```

**IDENTITY 전략 핵심**

- 데이터베이스에 값을 저장하고 나서야 기본 키 값을 구할 수 있을 때 사용

  - 하이버네이트는 `Statement.getGeneratedKeys()` 를 사용해 저장하면서 동시에 기본 키를 가져옴 (원래는 DB와의 통신이 2번이지만 1번에 가능)
  - 가져온 기본 키를 엔티티의 식별자에 할당해 영속 상태로 변경

- `em.persist()` 호출시 INSERT SQL을 즉시 데이터베이스에 전달
  - 띠라서, `쓰기 지연`이 동작하지 않는다.

#### 3. SEQUENCE 전략

유일한 값을 순서대로 생성하는 특별한 데이터베이스 오브젝트

- 주로 `오라클`, `PostgreSQL`, `DB2`, `H2` 데이터베이스에서 사용.

**시퀀스 생성 예시**

```sql
CREATE TABLE BOARD (
    ID BIGINT NOT NULL PRIMARY KEY,
    DATA VARCHAR(255)
)

// 시퀀스 생성
CREATE SEQUENCE BOARD_SEQ START WITH 1 INCREMENT BY 1;
```

**매핑 코드**

```java:title=Java
@Entity
@SequenceGenerator(
    name = "BOARD_SEQ_GENERATOR",
    sequenceName = "BOARD_SEQ",
    initialValue = 1,
    allocationSize = 1)
public class Board {

    @Id
    @GeneraedValue(strategy = GenerationType.SEQUENCE,
                    generator = "BOARD_SEQ_GENERATOR")
    private Long id;
}
```

**SEQUENCE 동작 과정**

1. 먼저 데이터베이스 시퀀스를 사용해서 식별자를 조회
2. 조회한 식별자를 엔티티에 할당한 후 엔티티를 영속성 컨텍스트에 저장 (영속 상태)
3. 이상이 없으면 트랜잭션 커밋 -> 플러시
   - 데이터베이스에 저장됨

IDENTITY와의 가장 큰 차이점은 SEQUENCE는 먼저 엔티티를 조회한 이후 엔티티에 식별자를 할당함 (DB 콜 2번)

---

**SEQUENCE 전략과 최적화**

JPA는 시퀀스에 접근하는 횟수를 줄이기 위해 `@SequenceGenerator.allocationSize` 를 사용함

예를 들어, allocationSize 값이 50이면 시퀀스를 한 번에 50 증가 시킨 다음에 1~50까지는 메모리에서 식별자를 할당한다.

이 최적화 방법은 시퀀스 값을 선점하므로 여러 JVM이 동시에 동작해도 기본 키 값이 충돌하지 않는 장점이 있음 !!

#### 4. TABLE 전략

TABLE 전략은 키 생성 전용 테이블을 하나 만들고 여기에 이름과 값을 사용할 컬럼을 만들어 데이터베이스 시퀀스를 흉내내는 전략 !

테이블을 사용하므로 모든 데이터베이스에 적용 할 수 있다.

**TABLE 전략을 위한 키 테이블 생성**

```sql
create table MY_SEQUENCES (
    sequence_name varchar(255) not null,
    next_val bigint,
    primary key (sequence_name)
)
```

**매핑 코드**

```java:title=Java
@Entity
@TableGenerator(
    name = "BOARD_SEQ_GENERATOR",
    table = "MY_SEQUENCES",
    pkColumnValue = "BOARD_SEQ", allocationSize = 1)
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.TABLE,
                generator = "BOARD_SEQ_GENERATOR")
    private Long id;
}
```

시퀀스 대신에 테이블을 사용한다는 것만 제외하면 SEQUENCE 전략과 동일 !
단, 식별자 값을 조회할 때 Select 쿼리 1번, 다음 값으로 증가시키기 위해 Update 쿼리 1번 사용하기 때문에 `SEQUENCE 전략보다 1번 더 통신`하는 단점이 있음

#### 5. AUTO 전략

GenerationType.AUTO는 선택한 데이터베이스 방언에 따라 INDENTITY, SEQUENCE, TABLE 전략 중 하나를 자동으로 선택해줌

AUTO의 장점은 2가지가 있음

- 데이터 베이스가 변경되어도 코드에는 변화가 전혀 없다는 장점
- 키 생성 전략이 확정되지 않은 개발 초기 단계, 프로토타입 개발시 편리하다는 장점

#### 6. 테이블의 기본 키 선택 전략

- 자연 키
  - 비지니스에 의미가 있는 키
  - 주민등록번호, 이메일, 전화번호
- 대리 키
  - 비지니스와 관련 없는 임의로 만들어진 키, 대체 키.
  - 오라클 시퀀스, auto_increment, 키생성 테이블

미래까지 충족하는 자연 키를 찾기 쉽지 않으니 JPA는 모든 엔티티에 일관된 방식으로 대리 키 사용을 권장 !

## Q&A

**데이터 중심 설계와 객체 지향 설계의 차이?**

객체 지향 설계는 맡은 역할과 책임이 있고 관련 객체를 `참조로 접근` 할 수 있도록 설계하는 것

- `@OneToMany`, `@ManyToOne` 등을 사용한 설계는 객체 지향으로 설계되었다고 볼 수 있을 듯

데이터 중심 설계는 데이터베이스의 `테이블의 관점`에서 설계된 것

- `외래키`를 기준으로 조인해서 관련 테이블의 정보를 가져오는 설계는 데이터 중심 설계
