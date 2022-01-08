---
title: '[JPA 프로그래밍] 5. 연관 관계 매핑'
date: '2020-10-27'
category: 'study'
description: ''
emoji: '🤼‍♂️'
---

## 개요

5장의 핵심 키워드 !

방향 : [단뱡향, 양방향]

- 단방향 : [회원 -> 팀] or [팀 -> 회원]
- 양방향: [회원 -> 팀] and [팀 -> 회원]

다중성 : [다대일(N:1), 일대다(1:N), 일대일(1:1), 다대다(N:N)]

연관관계 주인 : 객체를 양방향 연관관계로 만들면 연관관계의 주인을 정해야 한다.

## 1. 단방향 연관 관계

**객체 관계 매핑**

```java:title=Java
@Entity
@Getter
@Setter
public class Member {

    @Id
    @Column(name = "MEMBER_ID")
    private Long id;

    private String username;

    //연관 관계 매핑
    @ManyToOne
    @JoinColumn(name="TEAM_ID")
    private Team team;

    //연관관계 설정
    public void setTeam(Team team) {
        this.team = team;
    }
}
```

- @ManyToOne

  - 다대일(N:1) 관계라는 매핑 정보
  - 어노테이션 필수

- @JoinColumn(name="TEAM_ID")
  - 조인컬럼은 외래 키를 매핑할 때 사용
  - name 속성에 매핑할 외래 키 이름을 지정
  - 생략 가능하다.

## 2. 연관 관계 사용

> 연관 관계를 등록, 수정, 삭제할 수 있다.

#### 1. 저장

```java:title=Java
public void testSave() {

    //팀1 저장
    Team team1 = new Team("team1", "팀1");
    em.persist(team1);

    //회원1 저장
    Member member1 = new Member(1L, "회원1");
    member1.setTeam(team1);     //연관관계 설정 member1 -> team1
    em.persist(member1);

    //회원2 저장
    Member member2 = new Member(2L, "회원2");
    member2.setTeam(team1);     //연관관계 설정 member2 -> team1
    em.persist(member2);
}
```

> JPA에서 엔티티를 저장할 때 연관된 모든 엔티티는 영속 상태여야 한다. (영속성 컨텍스트가 관리하는 객체 상태)

**저장 결과**

| MEMBER_ID | NAME  | TEAM_ID | TEAM_NAME |
| :-------- | :---- | :------ | :-------- |
| 1         | 회원1 | team1   | 팀1       |
| 2         | 회원2 | team2   | 팀1       |

#### 2. 조회

엔티티를 조회하는 방법은 2가지

- 객체 그래프 탐색(객체 연관관계를 사용한 조회)
- 객체지향 쿼리 사용(JPQL)

---

1. 객체 그래프 탐색

   ```java:title=Java
   Member member = em.find(Member.class, 100L);
   Team team = member.getTeam();   //객체 그래프 탐색
   System.out.println("팀 이름 = " + team.getName());
   ```

2. 객체 지향 쿼리

   ```java:title=Java
   public static void testJPQL(EntityManager em) {
       String jpql1 = "select m from Member m join m.team t where " +
               "t.name = :teamName";

       List<Member> resultList = em.createQuery(jpql1, Member.class)
               .setParameter("teamName", "팀1")
               .getResultList();

       for (Member member : resultList) {
           System.out.println("[query] member.username = " +
                   member.getUsername());
       }
   }
   ```

#### 3. 수정

**연관관계를 수정하는 코드**

```java:title=Java
private static void updateRelation(EntityManager em) {

    // 새로운 팀2
    Team team2 = new Team("team2", "팀2");
    em.persist(team2);

    //회원1에 새로운 팀2 설정
    Member member = em.find(Member.class, 100L);
    member.setTeam(team2);
}
```

수정은 em.update() 같은 메소드가 없다.

#### 4. 제거

**연관관계를 삭제하는 코드**

```java:title=Java
private static void deleteRelation(EntityManager em) {

    Member member1 = em.find(Member.class, "member1");
    member1.setTeam(null);      //연관관계 제거
}
```

**실제 SQL**

```sql
UPDATE MEMBER
SET
    TEAM_ID = null, ...
WHERE
    ID = 'member1'
```

#### 5. 연관된 엔티티를 삭제

> 연관된 엔티티를 삭제하려면 먼저 연관관계를 제거하고 삭제해야 한다.  
> 외래 키 제약조건으로 데이터베이스 오류 발생.

```java:title=Java
member1.setTeam(null);  // 회원1 연관관계 제거
member2.setTeam(null);  // 회원2 연관관계 제거
em.remove(team);        // 팀 삭제
```

## 3. 양방향 연관관계

> 팀에서 회원으로 접근하는 관계.  
> 회원에서 팀으로 접근 가능하고, 팀에서 회원 접근 가능한 양방향.

#### 1. 양방향 연관관계 매핑

**회원 엔티티**

> 변경되는 부분 없음

**매핑한 팀 엔티티**

```java:title=Java
@Entity
@Getter
@Setter
public class Team {

    @Id
    @Column(name = "TEAM_ID")
    private String id;

    private String name;

    //추가
    @OneToMany(mappedBy = "team")
    private List<Member> members = new ArrayList<Member>();
}
```

일대다 관계는 컬렉션인 List<Member> members를 추가

- mappedBy 속성은 양방향 매핑일 때 사용
- 반대쪽 매핑의 필드 이름을 값으로 주면 됨
- 반대쪽 매핑이 `Member.team`이므로 `team`을 값으로 줌

#### 2. 일대다 컬렉션 조회

```java:title=Java
public void biDirection() {

    Team team = em.find(Team.class, "team1");
    List<Member> members = team.getMembers();   // 팀 -> 회원, 객체그래프 탐색

    for (Member member : members) {
        System.out.println("member.username = " +
                member.getUsername());
    }
}

//결과
//member.username = 회원1
//member.username = 회원2
}
```

## 4. 연관관계의 주인

> 두 객체 연관관계 중 하나를 정해서 테이블의 외래키를 관리해야 하는데 이것을 연관관계의 주인이라고 함

#### 1. 양방향 매핑 규칙 : 연관관계의 주인

- 연관관계의 주인만이 데이타베이스 연관관계와 매핑된다.
- 연관관계의 주인만이 외래키를 관리(등록, 수정, 삭제)할 수 있다.
- 주인이 아닌 쪽은 읽기만 할 수 있다.

> 연관관계의 주인을 정한다는 것 = 외래 키 관리자를 선택하는 것

**mappedBy 속성**

- 주인이 아니면 mappedBy 속성을 사용해서 속성의 값으로 연관관계의 주인을 지정
- 주인은 mappedBy 속성을 사용하지 않는다.

#### 2. 연관관계의 주인은 외래 키가 있는 곳

- 연관관계의 주인은 테이블에 외래 키가 있는 곳으로 정해야 한다.
- Team 엔티티는 mappedBy를 통해 주인이 아님을 설정.

```java:title=Java
class Team {
    @OneToMany(mappedBy = "team")  // 연관관계 주인인 Member.team
    private List<Member> members = new ArrayList<Member>();
}
```

**중요**

- 연관관계의 주인만 데이터베이스 연관관계와 매핑, 외래 키를 관리
- 주인이 아닌 반대편은 읽기만 가능, 외래 키를 변경하지 못한다.
- 항상 '다(N)'쪽이 외래 키를 가진다.
- @ManyToOne은 항상 연관관계의 주인이 됨. mappedBy 속성이 없다.

## 5. 양방향 연관관계 저장

```java:title=Java
public void testSave() {

    //팀1 저장
    Team team1 = new Team("team1", "팀1");
    em.persist(team1);

    //회원1 저장
    Member member1 = new Member("member1", "회원1");
    member1.setTeam(team1);     //연관관계 설정 member1 -> team1
    em.persist(member1);

    //회원2 저장
    Member member2 = new Member("member2", "회원2");
    member2.setTeam(team1);     //연관관계 설정 member2 -> team1
    em.persist(member2);
}
```

사실 '단방향 연관관계'에서 살펴본 코드와 완전히 동일

**주인이 아닌 곳의 입력된 값은 외래키에 영향을 주지 않음.**

```java:title=Java
team1.getMembers().add(member1);        //무시
team1.getMembers().add(member2);        //무시

member1.setTeam(team1);                 //연관관계 설정(연관관계의 주인)
member2.setTeam(team1);                 //연관관계 설정(연관관계의 주인)
```

Member.team은 연관관계의 주인, 엔티티 매니저는 이곳에 입력된 값으로 외래 키 관리

## 6. 양방향 연관관계 주의점

**주인이 아닌 곳에만 값을 입력하는 경우**

```java:title=Java
public void testSaveNonOwner() {

    //회원1 저장
    Member member1 = new Member("member1", "회원1");
    em.persist(member1);

    //회원2 저장
    Member member2 = new Member("member2", "회원2");
    em.persist(member2);

    Team team1 = new Team("team1", "팀1");

    //주인이 아닌 곳에 연관관계 설정
    team1.getMembers().add(member1);
    team2.getMembers().add(member2);

    em.persist(team1);
}
```

**조회 결과**

| MEMBER_ID | USERNAME | TEAM_ID |
| :-------- | :------- | :------ |
| member1   | 회원1    | null    |
| member2   | 회원2    | null    |

> 연관관계의 주인만이 외래 키의 값을 변경할 수 있다.
