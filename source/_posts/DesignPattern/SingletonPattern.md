---
title: "싱글톤 패턴"
categories:
  - 디자인패턴 
tags:
  - 디자인패턴
  - 싱글톤
toc: true
toc_label: "싱글톤 패턴"
---


> 해당 클래스의 인스턴스가 하나만 만들어지고, 
어디서든지 그 인스턴스에 접근할 수 있도록 하기 위한 패턴
> 

## 고전적인 싱글톤 패턴 (문제 있음)

```java
public class Singleton {

	private static Singleton uniqueInstance;

	private Singleton(){}

	public static Singleton getInstance(){
		if (uniqueInstance == null){
			uniqueInstance = new Singleton();
		}
		return uniqueInstance;
	}
 }
```

멀티쓰레드 환경에서는 

```java
if (uniqueInstance == null){
	uniqueInstance = new Singleton();
}
```

이 부분에서  2개 이상의 인스턴스가 생성될 수 있다.

## 해결방법

### 1. `synchronized` 사용

```java
public class Singleton {

	private static Singleton uniqueInstance;

	private Singleton(){}

	public static synchronized Singleton getInstance(){
		if (uniqueInstance == null){
			uniqueInstance = new Singleton();
		}
		return uniqueInstance;
	}
 }
```

- 단점 : 속도 저하
    
    → 메소드가  `synchronized` 되면 약 100배 정도 성능 저하가 일어난다고 한다.
    

### 2. 인스턴스를 처음부터 만들어 버림

```java
public class Singleton {

	private static Singleton uniqueInstance = new Singleton();

	private Singleton(){}

	public static synchronized Singleton getInstance(){
		return uniqueInstance;
	}
 }
```

- 클래스가 로딩될 때 JVM에서 Singleton의 유일한 인스턴스를 생성해준다.

### 3. DCL(Double-Checking Locking) 사용

```java
public class Singleton {

	private volatile static Singleton uniqueInstance;

	private Singleton(){}

	public static Singleton getInstance(){
		if (uniqueInstance == null){
                        synchronized (Singleton.class){
                                  if(uniqueInstance == null){
                                             uniqueInstance = new Singleton();
                                  }
                        }
		}
		return uniqueInstance;
	}
 }
```

- `volatile` 키워드를 사용하면 자바의 일종의 최적화인 리오더링(보통 컴파일 과정에서 일어나며, 프로그래머가 만들어낸 코드는 컴파일 될 때 좀더 빠르게 실행될 수 있도록 조작이 가해져 최적하됨)을 회피하여 읽기와 쓰기순서를 보장한다.
- 멀티스레딩을 쓰더라도 uniqueInstance변수가 Singleton 인스턴스로 초기화 되는 과정이 올바르게 진행되도록 할 수 있다.
- **DCL은 자바1.5이상의 버전에서만 사용가능**하다.
- 자바 1.4 및 그 전에 나온 버전의 JVM 중에는 volatile 키워드를 사용하더라도 동기화가 잘 안되는 것이 많다. 일종의 버그.

## 요약

- 우리가 알고있던 싱글톤 패턴은 사실 **싱글톤 패턴이 아님**!
- 위의 3가지 방법을 사용하자
- 개인적으론 **생성자(2번)**가 가장 간단한 것 같음