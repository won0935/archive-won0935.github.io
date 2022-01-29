---
title: "[GraphQL] graphql 라이브러리 spqr 를 이용한 GraphQL 실습해보기"
date: '2022-01-09'
category: 'spring'
description: ''
emoji: '🍇'
---

> 회사에서 백오피스를 구축해야 하는데, 여러면에 있어 `graphQL`를 적용시키면 좋을 것 같아 학습해보았다.


## 👾 GraphQL 이란

`GraphQL`은 페이스북이 2012년에 개발하여 2015년에 공개적으로 발표된 데이터 질의어이다.
클라이언트(프론트)는 필요한 데이터의 구조를 지정할 수 있으며, 서버는 정확히 동일한 구조로 데이터를 반환한다.

![image](https://user-images.githubusercontent.com/55419159/148671417-a7a7db95-e44c-4f9c-8723-4d5248bcdc67.png)


- 클라이언트에서 작성하는 쿼리의 예시이다.

```graphql
query {
    book(id: "1") {
        title
        author {
            firstName
            lastName
        }
    }
}
```

- 응답은 이렇게 오게 된다.

```json
{
	"title": "Harry Porter ",
	"author": {
		"firstName": "J.K",
		"lastName": "Rowling"
	}
}
```

---

## 📝 실습

### ⚙️ 환경

- **spqr (GraphQL 라이브러리)**
- Java 11
- Spring boot 2.6.2
- Gradle
- Feign client
- MySql(docker)
- JPA
- MapStruct

### ⛳ 목표

1. `select` 테스트 (조건에 맞춰 값을 잘 가져오는지)
2. `insert`, `update`, `delete` 테스트
3. 다른 서비스(msa)에 `graphQL`로 받은 요청을 보낼 수 있는지

---

## 1️⃣ [ReceiverProject](https://github.com/won0935/GraphQLTestReceiver) 만들기

요청을 받아 DB CRUD 하는 서비스를 만든다.

### 1. DB 스키마 설계

테이블 구조는 아래와 같다.
- `상품정보` 테이블
- `상품에 대한 태그` 테이블

![image](https://user-images.githubusercontent.com/55419159/148672128-7381359e-0117-4b9d-9d2d-51a2a5cbf7f0.png)

### 2. Controller 작성

일반적인 Rest 구조로 되어있다.

```java
@RestController
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/loans")
    public List<LoanModel> loans() {
        return loanService.getLoans();
    }

    @GetMapping("/loan/{id}")
    public LoanModel getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @PostMapping("/loan")
    public LoanModel saveLoan(@RequestBody LoanModel post) {
        return loanService.saveLoan(post);
    }

    @PostMapping("/delete-loan")
    public void deleteLoan(Long id) {
        loanService.deleteLoan(id);
    }

}
```

---

## 2️⃣ [SenderProject](https://github.com/won0935/GraphQLTestSender) 만들기

이번에는 `GraphQL(spqr)`로 요청을 받아 ReceiverProject로 보내는 서비스를 만든다.

- `spqr` 이란
> 스키마를 정의하여 매핑하는 방식이 아닌 어노테이션을 사용하여 매핑을 해주는 방식이다.
> 따로 스키마와 resolver를 구현하지 않아도 GraphQL을 사용할 수 있어 편리하다는 장점이 있지만
> 단점으로 Multipart 를 이용한 파일 업로드 구현이 어렵다는 점이 있다.

### 1. Service 작성

여기서 Service 는 클라이언트의 요청을 받는 컨트롤러와 같은 역할을 한다.

```java

@GraphQLApi
@RequiredArgsConstructor
public class LoanService {

    private final TestClient testClient;

    @GraphQLQuery(name = "loans")
    public List<LoanModel> getLoans() {
        return testClient.loans();
    }

//    {
//    	post(id:1){
//    		id
//    		title
//    	}
//    }
    @GraphQLQuery(name = "loan")
    public LoanModel getLoanById(Long id) {
        return testClient.getLoanById(id);
    }

//    mutation{
//        saveLoan(post:
//        {
//            id: 343
//            name :"sss",
//            loanTagList:[
//               {
//                        type: "test1",
//                        description :"xxx"
//                }
//                {
//                        type: "test2",
//                        description :"yyy"
//                }
//                {
//                        type: "test3",
//                        description :"zzz"
//                }
//            ]
//        })
//    }
    @GraphQLMutation(name = "saveLoan")
    public LoanModel saveLoan(LoanModel post) {
        return testClient.saveLoan(post);
    }

//    mutation{
//    	deletePost(id:1)
//    }
    @GraphQLMutation(name = "deleteLoan")
    public void deleteLoan(Long id) {
        testClient.deleteLoan(id);
    }

}
```

### 2. Feign Client 작성

graphQL 로 클라이언트에서 받는 요청을 ReceiverProject(8070)에 보낸다.

```java
@FeignClient(name = "feign", url = "http://localhost:8070")
public interface TestClient {

    @GetMapping("/loans")
    List<LoanModel> loans();

    @GetMapping("/loan/{id}")
    LoanModel getLoanById(@PathVariable Long id);

    @PostMapping("/loan")
    LoanModel saveLoan(LoanModel post);

    @PostMapping("/delete-loan")
    void deleteLoan(Long id);
}
```

### 3. 실행

실행 후
http://localhost:8080/gui
로 접속하면 해당 화면을 볼 수 있다.

![image](https://user-images.githubusercontent.com/55419159/148673364-6e083cc1-c385-4b4f-a970-761919e0054f.png)

---

## 🎬 결론

- `graphQL` 로 클라이언트에서 요청을 받고, 다른 서비스로 `REST`하게 전송할 때 별다른 문제점은 찾지 못했다.
- 페이징, 파일 전송 등은 연구 필요