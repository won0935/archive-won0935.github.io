---
title: "[Spring] Servlet"
date: '2022-10-05'
category: 'spring'
description: ''
emoji: '🔭'
---

# 서블릿(Servlet)이란?

서블릿(Servlet)이란 동적 웹 페이지를 만들 때 사용되는 **자바 기반의 웹 애플리케이션 프로그래밍 기술**이다. 
쉽게 말해, **"웹 서버 프로그래밍을 하기 위한 사양을 갖춘 자바 코드"** 라고 할 수 있다.

```java
 public abstract class HttpServlet extends GenericServlet {
      //...
       protected void doGet(HttpServletRequest req, HttpServletResponse resp){...}
       protected void doPost(HttpServletRequest req, HttpServletResponse resp){...}
       //...
 }
```

`HttpServlet` 클래스를 상속한 클래스 Servlet은 톰캣과 같은 **Servlet Container**에 의해 관리, 실행된다.

**HTTP Server + Servlet Container**가 웹 서버 역할에 필요한 대부분을 구현해두었고, 개발자는 Servlet을 만들어 HTTP 요청을 받아 처리하는 부분을 구현한다. 메서드를 참고하면 알 수 있듯 요청(Request)과 응답(Response) 즉, Http 웹 서버 기능 동작이 가능하다.


> 톰캣(Tomcat) 이란
>  
> **웹 애플리케이션 서버(WAS)중 하나**로 **Servlet Container, Servlet Engine**이라고 표현할 수 있으며 Servlet을 관리한다.
> **Servlet을 관리한다**는 말은 **클라이언트가 어떤 요청(Request)을 했을 때**, **어떤 Servlet을 실행할 것인지** 제어해준다는 것이다. 톰캣은 Servlet을 관리해주는 주체이기 때문에 Servlet(`HttpServlet` 클래스를 상속한 클래스)이어야 한다.


# 서블릿의 생명주기

서블릿도 자바 클래스이므로 실행하면 초기화부터 서비스 수행 후 소멸하기까지의 과정을 거친다. 
이 과정을 서블릿의 생명주기라하며 각 단계마다 호출되어 기능을 수행하는 콜백 메서드를 서블릿 생명주기 메서드라한다.

```java
public class FirstServlet extends HttpServlet {
	@Override
    public void init() {
    ...
	}

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) {
    ...
    }

    @Override
    public void destroy() {
    ...
    }
}
```

### 서블릿 생명주기 메서드

**초기화 : `init()`**

- 서블릿 요청 시 맨 처음 한 번만 호출된다.
- 서블릿 생성 시 초기화 작업을 주로 수행한다.

**작업 수행 : `doGet()`, `doPost()`**

- 서블릿 요청 시 매번 호출된다.
- 실제로 클라이언트가 요청하는 작업을 수행한다.

**종료 : `destroy()`**

- 서블릿이 기능을 수행하고 메모리에서 소멸될 때 호출된다.
- 서블릿의 마무리 작업을 주로 수행한다.

# 서블릿 관련 클래스

### **DispatcherServlet**

- **"Servlet Container(e.g. tomcat)으로부터 들어오는 요청을 관제하는 컨트롤러"** 라고 할 수 있다.
- **DispatcherServlet**이 **HandlerMapping**을 통해 적절한 `Controller`로 매핑한다.

### ServletFilter

- Servlet 실행 전, 후에 어떤 작업을 하고자할 때 **Servlet Filter** 를 사용한다. `Interceptor`를 사용할 수 있겠지만 차이점은 실행시점(handler전, 후)에 차이가 있다.
- `Filter` 는 **Servlet Container**에 등록하고`Interceptor`는 스프링 컨테이너에 등록한다.
- `javax.servlet.Filter` 인터페이스의 구현체이다.

### ServletContext

- **Servlet 단위**로 생성되는 Context이다. Servlet Container(e.g. tomcat)에 DispatcherServlet과 같은 servlet을 등록하면 해당 servlet이 갖는 하나의 **작은 컨테이너 역할**을 하는 객체이다.
- 스프링을 이용하는 경우, 스프링 컨테이너(Application Context)를 부모 Context로 사용한다.

### ApplicationContext

- **Root Context**이자 스프링에 의해 생성되는 Bean에 대한 **Spring IoC Container**이다. `BeanFactory`를 상속받는 **Context Servlet**에서 공통으로 사용할 **Bean**을 등록하는 **Context**이다.
- `@Transactional` 으로 트랜잭션을 이용해야할 때 **ApplicationContext**에 있는 Service에서만 트랜잭션이 정상 작동한다.

![image](https://user-images.githubusercontent.com/55419159/199487187-42417a16-fd4e-4cf8-b480-d0df70ce1a90.png)
