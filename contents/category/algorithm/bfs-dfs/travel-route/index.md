---
title: '[프로그래머스] DFS & BFS - 여행 경로 / Python'
date: '2020-06-25'
category: 'algorithm'
description: ''
emoji: '✈️'
---

[[info | LEVEL 3 - '여행 경로' 문제 보러 가기 !]]
| https://programmers.co.kr/learn/courses/30/lessons/43163

## 문제 설명

주어진 항공권을 모두 이용하여 여행경로를 짜려고 합니다.  
항상 'ICN' 공항에서 출발합니다.

항공권 정보가 담긴 2차원 배열 tickets가 매개변수로 주어질 때, 방문하는 공항 경로를 배열에 담아 return 하도록 solution 함수를 작성해주세요.

#### 제한 사항

- 모든 공항은 알파벳 대문자 3글자로 이루어집니다.
- 주어진 공항 수는 3개 이상 10,000개 이하입니다.
- tickets의 각 행 [a, b]는 a 공항에서 b 공항으로 가는 항공권이 있다는 의미입니다.
- 주어진 항공권은 모두 사용해야 합니다.
- 만일 가능한 경로가 2개 이상일 경우 알파벳 순서가 앞서는 경로를 return 합니다.
- 모든 도시를 방문할 수 없는 경우는 주어지지 않습니다.

## 문제 접근 방식

`여행 경로` 문제를 처음 풀었을 때 예제는 맞았지만 제출시 1,2번 테스트에서 계속 실패했었습니다.

그래서 구글링을 통해 조사한 결과 1,2번 테스트 케이스는 다음과 같은 예제라고 의견이 나왔습니다.

```json
ticket
1. "ICN" -> "AAA"
2. "ICN" -> "BBB"
3. "BBB" -> "ICN"
```

위와 같은 예제일 경우 동작 과정을 살펴보면,

문제 조건에 맞는 선택은 알파벳 순서 이므로 1번을 바로 고를 수 있습니다.

```json
path
"ICN" -> "AAA"
```

하지만, 이 경우 티켓은 남아있지만 'AAA' 공항 이후 갈 수 있는 곳이 없습니다.

따라서, 위의 선택은 잘못되었으며 해당 티켓은 반환한 뒤 다른 경로('BBB')를 찾아야합니다.

2번 -> 3번 -> 1번

```json
path
"ICN" -> "BBB" -> "ICN" -> "AAA"
```

1. `{ 시작점 : [도착점], ... }` 형태의 `인접 리스트` 그래프를 생성합니다.

2. '도착점'의 리스트를 정렬합니다. (알파벳 순서로)

3. `DFS 알고리즘`을 사용해 모든 점을 순회합니다. (스택이 빌때까지)

   - 스택에서 가장 위 데이터(top)를 가져옵니다.
   - 가져온 데이터(top)가 그래프에 없거나, 티켓을 모두 사용한 경우, `path`에 저장
   - 아니라면, 가져온 데이터(top)을 시작점으로 하는 도착점 데이터 중 가장 앞 데이터(알파벳순으로 선택해야하므로)를 가져와 `stack`에 저장

4. path를 역순으로 출력 !

**위의 'stack', 'path' 출력 과정은 다음과 같습니다 !**

```python:title=Python
path []
stack ['ICN']

path []
stack ['ICN', 'AAA']

path ['AAA']
stack ['ICN']

path ['AAA']
stack ['ICN', 'BBB']

path ['AAA']
stack ['ICN', 'BBB', 'ICN']

path ['AAA', 'ICN']
stack ['ICN', 'BBB']

path ['AAA', 'ICN', 'BBB']
stack ['ICN']

path ['AAA', 'ICN', 'BBB', 'ICN']
stack []

# 역순 출력
path ['ICN', 'BBB', 'ICN', 'AAA']
```

## 풀이 코드

```python:title=Python
from collections import defaultdict
def solution(tickets):
    # 특정 티켓의 인접 리스트를 구하는 함수
    def init_graph():
        routes = defaultdict(list)
        for key, value in tickets:
            routes[key].append(value)
        return routes

    # 스택을 사용한 DFS
    def dfs():
        stack = ["ICN"]
        path = []  # 가려고하는 경로를 저장하는 변수
        while len(stack) > 0:  # stack이 비어있을 때까지
            top = stack[-1]
            # 특정 공항에서 출발하는 표가 없다면 또는 있지만 티켓을 다 써버린 경우
            if top not in routes or len(routes[top]) == 0:
                path.append(stack.pop())
            else:
                stack.append(routes[top].pop(0))
        return path[::-1]

    routes = init_graph()
    for r in routes:
        routes[r].sort()

    answer = dfs()
    return answer
```

#### DFS 재귀를 이용한 풀이

```python:title=Python
from collections import defaultdict
def solution(tickets):
    # 특정 티켓의 인접 리스트를 구하는 함수
    def init_graph():
        routes = defaultdict(list)
        for key, value in tickets:
            routes[key].append(value)
        return routes

    # 재귀 호출을 사용한 DFS
    def dfs(key, footprint):
        if len(footprint) == N + 1:
            return footprint

        for idx, country in enumerate(routes[key]):
            routes[key].pop(idx)

            fp = footprint[:] # deepcopy
            fp.append(country)

            ret = dfs(country, fp)
            if ret: return ret # 모든 티켓을 사용해 통과한 경우

            routes[key].insert(idx, country) # 통과 못했으면 티켓 반환

    routes = init_graph()
    for r in routes:
        routes[r].sort()

    N = len(tickets)
    answer = dfs("ICN", ["ICN"])

    return answer
```
