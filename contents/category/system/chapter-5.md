---
title: "[가상면접 사례로 배우는 대규모 시스템 설계기초] 처리율 제한 장치의 설계"
date: '2021-10-30'
category: 'system'
description: ''
emoji: '5️⃣'
---

# 처리율 제한 장치의 설계

> API 요청횟수가 특정 임계치를 넘어가면 추가로 도달한 요청은 처리를 중단하는 것
>

---

## 장점

1. DoS공격 방지
2. 비용절감
3. 서버 과부하 방지

---

# 처리율 제한 알고리즘

## 토큰 버킷
    
> 토큰을 발급하고 토큰의 갯수 만큼만 API 요청을 버킷에 담음
> 버킷이 가득 찬 경우 API요청은 버려짐(overflow)

![image](https://user-images.githubusercontent.com/55419159/138881073-2532be82-cc51-4872-a6be-f7e256b1a74e.png)

- 가장 간단하고 폭넓게 사용됨(아마존 등)
- 메모리 효율성 높음
- 버킷크기:토큰공급률 비율 튜닝이 관건

---  

## 누출 버킷
    
> 토큰 버킷 알고리즘과 유사하지만 처리율이 고정
> 큐(FIFO)로 구현

![image](https://user-images.githubusercontent.com/55419159/138881283-90475661-ca10-481f-a3fb-2e7e3cae0168.png)


- 동작방식
    
    1. 요청이 도착하면 큐가 가득 차 있는지 확인, 빈자리가 있는 경우 큐에 요청 추가
    2. 큐가 가득 차있는 경우 새 요청은 버림
    3. 지정된 시간마다 큐에서 요청을 꺼내어 처리
    
    - 토큰 버킷 알고리즘과 유사
    - 고정된 처리율을 가지고 있어 안정적 출력이 필요한 환경에 적합
    - 단시간에 많은 처리율이 들어올 경우 취약함

---

## 고정 윈도 카운터

- 동작방식
    
    1. 타임라인을 고정된 간격의 윈도로 나누고, 각 윈도마다 카운터를 붙임
    2. 요청이 접수될 때마다 이 카운터의 값은 1씩 증가함
    3. 이 카운터 값이 사전에 설정된 임계치에 도달하면 새로운 요청은 
    새 윈도가 열릴 때 까지 버려짐
    
![image](https://user-images.githubusercontent.com/55419159/138881425-aaf0ecc3-a73c-4007-9d36-3c9693f2062f.png)
 
- 메모리 효율 좋음
- 윈도 경계에서 일시적으로 많은 트래픽이 몰려드는 경우, 기대했던 시스템의 처리 한도보다 많은 양의 요청을 처리하게 됨

---

## 이동 윈도 로그
    
> 고정 윈도 카운터 알고리즘의 윈도 경계 부분에서 
> 트래픽이 몰리는 경우를 보완하기 위한 알고리즘

- 동작방식
    
    1. 요청의 타임스탬프를 추적함
    타임스탬프는 보통 Redis의 Sorted Set과 같은 정렬 집합 캐시에 보관
    2. 새 요청이 오면 만료된 타임스탬프는 제거
    3. 새 요청의 타임 스탬프를 로그에 추가
    4. 로그의 크기가 허용치보다 같거나 작으면 요청을 시스템에 전달함
    그렇지 않은 경우 처리는 거부됨
    
    - 윈도 알고리즘의 처리율 한도를 넘지 않음
    - 다량의 메모리 사용, 거부된 요청의 타임스탬프도 보관하기 때문

---

## 이동 윈도 카운터
    
> 고정 윈도 카운터 + 이동 윈도 로그 
    
- 이전 시간대의 평균 처리율에 따라 현재 윈도의 상태를 계산하므로 짧은 시간에 몰리는 트래픽에도 잘 대응
- 메모리 효율이 좋음
- 직전 시간의 추정치를 계산하기 때문에 기준이 느슨함, But 심각한 건 아님

---

# 프로세스

1. 처리율 제한 규칙은 디스크에 보관한다. 
작업 프로세스는 수시로 규칙을 디스크에서 읽어 캐시에 저장한다.
2. 클라이언트가 요청을 서버에 보내면 요청은 먼저 처리율 제한 미들웨어에 도달한다.
카운터 및 마지막 요청의 타임스탬프를 레디스 캐시에서 가져온다. 
    - 해당 요청이 처리율 제한에 걸리지 않은 경우 API서버로 보낸다.
    - 해당 요청이 처리율 제한에 걸렸다면 429(too many request) 에러를 클라이언트에 보낸다. 
    한편 해당 요청은 그대로 버릴 수도 있고 메시지 큐에 저장할 수도 있다.