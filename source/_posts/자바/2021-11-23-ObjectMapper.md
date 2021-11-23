---
title: ObjectMapper
categories:
  - 자바
tags:
  - 자바
  - Util
  - ObjectMapper
---


# Jackson ObjectMapper

- ObjectMapper는 생성 비용이 꽤 비싸기 때문에 멤버변수, bean, static으로 처리
- ObjectMapper는 Thread Safe하기 때문에 굳이 매번 생성해서 따로 쓸 필요가 없음
- Spring의 경우 Bean으로 등록해서 DI받아서 쓰는 것이 좋음

## readValue vs convertValue

- `readValue`

  json String → Model

- `convertValue`

  Object → Model

  Jackson 2.7.x+부터 멤버 변수 자체에 주석을 달 수 있는 방법이 있습니다.

    ```
     @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
     private List<String> newsletters;
    ```