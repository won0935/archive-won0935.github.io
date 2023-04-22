---
title: "[Spring] 인프런 스프링캠프 2023"
date: '2023-04-22'
category: 'spring'
description: ''
emoji: '🌿'
---


# 인프런 스프링캠프 2023

장소 및 시간 : 2023.04.22, 서울 중구 을지로 65 (SK텔레콤빌딩) 4층 수펙스홀

URL : [https://springcamp.ksug.org/2023/](https://springcamp.ksug.org/2023/)

# 요약

**`스프링 부트 3.0`**에 관한 내용이 **주**를 이룸

**Spring AOT**, **레거시 서비스 전환** 등 흥미로운 내용이 있었음

# 프로그램

## 1. 어느 #월급쟁이개발자 의 스프링 부트 따라잡기 Ver. 3 (김지헌)

### 스프링 부트 3.0 변경점 정리

- Java17 기반
- GraalVM 지원
- Jakarta EE 기반 (javax → jakarta)

### 자바 버전에 따른 핵심요약

- 10 : `var`
- 14 : `switch expression` case 에 mutiple하게 추가 가능
- 15 : `text block` ex> “”” \n 텍스트\ \n “””
- 16 : `record class` kotlin의 data class 랑 비슷, dto 용도
- 17 : `sealed class` 추상클래스 + enum 이라고 생각하면 편할 듯

### 그외

- TSID
    - UUID + Time sorted
    - 시계열 정렬 가능한 UUID라고 보면 됨, 인덱싱 간편, UUID 적용 시 고려해보길 추천

## 2. 12:55 - 13:25: 글로벌 서비스를 위한 Timezone/DST (김대겸)

### 요약

글로벌 서비스의 경우 **서머타임 적용**으로 인해 시간이 누락, 중복되는 경우가 생김

방지하기 위해 UTC나 `ZoneDateTime` 을 사용해야함

### 시간 기준

- UTC : 협정 세계시, 모든 지역에서 동일한 시각
- GMT : 태양위치 기준, 지역마다 시간이 다름

### java.time 라이브러리

`LocalDate`, `LocalTime`, `ZoneOffset`, `ZoneId` 4가지 항목을 조합하여 간편하게 시간표기 가능

- `LocalDate`
- `LocalDateTime` : `LocalDate` + `LocalTime`
- `OffsetDateTime` : `LocalDate` + `LocalTime` + `ZoneOffset`
- `ZoneDateTime` : `LocalDate` + `LocalTime` + `ZoneOffset` + `ZoneId`

## 3. 대규모 엔터프라이즈 시스템 개선 (중간) 경험기 - (김선철, 임형태)

### 내용

- 네이버 쇼핑의 레거시 시스템에서 차세대 시스템으로 변환하는 방법에 대한 설명
- 기존 프로젝트를 Refactor 대신 새로운 프로젝트로 Rewrite를 선택함
- 현재 프로젝트와 내용이 비슷해서 흥미롭게 들었음

### 가정

- A(레거시), B(차세대) 라고 가정함
- A와 B의 인프라(서버, DB 등)는 각각 별도로 존재한다고 가정함

### 개선방법

1. A에서 모든 트래픽 받음, A에 저장 할 때 B에 API 요청, 동일한 기능을 dual write 함
2. DB A를 B에  마이그레이션, 단 마이그레이션은 1회성이 아님, 여러번 마이그레이션 하는것을 고려
3. A에서는 Read 트래픽만 받음, Write는 B에서 함
4. B에서 Write 트래픽 받음, B에 저장할 때 A에 DB에 Event 요청, B는 A에 대해 종속이 없어야함
5. A에서 Read를 B로 이동

### 고려할 점

위 설계를 위해 아래 3가지를 고려했다고 함

- **Port & Adapter**
    - dual write 할 때 Adapter에만 수정하도록 관심사를 분리함
- **Domain Driven Architecture**
    - 소프트웨어 생명 주기 상 개발보다 유지보수 관점이 더 길기 때문에 지속가능한 개발이 중요
- **Event Driven Architecture**
    - 차세대 서비스는 레거시를 몰라야함, 이벤트만 발행

## 4. 실무에서 적용하는 테스트 코드 작성 방법과 노하우 (김남윤)

- Mock Test 에 관한 내용
- 기억나는 내용이 별로 없음, 승희님이 더 잘 알려주신 듯

## 5. 구현부터 테스트까지 - 대용량 트래픽 처리 시스템 (이경일)

### 요약

- 로컬에서 암만 돌려봐야 장애 안남, 그건 그냥 버그인 것임
- 진정한 장애는 트래픽을 맞았을 때 나타남
- 부하테스트를 해서 장애들을 예방하는 것이 중요

### 부하테스트를 하는 방법

- `Locust` 사용
    - 파이썬으로 코드작성이 쉬움
    - 로컬에서 기동 가능

## 6. Journey to Modern Spring (클라우드 시대를 맞이하는 스프링의 자세) (박용권)

### 요약

- Spring Boot 3.0이면 Spring AOT를 사용할 수 있음
- Spring AOT 를 사용하면  Spring native 실행 파일로 컴파일 하는데 사용되고 이후에 애플리케이션의 시작 시간과 메모리 사용량을 획기적으로 줄일 수 있음

### 견해

- 클라우드 환경에서 인프라 비용을 최대한 줄이기 위해 이러한 아키텍처가 나왔다고 함
- 배치나 데몬에 사용해 볼 수 있을 듯?

### Cloud Native 의 역사

- 2010 ~ 2011 : 이식성에 초점, 다른 환경에서도 돌아가는지
- 2011 : Micro Service 개념 등장
- 2012 : Netflix 등장, `Feign Client`, `Eureka` 등 클라우드 환경에 기여함
- 2013 ~ 2014 : `Srping IO`, 패키지 정리
- 2013 : 도커, `Reactor`(리액티브 프로그래밍, 향후 `webflux`의 엔진이 됨)
- 2014 : ServerLess 개념 등장
- 2015 : 구글에서 쿠버네티스 만듬
- 2016 : Reative Event Programing
- 2017 : `Spring MVC`(블로킹), `Spring Webflux`(논블로킹), `Spring Context Indexer`
- 2018 ~ 2021 : Java 실행환경 Container Wareness, `UseContainerSupport`
- 2018 : `SerialGC`, `G1GC`, 1791mb 이하이면 구린 `SerialGC` 사용, 체크해볼 것
- 2019 : `GraalVM`(JIT Compailer), AOT 개념 등장
- 2021 : `Spring Native Beta`, Native Excecutable
- 2022 ~ 2023 : `Srping Boot 3.0`, `Spring AOT` 출시
