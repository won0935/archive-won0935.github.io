---
title: '[프로그래머스] DFS & BFS - 네트워크 / Python, Java'
date: '2020-06-18'
category: 'algorithm'
description: ''
emoji: '🌏'
---

[[info | LEVEL 3 - '네트워크' 문제 보러 가기 !]]
| https://programmers.co.kr/learn/courses/30/lessons/43162

## 문제 설명

네트워크란 컴퓨터 상호 간에 정보를 교환할 수 있도록 연결된 형태를 의미합니다.  
예를 들어, 컴퓨터 A와 컴퓨터 B가 직접적으로 연결되어있고, 컴퓨터 B와 컴퓨터 C가 직접적으로 연결되어 있을 때 컴퓨터 A와 컴퓨터 C도 간접적으로 연결되어 정보를 교환할 수 있습니다.  
따라서 컴퓨터 A, B, C는 모두 같은 네트워크 상에 있다고 할 수 있습니다.

컴퓨터의 개수 `n`, 연결에 대한 정보가 담긴 2차원 배열 `computers`가 매개변수로 주어질 때, 네트워크의 개수를 return 하도록 solution 함수를 작성하시오.

## 문제 접근 방식

문제를 보면 `DFS / BFS`로 분류 되어 있지만, 해당 문제는 `Union-Find` 알고리즘을 적용하면 더 쉽게 풀 수 있다고 생각해서 `Union-Find` 알고리즘을 적용하여 풀었습니다.

1. 같은 네트워크임을 파악하기 위해 `i`번째 노드가 누구를 부모로 가리키는지 저장할 `parent` 배열과 `Union-Find` 함수들을 작성합니다.

   > `Union-Find` 함수란 ?
   >
   > [1] 특정 노드의 부모를 반환하는 함수  
   > [2] 두 개의 노드를 연결하는 함수

2. `computers` 배열을 돌면서 각 노드를 `union_parent` 함수로 같은 네트워크로 연결해줍니다.

3. 마지막으로, `parent` 배열을 돌면서 네트워크 개수를 파악한 뒤 return 합니다.

#### 주의할 점

다음과 같이 `parent`에서 바로 네트워크 개수를 파악하려고 하면 `9번 테스트 케이스`가 틀리게 되니 주의하세요.

```python:title=Python
import collections
answer = collections.Counter(parent) # 1

answer = list(set(parent)) # 2
```

#### 접근이 비슷한 문제

프로그래머스의 `네트워크` 문제는 `섬 연결하기`와 접근이 특정 부분 유사한 문제이니 참고해주세요 !

> [[프로그래머스] 섬 연결하기 문제 보기](/category/algorithm/greedy/island-connection)

## 풀이 코드

#### Python

```python:title=Python
def solution(n, computers):

    # [1] 특정 노드의 부모를 반환하는 함수
    def get_parent(parent, x):
        if parent[x] == x: return x
        parent[x] = get_parent(parent, parent[x])
        return parent[x]

    # [2] 두 개의 노드를 연결하는 함수
    def union_parent(parent, x, y):
        a = get_parent(parent, x)
        b = get_parent(parent, y)

        if a > b: parent[a] = b
        else: parent[b] = a

    parent = []
    for i in range(n):
        parent.append(i)

    # 노드를 연결하는 작업
    for i in range(n):
        for j in range(n):
            if i != j and computers[i][j] == 1:
                union_parent(parent, i, j)

    # ** 주의 **
    # 최종적으로 get_parent를 다시 해주면서 네트워크 개수 파악
    answer = set()
    for i in range(n):
        parent[i] = get_parent(parent, i);
        answer.add(parent[i]);

    return len(answer)
```

#### Java

```java:title=Java
import java.util.*;
import java.util.stream.*;
class Solution {
    public int solution(int n, int[][] computers) {
        int[] parent = IntStream.range(0, n).toArray(); // IntStream to Array !

        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if (i!=j && computers[i][j]==1) union_find(parent, i, j);
            }
        }
        
        // Set 자료구조
        Set<Integer> answer = new HashSet();
        for(int node : parent) {
            int x = get_parent(parent, node);
            answer.add(x);
        }
        return answer.size();
    }
    
    // [1] 특정 노드의 부모를 반환하는 함수
    public int get_parent(int[] parent, int n){
        if (parent[n] == n) return n;
        parent[n] = get_parent(parent, parent[n]);
        return parent[n];
    }
    
    // [2] 두 개의 노드를 연결하는 함수
    public void union_find(int[] parent, int a, int b){
        a = get_parent(parent, a);
        b = get_parent(parent, b);
        if (a > b) parent[a] = b;
        else parent[b] = a;
    }
}
```