---
title: '[프로그래머스] [1차] 2018 카카오 - 캐시 / Python'
date: '2020-05-30'
category: 'algorithm'
description: ''
emoji: '📚'
---

[[info | LEVEL 2 - '캐시' 문제 보러 가기 !]]
| https://programmers.co.kr/learn/courses/30/lessons/17680

## 프로그래머스 캐시 문제를 풀기 전에 !

LRU 페이지 교체 알고리즘을 우선적으로 이해해야 합니다.

#### LRU(Least Recently Used) 페이지 교체 알고리즘이란?

캐시가 사용하는 `리소스의 양은 제한`되어 있으니, 캐시는 제한된 리소스 내에서 데이터를 `빠르게 데이터를 가져오기 위한 알고리즘`입니다.

#### LRU 알고리즘은 어떤 방식 ?

`LRU 알고리즘`은 메모리 상에서 가장 최근에 사용된 적이 없는 캐시의 메모리부터 대체하며 새로운 데이터로 갱신합니다.

> 즉, '자주 불린 데이터가 미래에도 더 자주 불릴 것'이라는 개념에서 나온 알고리즘

#### LRU 알고리즘의 동작 과정

1. 만약 현재 가져오고 싶은 데이터가 캐시에 존재하면 캐시에서 데이터를 가져온 후 다시 캐시 큐의 가장 뒷 부분에 데이터 삽입

2. 만약 데이터가 캐시에 존재하지 않으면 저장소에서 데이터를 가져온 후 가져온 데이터를 캐시에 삽입

3. 캐시가 꽉 차있다면 사용이 가장 적었던 큐의 가장 앞부분을 제거하고 가져오려는 데이터를 캐시 큐의 가장 뒷 부분에 데이터 삽입

## 문제 접근 방식

프로그래머스의 `캐시` 알고리즘 문제 또한 위의 `LRU 알고리즘`을 적용하면 쉽게 풀 수 있습니다.

- 단, 소문자, 대문자를 구분하지 않으므로 받은 문자열은 전부 소문자로 바꾸어 문제를 풀어야합니다.

## 풀이 코드

```python:title=Python
import collections
def solution(cacheSize, cities):
    answer = 0
    caches = collections.deque()

    for city in cities:
        city = city.lower()
        # cache hit
        if city in caches:
            caches.remove(city)
            caches.append(city)
            answer += 1
        # cache miss
        else:
            if cacheSize == 0:
                return 5 * len(cities)
            # 최근 사용하지 않은 캐시 업데이트
            if len(caches) == cacheSize:
                caches.popleft()
            caches.append(city)
            answer += 5
    return answer
```
