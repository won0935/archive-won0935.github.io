---
title: "[다자인패턴] 스트레티지 패턴"
date: '2021-11-11'
category: 'design-pattern'
description: ''
emoji: '🦆'
---



## 📍 스트레티지 패턴이란

> 알고리즘군을 정의하고 각각 **캡슐화**하여 교환해서 사용할 수 있도록 만든다.
> 스트래티지패턴을 활용하면 알고리즘을 사용하는 클라이언트와는 **독립적으로** 알고리즘을 변경할수 있다.

---

## 🦆 활용예제 : 오리 게임 만들기

오리 어플리케이션 게임을 운영하는 회사를 다니면서 오리게임을 만든다고 가정했을때. 표준적인 객체지향 기법을 사용하여 `Duck` 이라는 **슈퍼클래스**를 만든다음 그 **클래스를 확장**하여 다른 종류의 오리를
만든다.


### ☠️ 디자인패턴을 적용하지 않을 때

![image](https://user-images.githubusercontent.com/55419159/141426069-89b87dc4-ca38-42dc-bf65-f53e8125d49e.png)

추상클래스인 `Duck` 클래스를 `ReadHeadDuck` 클래스와 `MallardDuck` 클래스가 상속을 받아 추상메소드인 `display()`를 각각 구현한다.

#### 문제의 시작1

원래는 그럴 계획이 없었는데..
오리들이 물에 떠있는 기능 이외에 날아다녀야하는 요구사항이 생겼다.

![image](https://user-images.githubusercontent.com/55419159/141426644-cdd48f86-a3c7-4eda-9803-57a1bce59486.png)

간단하네.. ?
이제 모든 오리들에게 날수있는 기능이 추가되었다.
그런데 날 수없는 오리가 있었다는 사실을 잊고있었다.

![image](https://user-images.githubusercontent.com/55419159/141426734-0a0a532e-668b-4a32-82a1-89b1494d5f22.png)

`Duck` 코드의 한부분만을 바꿈으로 해서 프로그램 전체에 부작용이 발생하였다. (장난감 고무오리가 날아다님)
문제를 해결하기 위하여 `RubberDuck` 클래스에서 `fly()` 메소드와 `quack()` 메소드를 오버라이드 하여 소리와 날수있게 하는기능을 변경시켜주었다.

![image](https://user-images.githubusercontent.com/55419159/141427908-0733cfdb-596a-424b-a934-92dbf3674d08.png)

일단 문제는 해결되었지만.. 향후에 `RubberDuck`과 같은 가짜오리가 더 추가가 된다면 그때마다 **맞지않는 상속되는 메소드들을 오버라이드 해서 구현해야하는 문제**가 여전히 존재한다.

#### 문제의 시작2

회사에서 1개월마다 한번씩 새로운 오리를 업데이트 한다고 한다. 여러 오리가 새롭게 추가될것이고 그 규격도 계속 변할것이라고 한다.
그렇다면 매번 모든 오리 서브클래스의 `fly()` 와 `quack()` 같은 메소드를 일일이 살펴봐야하고 상황에따라 오버라이드로 해야할수있다.

상속활용이 맞는건가.. 다시생각해보자.

그렇다면 인터페이스를 사용한다면?

![image](https://user-images.githubusercontent.com/55419159/141428073-9d371761-e436-4073-a117-b51220dc1ada.png)

코드중복이 엄청나겠지..
메소드 몇게 오버라이드 해야하는것을 피하다가 날아가는 동작 바꾸기위해 새롭게 생긴 모든 `Duck` 서브클래스들을 전부 고쳐야하네.


### ✅ 디자인패턴을 적용할 때

상속을 사용하는것도 서브클래스들의 행동이 바뀔수 있는데도 모든 서브클래스들이 하나의 행동을 사용하는것이 문제가되고
`Flyable`, `Quackable` 인터페이스 사용을 하는 방법도 코드재사용을 할수없다는 문제가 있다.
(한가지의 행동을 바꿀때마다 그 행동이 정의되어있는 모든 서브클래스들은 전부 찾아서 코드를 일일히 고쳐야 하고, 그 과정에서 새로운 버그가 생길 가능성이 많음!)

#### 디자인 원칙 1

> _애플리케이션에서 **달라지는 부분**을 찾아내고, 달라지지 않는 부분으로부터 **분리**시킨다._


달라지는 부분을 찾아서 나머지 코드에 영향을 주지 않도록 **캡슐화**한다.

오리마다 달라지는 부분은.. `fly()` 와 `quack()` 이다.
이러한 행동을 `Duck` 클래스로부터 분리시키기 위해 나타낼 새로운 **클래스의 집합**을 만들어 준다.


![image](https://user-images.githubusercontent.com/55419159/141428230-1e024573-ef62-4224-8076-19ec12155a53.png)


행동에 관한 인터페이스를 만들고, 구체적인 행동을 구현하는 클래스들을 만든다.
이제 더이상 `Duck`에서 나는 행동과 소리를 내는 행동을 Duck 클래스나 그 서브클래스에서 구현하지않고 **다른클래스에게 위임**하게 된다.

#### 디자인 원칙 2

> _~~상속~~보다는 **구성**을 활용한다._

#### 디자인 원칙 3

> _~~구현~~이 아닌 **인터페이스**에 맞춰서 프로그래밍 한다._


그리고 `Duck` 클래스는 두개의 인터페이스 형식의 인스턴스 변수가 추가가 된다.

![image](https://user-images.githubusercontent.com/55419159/141428498-583654d3-79b9-4c32-9813-b9c92c3dc16e.png)

`Duck` 클래스에서는 이제 행동을 직접 처리하는 대신 새로 만든 `performQuck()`, `performFly()` 메소드에서 각각 `FlyBehavior`, `QuackBehavior` 로 참조되는 객체에 그 행동을 위임해 줄것이다.


--- 

## 🛒 정리

### ⚙️ 소스코드

#### `Duck` 추상클래스 구현
```java
public abstract class Duck {

    FlyBehavior flyBehavior;
    QuackBehavior quackBehavior;

    public void swim() {
        System.out.println("물에 떠있습니다.");
    }

    public abstract void display();

    public void performQuack() {
        quackBehavior.quack();
    }

    public void performFly() {
        flyBehavior.fly();
    }

    public void setFlyBehavior(FlyBehavior flyBehavior) {
        this.flyBehavior = flyBehavior;
    }

    public void setQuackBehavior(QuackBehavior quackBehavior) {
        this.quackBehavior = quackBehavior;
    }
}
```

#### `FlyBehavior`, `QuackBehavior` 구현 및 구체적인 행동 클래스 구현
```java
public interface FlyBehavior {
    public void fly();
}

public class FlyWithWings implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("난다!!");
    }
}

public class FlyNoWay implements FlyBehavior {
    @Override
    public void fly() {
        System.out.println("날지못해요.");
    }
}
```

```java
public interface QuackBehavior {
    public void quack();
}

public class Quack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("꿱꿱.");
    }
}

public class Squack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.println("삑삑.");
    }
}

public class MuteQuack implements QuackBehavior {
    @Override
    public void quack() {
        System.out.prinln("조용.");
    }
}
```


#### `Duck`을 상속해 `MallardDuck` 구현

```java
public class MallardDuck extends Duck {
    public MallardDuck() {
        flyBehavior = new FlyWithWings();
        quackBehavior = new Quack();
    }

    @Override
    public void display() {
        System.out.println("청둥오리 입니다.");
    }
}
```

#### 활용
```java
public class MiniDuckSimulator {
    public static void main(String[] args) {
        Duck mallard = new MallardDuck();

        mallard.performQuack();
        mallard.performFly();

        mallard.setFlyBehavior(new FlyNoWay());
        mallard.performFly();
    }
}
```

### 🔎 요약하자면..

> 'A는 B이다' 보다 'A에는 B가 있다'가 나을 수 있다.

각각의 오리들에게는 `FlyBehavior`와 `QuackBehavior`이 있으며 행동을 위임 받는다.

![image](https://user-images.githubusercontent.com/55419159/141429071-35b99838-2961-4ecf-b606-f6358c62d4ec.png)



이런 식으로 두클래스를 합치는 것을 **구성(composition)을 이용하는 것**이라고 한다.

여기의 오리 클래스는 행동을 상속 받는 대신, 올바른 **행동 객체로 구성**됨으로써 행동을 부여받게 된다.