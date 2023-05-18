---
title: "[Web] Http Status Code 정리"
date: '2023-05-18'
category: 'web'
description: ''
emoji: '⛑️'
---


# 1xx (Informational) 
- 요청이 수신되어 처리 중
- 사실 상 무의미하므로 생략


# 2xx (Successful) 
- 클라이언트의 요청을 성공적으로 처리
### 200 OK
- 요청 성공
### 201 Created
- 요청 성공해서 새로운 리소스가 생성됨
- 생성된 리소스는 응답의 `Location` 헤더 필드에 포함되어야 한다. ex) `Location: /users/1`
### 202 Accepted
- 요청이 접수되었으나 처리가 완료되지 않았음
- 비동기 처리 시 사용(배치)
### 204 No Content
- 요청은 성공했지만 응답 본문에 데이터가 없음
- 클라이언트가 서버의 상태를 업데이트하는 경우 사용


# 3xx (Redirection) 
- 클라이언트가 요청을 완료하기 위해 추가 동작이 필요
- 브라우저는 3xx 응답의 결과에 `Location` 헤더가 있으면 자동 리다이렉트
- 302 Found 를 자주 사용
## 영구이동
- 요청한 리소스가 영구적으로 새로운 URI에 옮겨졌음
### 301 Moved Permanently
- 리다이렉트 시 요청 메서드가 GET으로 변경됨 ex> Post -> Get
- 영구 리다이렉션 시 자주 사용
### 308 Permanent Redirect
- 301과 동일하지만 요청 메서드가 변경되면 안됨 ex> Post -> Post
- 거의 사용 안함
## 임시이동
- 요청한 리소스가 일시적으로 새로운 URI에 옮겨졌음
### 302 Found
- 리다이렉트 시 요청 메서드가 GET으로 **변경될 수 있음**
- 대부분의 경우 사용
### 303 See Other
- 302와 동일하지만 요청 메서드가 GET으로 **변경됨**
### 308 Temporary Redirect
- 302와 동일하지만 요청 메서드가 변경되면 안됨 ex> Post -> Post
## 기타
### 304 Not Modified
- 캐시를 목적으로 자주 사용
- 클라이언트에게 리소스가 수정되지 않았음을 알려줌
- 클라이언트는 로컬 PC에 저장된 리소스를 사용(캐시로 리다이렉트)


# 4xx (Client Error) 
- 클라이언트의 요청에 잘못된 문법 등으로 서버가 요청을 수행할 수 없음
### 400 Bad Request
- 클라이언트의 요청이 잘못되었음
- 요청 구문, 메시지 등등이 잘못되었음
### 401 Unauthorized
- 인증이 필요한 리소스에 접근했으나 인증이 되지 않음
- `WWW-Authenticate` 헤더 필드를 사용해 인증 방법을 설명
### 403 Forbidden
- 서버가 요청을 이해했지만 승인을 거부함
- 주로 인증 자격 증명은 있지만 접근 권한이 불충분한 경우 사용
### 404 Not Found
- 요청 리소스를 찾을 수 없음


# 5xx (Server Error) 
- 서버가 요청을 처리하지 못함
### 500 Internal Server Error
- 서버 문제로 오류 발생
- 애매하면 500 오류
### 503 Service Unavailable
- 서버가 일시적인 과부하 또는 예정된 작업으로 잠시 요청을 처리할 수 없음
- `Retry-After` 헤더 필드로 얼마뒤에 복구되는지 보낼 수 있음
