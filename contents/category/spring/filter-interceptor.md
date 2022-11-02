---
title: "[Spring] Filter & Interceptor"
date: '2022-10-10'
category: 'spring'
description: ''
emoji: '🚠'
---

# Filter

- Filter란 **Web Application**에서 관리되는 영역으로써 Spring Boot Framework에서 Client로 부터 오는 요청/응답에 대해서 **최초/최종 단계**의 위치에 존재하며, 이를 통해서 요청/응답의 정보를 변경하거나, Spring에 의해서 데이터가 변환되기 전의 순수한 Client의 요청/응답 값을 확인 할 수 있다
- **유일하게 ServletRequest, ServletResponse의 객체를 변환**할 수 있다
- 주로 Spring Framework에서는 **request/response의 logging 용도**로 활용하거나, **인증과 관련된 Logic**들을 해당 Filter에서 처리한다
- 이를 선/후 처리 함으로써, Service business logic과 분리 시킨다

![image](https://user-images.githubusercontent.com/55419159/199489021-f806825e-62f6-4b86-a435-32fde63fe491.png)


# Interceptor

- Filter와 매우 유사한 형태로 존재 하지만, 차이점은 **Spring Context**에 등록
- **AOP와 유사한 기능**을 제공할 수 있으며, 주로**인증 단계**를 처리 하거나, **Logging**를 하는데 사용한다
- 이를 선/후 처리 함으로써, Service business logic과 분리 시킨다

![image](https://user-images.githubusercontent.com/55419159/199489141-57932519-ce26-4a24-a6d0-de3c557ed44f.png)

![image](https://user-images.githubusercontent.com/55419159/199489240-3748cbef-966b-4717-a118-18253a4cc0fc.png)
