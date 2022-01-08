---
title: '[프로그래머스] 해시 - 위장 / Python'
date: '2020-07-12'
category: 'algorithm'
description: ''
emoji: '🌫'
---

[[info | LEVEL 2 - '위장' 문제 보러 가기 !]]
| https://programmers.co.kr/learn/courses/30/lessons/42578

## 문제 설명

스파이들은 매일 다른 옷을 조합하여 입어 자신을 위장합니다.  
예를 들어 스파이가 가진 옷이 아래와 같고 오늘 스파이가 동그란 안경, 긴 코트, 파란색 티셔츠를 입었다면 다음날은 청바지를 추가로 입거나 동그란 안경 대신 검정 선글라스를 착용하거나 해야 합니다.

| 종류 | 이름                       |
| :--- | :------------------------- |
| 얼굴 | 동그란 안경, 검정 선글라스 |
| 상의 | 파란색 티셔츠              |
| 하의 | 청바지                     |
| 겉옷 | 긴 코트                    |

스파이가 가진 의상들이 담긴 2차원 배열 clothes가 주어질 때 서로 다른 옷의 조합의 수를 return 하도록 solution 함수를 작성해주세요.

#### 제한 사항

- clothes의 각 행은 [의상의 이름, 의상의 종류]로 이루어져 있습니다.
- 스파이가 가진 의상의 수는 1개 이상 30개 이하입니다.
- 같은 이름을 가진 의상은 존재하지 않습니다.
- clothes의 모든 원소는 문자열로 이루어져 있습니다.
- 모든 문자열의 길이는 1 이상 20 이하인 자연수이고 알파벳 소문자 또는 '\_' 로만 이루어져 있습니다.
- 스파이는 하루에 최소 한 개의 의상은 입습니다.

## 문제 접근 방식

프로그래머스 `위장` 문제의 핵심은 `서로 다른 옷의 조합의 수`를 구하면서, 다음과 같은 예외를 생각해야합니다.

- 각 종류를 기준으로 선택을 안할 수도 있다. (종류가 한 종류일 때 제외)
- 선택을 안할 수도 있지만, 제한 사항에 나와있듯이 모두 선택 안하는 경우는 제외한다.
  - 최소 한 개의 의상을 입어야 하므로 !

---

위와 같은 예외 상황을 생각하고 문제를 접근해보면 다음과 같이 접근할 수 있습니다.

1. 해시 자료구조로 같은 의상을 묶는다.
2. 각 의상 종류의 개수를 구하고 경우의 수를 구한다.

## 풀이 코드

```python:title=Python
from collections import defaultdict
def solution(clothes):
    # 1. 해시로 같은 의상을 묶는다.
    _hash = defaultdict(list)
    for cloth in clothes:
        _hash[cloth[1]].append(cloth[0])

    answer = 1
    # 2. 각 의상 종류의 개수를 구하고 경우의 수를 구한다.
    for key in _hash:
        leng = len(_hash[key]) # 종류의 개수
        answer *= leng + 1 # 안뽑는 경우 - 1가지 추가
    return answer - 1 # 모두 안뽑는 경우 - 1가지 제거
```

## 마무리

해시로 각 의상을 묶는 방법도 존재하지만, `Pythonic` 하게 `Counter` 모듈을 사용하여 종류를 구할 수 있습니다.  
입력값 `clothes`가 다음과 같을 때

```python:title=Python
# clothes
[
 ["yellow_hat", "headgear"],
 ["blue_sunglasses", "eyewear"],
 ["green_turban", "headgear"]
]
```

**사용법**

```python:title=Python
from collections import Counter
cnt = Counter([kind for name, kind in clothes])
```

**출력값**

```bash:title=Bash
Counter({'headgear': 2, 'eyewear': 1})
```
