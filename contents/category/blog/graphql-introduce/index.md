---
title: '[GraphQL] GraphQL에 대해서'
date: '2020-11-25'
category: 'blog'
description: ''
emoji: '📘'
---

[[simple | 📱 Write once, Use everywhere]]

## GraphQL 이란?

'Graph Query Language'의 약자로 `Facebook` 에서 만든 `Application Layer` 쿼리 언어이다.

즉, 기존 `REST API` 의 `HTTP 통신` 과 동일하다 !

`GraphQL` 을 좀 더 간단하게 설명하면?!

- 클라이언트에 필요한 `자원`을 더 `유연하게` 요청하고, 응답해주는 `HTTP` 통신

![GraphQL 이미지](https://user-images.githubusercontent.com/38131683/100873666-db38fe80-34e6-11eb-8f19-19e4ae086212.png)

#### GraphQL 쿼리 언어의 디자인

`JSON` 응답의 `Key` 부분만 가져온 형태로 디자인됨

```graphql
# GraphQL 쿼리 (gql)
query{
  user(id : 1) {
    name
    age
  }
}
```

```json
// JSON 응답 메시지
{
  "user": {
    "name": "LEE WOO WON",
    "age" : 23
  }
}
```

## REST API 와 무엇이 다른걸까?

먼저 `Facebook` 이 왜 기존 `REST API` 를 대체하려 하는지와 `REST API` 와 `GraphQL` 의 차이점을 알아보자.

#### REST API 를 대체하려고 한 이유

##### REST API 의 단점

기존의 REST API는 다음와 같은 단점을 가짐.

1. `Over-fetching`
    - 요청한 영역의 정보보다, 많은 정보를 서버에서 받게 되는 것
    - 즉, 프론트에서 필요한 정보만 딱 주는 것이 아니라 필요 없는 정보도 함께 받는 경우도 있다.
	
2. `Under-fetching`
    - REST에서 하나를 완성하려고 많은 소스를 요청하는 것
    - 즉, 1번의 콜이 아니라 여러개의 REST API 콜로 프론트에 필요한 정보를 가져오는 경우

#### REST API와 GraphQL의 차이점

##### 첫 번째 이유는 생산성 향상을 위함 !

기존의 `REST API` 는 클라이언트의 각 요청에 따라 필요한 응답을 따로 서버 개발자에게 요구사항을 이야기하고 요구사항에 맞게 개발 후 응답을 보내주었다면 

`GraphQL` 을 사용하면 클라이언트가 원하는 응답을 위한 요청 쿼리를 날리면 데이터를 받을 수 있다.  
→ 백엔드에서는 필요한 데이터를 내려주고, 저장하는 방식에만 집중하면 OK !

[[info | GraphQL 은 뷔페 / REST API 는 세트 메뉴와 같다.]]
| 🍖 🍕 🍺 🍩 뷔페는 먹고 싶은 것만 먹을 수 있지만,  
| 🍱 세트 메뉴는 내가 필요하지 않은 것도 들어있다.

이러한 이유로 `프론트엔드` 와 `백엔드` 와의 필요없는 의사소통에 의한 개발 비용을 줄일 수있어 생산성이 향상된다.

추가적으로 GraphQL의 `End-Point`는 딱 하나!

##### 두 번째 이유는 퍼포먼스적 성능 향상을 위함 !

예를 들어, `회원`, `포스트`, `팔로워` 정보를 서버로 요청하고 싶은 경우

`REST API` 의 경우 원하는 데이터를 받기 위해 3번의 API 호출이 필요하다.

```markdown
/users/<id> : 회원 정보 요청
/users/<id>/posts : 회원이 등록한 게시글 요청
/users/<id>/followers : 회원을 팔로우하는 유저 정보
```

반면에, `GraphQL` 의 경우 1번의 API 호출로 원하는 정보를 모두 가져올 수 있다.

```graphql
query{
  user(id : 1){
    name
    posts{
      title
    }
    followers(last : 3){
      name
    }
  }
}
```

## 그럼 GraphQL은 REST API를 완전히 대체할까?

[[info | 완전히 대체하기엔 GraphQL의 단점도 존재]]

1. File 전송 등 Text 만으로는 하기 힘든 내용들을 처리하기 복잡하다.

2. 고정된 요청과 응답만 필요할 경우엔 `Query`로 인해 요청의 크기가 `REST API`경우보다 더 커진다.

3. 캐싱 처리

4. 프론트엔드 개발자가 Query 요청 문법을 배워야하는점

#### 그렇다면 GraphQL or REST API 어떤 것?

어떤 기술이 좋다고 얘기 할 수 없으니 상황에 따라 각각의 `장점`, `단점` 에 따라서 적합한 기술을 사용하는 것이 현명 !

그러나 더 중요한 것은, ***둘 중 하나를 선택할 필요는 없다는 것..!***

이상입니다-!
