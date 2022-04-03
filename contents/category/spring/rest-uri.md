---
title: "[Spring] URI 설계"
date: '2022-04-03'
category: 'spring'
description: ''
emoji: '🥌'
---

# REST 아키텍처 원리

1. **Client , Server** : 클라이언트와 서버가 서로 독립적으로 **분리되어져 있어야** 한다.
2. **Stateless** : 요청에 대해서 클라이언트의 **상태가 서버에 저장을 하지 않는다.**
3. **캐시** : 클라이언트는 서버의 응답을 **캐시** 할 수 있어야 한다.
   클라이언트가 캐시를 통해서 응답을 **재사용**할 수 있어야 하며, 이를 통해서 서버의
   부하를 낮춘다.
4. **계층화(Layered System)** : 서버와 클라이언트 사이에, 방화벽, 게이트웨이, Proxy
   등 **다계층** 형태를 구성할 수 있어야 하며, 확장 할 수 있어야 한다.
5. **인터페이스 일관성** : 아키텍처를 단순화시키고 작은 단위로 분리하여서,
   클라이언트, 서버가 **독립적**으로 개선될 수 있어야 한다.
6. **Code On Demand(optional)** : 자바 애플릿, 자바스크립트 플래시 등 특정기능을
   서버가 클라이언트에 코드를 전달하여 실행 할 수 있어야 한다.

--- 
 # URL과 URI의 차이
 1. **URI(Uniform Resource Identifier)** : 인터넷에서 특정 자원을 나타내는 주소값. 해당 값은 유일합니다.
          - ex : https://www.foo.co.kr/resource/sample/1
     - response : sample1.pdf, sample2.pdf, sample.doc

 2. **URL(Uniform Resource Locator)** : 인터넷 상에서의 자원, 파일이 어디에 위치하는지 식별 하는 주소
          - ex : https://www.foo.co.kr/sample1.pdf

 **URL**는 **URI**의 **하위 개념**입니다.

--- 

# REST URI 설계 방법

1. 슬래시 구분자(`/`)는 계층 관계를 나타내는 데 사용한다.
   - https://foo.co.kr/vehicles/suv/q6

2. URI 마지막 문자로(`/`) 는 포함하지 않는다.
   - https://foo.co.kr/vehicles/suv/q6/

3. 하이픈(`-`)은 URI가독성을 높이는데 사용한다
   - https://foo.co.kr/vehicles/suv/q-series/6

4. 밑줄(`_`)은 사용하지 않는다.
   - https://foo.co.kr/vehicles/suv/q_series/6

5. URI 경로에는 **소문자**가 적합하다.
    - https://foo.co.kr/vehicles/suv/q6 ( O )
    - https://Foo.co.kr/Vehicles/SUV/Q6 ( X )

6. 파일 **확장자**는 URI에 포함하지 않는다.
    - https://foo.co.kr/vehicles/suv/q6.jsp

7. **프로그래밍 언어**에 의존적인 확장자를 사용하지 않는다.
    - https://foo.co.kr/vehicles/suv/q6.do

8. **구현**에 의존적인 경로를 사용하지 않는다.
    - https://foo.co.kr/servlet/vehicles/suv/q6

9. **세션 ID**를 포함하지 않는다.
    - https://foo.co.kr/vehicles/suv/q6?session-id=abcdef

10. 프로그래밍 언어의 `Method`명을 이용하지 않는다.
    - https://foo.co.kr/vehicles/suv/q6?action=intro

11. 명사에 단수형 보다는 **복수형**을 사용해야 한다. 컬렉션에 대한 표현은 복수로 사용
    - https://foo.co.kr/vehicles/suv/q6

12. 컨트롤러 이름으로는 **동사**나 **동사구**를 사용한다.
    - https://foo.co.kr/vehicles/suv/q6/re-order

13. 경로 부분 중 변하는 부분은 **유일한 값**으로 대체 한다.(`@pathVariable`)
    - https://foo.co.kr/vehicles/suv/q7/{car-id}/users/{user-id}/release
    - https://foo.co.kr/vehicles/suv/q7/117/users/steve/release

14. CRUD **기능**을 나타내는것은 URI에 사용하지 않는다.
    - `GET` : https://foo.co.kr/vehicles/q7/delete/{car-id} (X)
    - `DELETE` : https://foo.co.kr/vehicles/q7/{car-id} (O)

15. URI **Query Parameter** 디자인
    - URI 쿼리 부분으로 컬렉션 결과에 대해서 **필터링** 할 수 있다.
        - https://foo.co.kr/vehicles/suv?model=q7
    - URI 쿼리는 컬렉션의 결과를 **페이지**로 구분하여 나타내는데 사용한다.
        - https://foo.co.kr/vehicles/suv?page=0&size=10&sort=asc

16. API에 있어서 **서브 도메인**은 일관성 있게 사용해야 한다.
    - https://foo.co.kr
    - https://api.foo.co.kr

17. 클라이언트 **개발자 포탈** 서브 도메인은 일관성 있게 만든다.
    - https://dev-api.foo.co.kr/vehicles/suv/q6
    - https://developer-api.foo.co.kr/vehicles/suv/q6