---
title: "[모니터링] Kafka 란"
date: '2021-11-28'
category: 'monitoring'
description: ''
emoji: '📨'
---


## ⛳ 들어가기 전에..

회사에서 `EFK(ElasticSearch-Fluentd-Kafka)` 스택으로 **로깅 시스템**을 구축해야 한다.
따라서 각 기술에 대해 공부해보았다.


## 📩 Kafka 란

아파치에서 제공하는 **pub-sub** 기반의 **분산형 메시지 큐**이다.
dispatch가 아닌, **subscribe 방식**으로 기존 `RabbitMQ`에 비해 성능이 좋다.
(단, RabbitMQ에서 제공하는 전체 트랜잭션은 제공되지 않음)


## 🧱 Kafka 기본용어

![image](https://user-images.githubusercontent.com/55419159/143737608-fd87cbb9-3ae8-4dc0-81be-ed64de1cf889.png)

### 1. `broker` (브로커)

`브로커`는 실제로 **메시지를 저장**하는 카프카의 각 노드이다.

#### 역할 & 특징
- `pub`으로 인해 들어온 **데이터 저장** (disk 기반)
- `leader`, `follower` 개념 존재


### 2. `zookeeper` (주키퍼)

주키퍼는 아파치에서 제공하는 코디네이션 분산 플랫폼이다.

#### 역할 & 특징
- broker health check
- `leader` 선출
- `znode`(파일 시스템의 폴더 구조)라는 곳에 `broker`의 meta 정보 관리

zookeeper 클러스터는 **앙상블**이라 부르며, 앙상블은 데이터 write시 과반수가 넘으면 성공으로 간주하게 된다.
즉, 앙상블은 **2N+1인 홀수**로 구성이 필요하다.

### 3. `topic` (토픽)

토픽은 **큐들의 집합**이다.

큐들의 집합이라는 용어를 사용한 이유는 토픽은 **한개 이상의 파티션**이 있어야 하고, **파티션이 한개의 큐**이기 때문이다.

#### 역할 & 특징
- 클러스터 내 토픽명 고유
- 큐 집합을 논리적 단위로 구분
- 메시지 저장기간, 메시지 복제수 등의 설정을 토픽단위 제공 ([Kafka 공식문서- Topic](https://kafka.apache.org/23/documentation.html#topicconfigs))


### 4. `partition` (파티션)

파티션은 토픽을 이루는 큐이다.

각 파티션에는 `leader`, `follower`, `isr` 존재합니다.


각 용어의 의미는 아래와 같다.

- `leader`는 메시지를 `write`, `read`하는 역할을 수행하며, 토픽의 replication 갯수만큼 `follower`에게 복제를 명령한다.
- `follower`는 `leader`의 요청을 받아 메시지를 복제하는 역할.
- `isr`는 replication group을 의미하며, leader & follwer 선출 시 이 isr 내에서 선출하게 된다.

![image](https://user-images.githubusercontent.com/55419159/143746108-38d945e4-9723-446a-a07c-6a42ea37feba.png)


위 사진을 보면 0번 파티션의 정보로는,
`leader`는 2번 `broker`, `isr(in sync replicas)`는 현재 2번, 3번으로 되어 있는것을 볼 수 있다.



### 5. `producer` (프로듀서)

프로듀서는 카프카에서 **메시지를 발행(pub)하는 주체**를 의미한다.

#### 역할 & 특징

- 메시지 발행 시 직렬화를 제공한다.(string, json, avro 등)
- partition에 특정 데이터만을 발행하기 위해 메시지의 key를 지정할 수 있다.
- 메시지 발행 후 broker로 부터 ack를 받을 수 있다. ([Kafka 공식문서- Producer](https://kafka.apache.org/23/documentation.html#producerapi))


### 6. `consumer` (컨슈머)

컨슈머는 메시지를 **subscribe하는 주체**이다.

#### 역할 & 특징

- `commit`이라는 행위로 어느 offset까지 subscribe했는지 주키퍼에게 알림.
- 컨슈머는 살아있다면 zookeeper에게 heart beat를 전송.
- `poll`이라는 행위로 메시지를 subscribe하며, 이때 시간과 최대 개수 등을 설정 가능 ([Kafka 공식문서- Consumer](https://kafka.apache.org/23/documentation.html#consumerconfigs)) 

여기서 offset은 각 파티션에 메시지가 유입된 순서를 의미한다.

### 7. `consumer group` (컨슈머 그룹)

컨슈머 그룹은 **컨슈머들의 논리적인 그룹**을 의미한다.

#### 역할 & 특징

- 토픽별 컨슈머 그룹 단위로 **offset**과 **lag**를 관리.
- 컨슈머는 컨슈머그룹을 필수로 가져야 함.
- 토픽의 파티션 갯수만큼 컨슈머들이 동일 컨슈머 그룹에 존재하는것이 Best!!
- 한 파티션은 하나의 컨슈머만 점유 가능하기 때문.
- 파티션을 점유중인 컨슈머가 down 되었을 시 컨슈머 그룹내 리밸런싱 동작.
- down된 컨슈머가 점유한 파티션을 다른 컨슈머에게 위임하는 작업.


여기서, lag는 한 토픽의 (총 메시지 갯수 - 컨슈머 그룹이 subscribe한 메시지 갯수) 이다.
간단히, 한 토픽에서 한 컨슈머 그룹이 소비해야하는 총 메시지 개수이다.