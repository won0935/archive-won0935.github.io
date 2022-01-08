---
title: "[다자인패턴] 데코레이터 패턴"
date: '2021-11-13'
category: 'design-pattern'
emoji: '🎁'
---

## 🎁 데코레이터 패턴이란

> 객체에 **추가적인 요건**을 동적으로 첨가한다.
> 데코레이터는 **서브클래스**를 만드는 것을 통해서 기능을 유연하게 확장할 수 있는 방법을 제공한다.

### 클래스 다이어그램

![image](https://user-images.githubusercontent.com/55419159/141609476-9786bc6c-9a46-45d3-b2ad-63c6678abc0e.png)

- `ConcreteComponent`에 **새로운 행동을 동적으로 추가**할 수 있다.
각 데코레이터 안에는 구성요소(Component)에 대란 레퍼런스가 들어있는 인스턴스 변수가있다.

- `Decorator`는 자신이 장식할 구성요소(Component)와 같은 인터페이스 또는 **추상 클래스를 구현**한다.

- `ConcreteDecoratorA`, `ConcreteDecoratorB` 에는 그 객체가 장식하고있는(데코레이터가 감싸고 있는 Component객체)을 위한 인스턴스 변수가 있다. 
따라서 데코레이터는 `Component`의 **상태를 확장**할 수 있다.

- `ConcreteDecoratorA`, `ConcreteDecoratorB` 데코레이터에서 **새로운 메소드를 추가**할 수도 있다. 
하지만 일반적으로 새로운 메소드를 추가하는 대신 `Component`에 원래 있던 메소드를 호출하기 전, 또는 후에 **별도의 작업을 처리하는 방식**으로 새로운 기능을 추가한다.

---

## 활용예제

### ☕️ 카페 주문시스템 만들기

> _커피를 주문할 때는 스팀 우유나 두유, 모카를 추가하고, 그 위에 휘핑 크림을 얹기도 한다.
> 각각을 추가할 때마다 커피 가격이 올라가기 때문에 주문 시스템에서도 그런 점들을 모두 고려해야 한다._

기존의 코드는 **건드리지 않은 채로** 확장을 통해서 새로운 행동을 간단하게 추가할 수 있는 **데코레이터 패턴**을 사용해보자.

우선 특정 음료에서 시작해서 첨가물로 그 음료를 장식 해보자.

1. `DarkRoast` 객체를 가져온다.
2. `Mocha` 객체로 장식한다.
3. `Whip` 객체로 장식한다.
4. `cost()` 메소드를 호출한다. 이때 첨가물의 가격을 계산하는 일은 해당 객체들에게 위임된다.

디자인을 바탕으로 코드를 만들어보자.

![image](https://user-images.githubusercontent.com/55419159/141609675-00fe88e7-909c-4349-9dc8-88f3eeca5d05.png)


#### `Beverage` 추상클래스 구현

```java
public abstract class Beverage {

    private String description = "Empty";

    public String getDescription() {
        return this.description;
    }

    public abstract int cost();
}
```

#### `Beverage` 를 확장하는 `CondimentDecorator` 구현

```java
public abstract class CondimentDecorator extends Beverage {
    
    public abstract String getDescription();
    
}
```

#### `Beverage` 를 활용해 음료 객체 구현

```java
public class Espresso extends Beverage {

    public Espresso() {
        this.description = "에스프레소";
    }

    @Override
    public int cost() {
        return 3500;
    }
}

public class HouseBlend extends Beverage {

    public HouseBlend() {
        this.description = "하우스블렌드";
    }

    @Override
    public int cost() {
        return 2000;
    }
}
```


#### `CondimentDecorator` 를 활용해 꾸며진 객체 구현

```java
public class Mocha extends CondimentDecorator {

    private Beverage beverage;

    public Mocha(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ", 모카";
    }

    @Override
    public int cost() {
        return 500 + beverage.cost();
    }
}
```

#### 테스트

```java
public class CoffeeStore {

    public static void main(String args[]) {
        Beverage beverage = new Espresso();
        System.out.println(beverage.getDescription() + " cost : " + beverage.cost());

        Beverage beverage1 = new DarkRoast();
        beverage1 = new Mocha(beverage1);
        beverage1 = new Mocha(beverage1);
        beverage1 = new Whip(beverage1);
        System.out.println(beverage1.getDescription() + " cost : " + beverage1.cost());

        Beverage beverage2 = new HouseBlend();
        beverage2 = new Soy(beverage2);
        beverage2 = new Mocha(beverage2);
        beverage2 = new Whip(beverage2);
        System.out.println(beverage2.getDescription() + " cost : " + beverage2.cost());
    }
}
```

### 디자인 원칙

> **OCP(Open-Closed principle)**
> _클래스는 확장에 대해서는 열려 있어야하지만 코드 변경에 대해서는 닫혀 있어야 한다._

---

## 데코레이터가 적용된 예 : 자바 I/O

개발하면서 스트림의 개념이 잘 잡히지 않았을때.. 자바 I/O API를 보고 한숨을 쉬는 사람들이 나말고도 많았을 거라 생각한다. 
기반스트림과 보조스트림을 데코레이터 패턴을 배우고 나서 머리속에서 다시 정리해보면 많은 클래스들이 좀더 친근하게 다가 온다.

실제 자바에서 클래스 다이어그램을 그려보면

![image](https://user-images.githubusercontent.com/55419159/141609807-708dd839-da97-46a2-832b-2c82ecc82bd4.png)

`InputStream` 이 추상구성요소이고 모든 보조스트림의 조상인 `FilterInputStream` 이 추상 데코레이터 이다. 
`FilterInputStream`을 상속받아 구현하는 `BufferedInputStream` 클래스들이 구상 데코레이터이다. 
`InputStream`을 상속받는 `FileInputStream` 같은 기반 스트림들은 데코레이터로 포장될 구상 구성요소 역할을 한다.