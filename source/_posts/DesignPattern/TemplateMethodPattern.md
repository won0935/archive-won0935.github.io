---
title: 템플릿메소드 패턴 
categories:
  - 디자인패턴 
tags:
  - 디자인패턴
  - 템플릿메소드
---

## 📦 템플릿메소드 패턴이란

> 메소드에서 알고리즘의 **골격**을 정의한다.
> 알고리즘의 여러 단계 중 일부는 **서브클래스**에서 구현할 수 있다.
> 템플릿 메소드를 이용하면 알고리즘의 _구조는 그대로 유지하면서_ 서브클래스에서 **특정 단계를 재정의** 할 수 있다.

알고리즘의 틀을 만들기 위한 패턴이다.
이 패턴에서 틀(템플릿)이란 일련의 단계들로 알고리즘을 정의한 메소드다. 
여러 던계 가운데 하나 이상이 추상 메소드로 정의되며, 그 추상 메소드는 서브클래스에서 구현된다. 
이렇게 하면 서브클래스에서 일부분의 단계를 구현할 수 있도록 하면서도 알고리즘의 구조는 바꾸지 않아도 되도록 할 수 있다.

---

## 🔎 템플릿메소드 패턴의 이해

### 🚀 활용 예시

_커피와 차가 만들어 지는법을 비교해보자._

#### 커피 만드는 법
```java
1) 물을 끓인다.
2) 끓는 물에 커피를 우려낸다.
3) 커피를 컵에 따른다.
4) 설탕과 우유를 추가한다. 
```

#### 홍차 만드는 법
```java
1) 물을 끓인다. //동일
2) 끓는 물에 차를 우려낸다. //~~ 우려낸다
3) 차를 컵에 따른다. //동일
4) 레몬을 추가한다. //~~ 추가한다
```

거의 동일하다.
공통으로 사용할 수 있는 방법을 생각해보자.

```java
public class Coffee {

    void prepareRecipe() {
        boilWater();
        brewCoffeeGrinds();
        pourInCup();
        addSugarAndMilk();
    }
    
    public void boilWater() {
        System.out.println("물 끓이는 중");
    }
    public void breqCoffeeGrinds() {
        System.out.println("필터를 통해 커피를 우려내는 중");
    }
    public void pourInCup() {
        System.out.println("컵에 따르는 중");
    }
    public void addSugarAndMilk() {
        System.out.println("설탕과 우유를 추가하는 중");
    }
}

public class Tea {

    void prepareRecipe() {
        boilWater();
        steepTeaBag();
        pourInCup();
        addLemon();
    }

    public void boilWater() {
        System.out.println("물 끓이는 중");
    }
    public void steepTeaBag() {
        System.out.println("차를 우려내는 중");
    }
    public void pourInCup() {
        System.out.println("컵에 따르는 중");
    }
    public void addLemon() {
        System.out.println("레몬을 추가하는 중");
    }
}
```

#### 공통부분 추상화

공통 단계를 묶어보면...

```java

public abstract class CaffeineBeverage {

    void final prepareRecipe() { //공통적인 단계는 수정할 수 없도록 final로 선언한다.
        boilWater();
        brew(); //공통으로 사용
        pourInCup();
        addcondiments();  //공통으로 사용
    }

    abstract void brew();  //상속객체에서 직접 구현할 수 있도록 추상메소드로 선언한다
    abstract void addcondiments();  //상속객체에서 직접 구현할 수 있도록 추상메소드로 선언한다

    void boilWater() {
        System.out.println("물 끓이는 중");
    }
    void pourInCup() {
        System.out.println("컵에 따르는 중");
    }
}

public class Coffee extends CaffeineBeverage {
    @Override
    void brew() {
        System.out.println("필터를 통해 커피를 우려내는 중");
    }
    @Override
    public void addCondiments() {
        System.out.println("설탕과 우유를 추가하는 중");
    }
}

public class Tea extends CaffeineBeverage {
    @Override
    void brew() {
        System.out.println("차를 우려내는 중");
    }
    @Override
    public void addCondiments() {
        System.out.println("레몬을 추가하는 중");
    }
}
```

---

## 🚨 헐리우드 원칙

_'먼저 연락하지 마세요. 저희가 연락 드리겠습니다.'_

### 의존성 부패

이 디자인 원칙을 확용하면 **의존성 부패**(dependency rot)를 방지 할수 있다.
어떤 고수준 구성요소가 저수준 구성요소에 의존하고, 그 저수준 구성요소는 다시 고수준 구성요소에 의존하고, 그 고수준 구성요소는 다시 또 다른 구성요소에 의존하고.. 

이런 식으로 의존성이 복잡하게 꼬여있는 것을 **의존성 부패**라고 한다.

**헐리우드 원칙**을 사용하면, 저수준 구성요소에서 시스템에 접속을 할수는 있지만, 언제 어떤 식으로 그 구성요소들을 사용할지는 **고수준 구성요소에서 결정**하게 된다.

> 즉, 저수준 구성요소는 컴퓨테이션에 참여할 수는 있지만 절대 **고수준 구성요소를 직접 호출하면 안된다**는 것이다.


#### CaffeineBeverage 디자인을 이용해 본다면..

![image](https://user-images.githubusercontent.com/55419159/140914388-faeda3ca-a3f8-4fe1-9984-490453f4bd1e.png)

`CaffeineBeverage`는 고수준 구성요소 이다. 
음료를 만드는 방법에 대당하는 알고리즘을 장악하고 있고, 메소드 구현이 필요한 상태에서만 서브클래스를 불러낸다.

`Coffee`와 `Tea` 와 같은 서브클래스는 각각의 **메소드 구현을 제공하기 위한 용도**로만 쓰인다.

이와같은 서브 클래스들은 고수준 구성요소인 `CaffeineBeverage` 클래스로부터 호출 당하기 전까지는 절대로 `CaffeineBeverage` 추상 클래스를 직접 호출하지 않는다.

이렇게 함으로 `CaffeineBeverage` 클래스의 클라이언트에서는 `Tea`나 `Coffee` 같은 구상 클래스가 아닌 `CaffeineBeverage`에 추상화 되어 있는 부분에 의존하게 된다. 

그렇게 함으로써 **전체 시스템의 의존성**이 줄어들 수 있다.