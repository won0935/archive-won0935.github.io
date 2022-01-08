---
title: "[다자인패턴] 팩토리 패턴"
date: '2021-10-28'
category: 'design-pattern'
description: ''
emoji: '🏭'
---


## ⛳ 들어가기 전에..

회사에서 같은 프로세스 내에서 각각의 제휴사에 서비스를 인터페이스해야 하는 경우가 있었다.

전체적인 프로세스 플로우를 인터페이스로, 제휴사를 클래스(Bean)로 만들어 팩토리 패턴으로 구현하였다.

동일한 프로세스 플로우 내에서 각기 다른 제휴사의 API와 연동해야 했는데 팩토리 패턴이 많은 도움이 되었다.

---

## 👋 팩토리패턴이란

### ⚾ 팩토리 메소드 패턴

> 객체를 생성하기 위한 인터페이스를 정의하는데,
> 어떤 클래스의 인스턴스를 만들지는 서브클래스에서 결정하게 만든다.
> 즉, 팩토리 메소드 패턴을 이용하면 **클래스의 인스턴스를 만드는 일을 서브클래스에게 맡기는 것**.

### 🥎 추상 팩토리 패턴

> **인터페이스를 이용**하여 서로 연관된,
> 또는 의존하는 객체를 구상 클래스를 지정하지 않고도 생성한다.

---

## 🎩 팩토리패턴이 필요한 이유

`new`를 사용하는 것은 구상 클래스의 인스턴스를 만드는 것이다. 당연히! 인터페이스가 아닌 _특정 구현을 사용하게 되어버리는 것_. 일련의 구상 클래스들이 있을때는 어쩔수 없이 다음과 같은 코드를 만들어야 하는
경우가 있다.

```java
Duck duck;

        if(type==picnic)duck=new MallardDuck();
        else if(type==hunting)duck=new DecoyDuck();
        else if(type==inBathTub)duck=new RubberDuck();
```

이런 코드가 있다는 것은, 뭔가 변경하거나 확장해야 할 때 *코드를 다시 확인하고 추가 또는 제거해야 한다는 것*을 의미한다.
**인터페이스**에 맞춰서 코딩을 하면 시스템에서 일어날 수 있는 여러 변화를 이겨낼 수 있다.
**다형성** 덕분에 어떤 클래스든 특정 인터페이스만 구현하면 사용할수 있기 때문이다.

반대로. 구상 클래스를 많이 사용하면 새로운 구상 클래스가 추가될 때마다 코드를 고쳐야 하기때문에 많은 문제가 생길수 있다. 즉, *변화에 대해 닫혀 있는 코드*가 되어버리는 것이다.

> 바뀔 수 있는 부분을 찾아내서 바뀌지 않는 부분하고 분리시켜야 한다는 원칙.

---

## 🎢 고전적인 팩토리 패턴

- **피자 가게**를 운영하고 있고 **피자가게 클래스**를 만들어야 된다고 가정한다.

> 피자가게는 다양한 피자가 있을 수 있다.
> 또한 다양한 피자가게가 있을 수 있다.

### 🎞 기존소스

```java
Pizza orderPizza(String type){

        Pizza pizza;

        //추가하거나 제거 시 매번 바뀌어야 하는부분
        if(type.equals("cheese"))pizza=new CheesePizza();
        else if(type.equals("greek"))pizza=new GreekPizza();
        else if(type.equals("pepperoni"))pizza=new PepperoniPizza();
        //

        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();
        return pizza;
        }
```

### 1. 피자 팩토리를 만든다.

```java
 public class SimplePizzaFactory {

    public Pizza createPizza(String type) { //이런 경우에는 static메소드로 선언하는 경우가 종종 있음.

        Pizza pizza = null;

        if (pizza.equals("cheese")) pizza = new CheesePizza();
        if (pizza.equals("pepper")) pizza = new PepperoniPizza();
        if (pizza.equals("clam")) pizza = new ClamPizza();
        if (pizza.equals("veggie")) pizza = new VeggiePizza();

        return pizza;
    }
}
```

### 2. 피자 가게를 만든다.

```java

public class PizzaStore {

    SimplePizzaFactory simplePizzaFactory;

    public PizzaStore(SimplePizzaFactory simplePizzaFactory) {
        this.simplePizzaFactory = simplePizzaFactory;  //피자 가게를 동적으로 설정
    }

    public Pizza orderPizza(String type) {

        Pizza pizza;
        pizza = simplePizzaFactory.createPizza(type); //수정 안해도 됨
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;

    }
}
```

### 3. 다양한 피자가게가 생긴다.

```java
 PizzaStore nyStore=new PizzaStore(new NYPizzaFactory());
        nyStore.orderPizza("cheese");

        PizzaStore chicagoStore=new PizzaStore(new ChicagoPizzafactory());
        chicagoStore.orderPizza("cheese");
```

- 각 피자가게에서 `orderPizza()` 만 호출하면 피자를 생성할 수 있게 되었다.

> 그러나, 각 팩토리를 가진 피자가게 체인점들이 서로의 구현방식이 달라지는 일이 발생할수도 있게 되었다.
> (PizzaStore가 각각 있다보니 굽는 방식이 달라진다거나 피자를 자르는 단계를 빼먹거나 하는..)

---

## 🎟 팩토리 메소드 패턴

> 피자가게와 피자 **제작 과정 전체를 하나로 묶어주는 프레임워크**를 만들어야 된다는 결론!!
> 파자를 만드는 활동 자체는 전부 PizzaStore 클래스에 국한시키면서도 분점마다 고유의 스타일을 살릴 수 있는 방법은 ??

### 4. 피자가게를 묶는 추상 클래스를 만든다. (프렌차이즈 본사랄까..)

```java
public abstract class PizzaStore { //추상 클래스로 구현

    public Pizza orderPizza(String type) {

        Pizza pizza;
        pizza = createPizza(type);
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();

        return pizza;
    }

    abstract Pizza createPizza(String type); //Pizza 인스턴스를 만드는 일은 팩토리 역할을 하는 메소드에서 맡아 처리
}
```

### 5. 각 피자가게에서 추상클래스(본사)를 상속받게 한다.

이제 각 분점을 위한 지역별로 서브클래스를 만들어줘야 한다. 피자의 스타일은 각 서브클래스에서 결정.

![image](https://user-images.githubusercontent.com/55419159/139077742-76ac1027-09c3-4e42-8046-82a2b4e0cb54.jpg)

이제 `ChicagoPizzaStore`, `NYPizzaStore` 에는 구상 피자클래스를 분기해주는 각각의 `createPizza()` 메소드가 있다.

```java
public class NYPizzaStore extends PizzaStore {

    @Override
    public Pizza createPizza(String type) {

        Pizza pizza = null;
        if (type.equals("cheese")) pizza = new NYStyleCheesePizza();
        if (type.equals("peper")) pizza = new NYStylePepperoniPizza();
        if (type.equals("clam")) pizza = new NYStyleClamPizza();
        if (type.equals("veggie")) pizza = new NYStyleVeggiePizza();

        return pizza;
    }
}

public class ChicagoPizzaStore extends PizzaStore {

    @Override
    public Pizza createPizza(String type) {

        Pizza pizza = null;
        if (type.equals("cheese")) pizza = new ChicagoStyleCheesePizza();
        if (type.equals("peper")) pizza = new ChicagoStylePepperoniPizza();
        if (type.equals("clam")) pizza = new ChicagoStyleClamPizza();
        if (type.equals("veggie")) pizza = new ChicagoStyleVeggiePizza();

        return pizza;
    }
} 
```

### 6. 피자 추상클래스를 만든다.(순수한 피자 그 자체)

```java
public abstract class Pizza {
    String name;
    String dough;
    String sauce;
    ArrayList<String> toppings = new ArrayList<>();

    public void prepare() {
        System.out.println("Preparing : " + name);
        System.out.println("Tossing dough...");
        System.out.println("Adding source");
        System.out.println("Adding toppings");
        for (String topping : toppings) {
            System.out.println("\ttopping : " + topping);
        }
    }

    public void bake() {
        System.out.println("Bake for 25 minutes at 350");
    }

    public void cut() {
        System.out.println("Cutting the pizza into diagonal slices");
    }

    public void box() {
        System.out.println("Place pizza in official PizzaStore box");
    }

    public String getname() {
        return this.name;
    }

}
```

### 7. 다양한 피자를 만들어 피자 추상클래스를 상속한다.

```java
public class NYStyleCheesePizza extends Pizza {

    public NYStyleCheesePizza() {
        this.name = "NY Style CheesePizza";
        this.dough = "Thin Crust Dough";
        this.sauce = "Marinara Sauce";
        this.toppings.add("Grated Reggiano Cheese");
    }
}

public class ChicagoStyleCheesePizza extends Pizza {

    public ChicagoStyleCheesePizza() {
        this.name = "Chicago Style CheesePizza";
        this.dough = "Extra Thick Crust Dough";
        this.sauce = "Plum Tomato Sauce";
        this.toppings.add("Shredded mozzarella Cheese");
    }

    @Override
    public void cut() {
        System.out.println("Cutting the pizza into square slices");
    } //바꾸고 싶은 메소드만 오버라이딩
}
```

### 8. 피자를 주문한다.

```java
 public class PizzaTestDrive {

    public static void main(String[] args) {

        PizzaStore nyStore = new NYPizzaStore();
        PizzaStore chicagoStore = new ChicagoPizzaStore();

        Pizza nySytpePizza = nyStore.orderPizza("cheese");
        System.out.println(nySytpePizza.getname());

        Pizza chicagoStypePizza = chicagoStore.orderPizza("cheese");
        System.out.println(chicagoStypePizza.getname());
    }
} 
```

- 모든 팩토리 패턴에서는 **객체 생성을 캡슐화** 한다.
- 팩토리 메소드 패턴에서는 *서브 클래스에서 어떤 클래스를 만들지를 결정하게 함*으로써 객체 생성을 캡슐화 한다.


- 생산자 클래스(피자가게)

![image2](https://user-images.githubusercontent.com/55419159/139077751-6a262811-5faf-4937-b7f1-5fb3447d8b90.jpg)

- 제품 클래스(피자)

![image3](https://user-images.githubusercontent.com/55419159/139077752-b27d2d2f-57fb-4226-bab6-f890d0f70a74.jpg)

위 클래스 다이어그램에서는 `PizzaStore` 추상 클래스에서 객체를 만들기 위한 메소드, 즉 팩토리 메소드를 위한 인터페이스를 제공한다는 것을 알수있다.

`PizzaStore`에 구현되어 있는 다른 메소드 `orderPizza()` 에서는 팩토리 메소드에 의해 생산된 제품을 가지고 필요한 작업을 처리한다. 하지만 실제 팩토리 메소드를 구현하고 제품(객체 인스턴스)을
만들어 내는 일은 **서브클래스**에서만 할수 있다.


---

## 🎭 디자인원칙 : 의존성 뒤집기 원칙

> 추상화된 것에 의존하도록 만들어라. 구상 클래스에 의존하도록 만들지 않도록 한다.

~~구현클래스에 의존하는 형태~~

```java
PizzaStore->NYStyleCheesePizza
        PizzaStore->ChicagoStypeCheesePizza
        PizzaStore->NYStyleVeggiePizza
```

~~-> 좋지않음~~

추상클래스(인터페이스)를 의존하는 형태

```java
PizzaStore->Pizza
        Pizza<-NYStyleCheesePizza
        Pizza<-ChicagoStyleCheesePizza
        Pizza<-NYStyleVeggiePizza
```

-> **좋음**

### 🛒 원칙에 도움이 되는 가이드

_**1. 어떤 변수에도 구상 클래스에 대한 레퍼런스를 지정하지 않는다.**_

- `new` 연산자를 사용하면 레퍼런스를 사용하게 되는 것이다.

_**2. 구상 클래스에서 유도된 클래스를 만들지 않는다.**_

- 구상클래스에서 유도된 클래스를 만들면 특정 구상 클래스에 의존하게된다, 추상화 된 것을 사용해야 한다.

_**3. 베이스 클래스에 이미 구현되어 있던 메소드를 오버라이드 하지 않는다.**_

- 이미 구현되어 있는 메소드를 오버라이드 한다는 것은 애초부터 베이스 클래스가 제대로 추상화 된것이 아니었다고 볼 수 있다.
- 베이스 클래스에서 메소드를 정의할 때는 모든 서브 클래스에서 공유할 수 있는 것만 정의해야한다.

---

## 🦺 추상 팩토리 패턴

이렇게 PizzaStore 디자인이 모양새를 갖췄다. 유연한 프레임워크도 만들어 졌고, 디자인 원칙도 충실하게 지켰다.

각각 체인점들이 미리 정해놓은 절차를 잘 따르고 있지만 몇몇 체인점들이 자잘한 재료를 더 싼 재료로 바꿔서 원가를 절감해 마진을 남기고 있다.

원재료의 품질까지 관리하는 방법이 있을까??

- **원재료 군**을 만들어 파악하자.
- 제품에 들어가는 재료군(반죽, 소스, 치즈, 야채, 고기)은 같지만, 지역마다 재료의 구체적인 내용이 조금씩 다르다.


1. 지역별로 팩토리를 만들어 각 생성 메소드를 구현하는 `PizzaingredientFactory` 클래스를 만든다.
2. `ReggianoCheese`, `RedPeppers`, `ThickCrustDough`와 같이 팩토리에서 사용할 원재료 클래스들을 구현한다.
3. 만든 원재료 공장을 `PizzaStore` 코드에서 사용하도록 함으로써 하나로 묶어준다.

### 9. 원재료 공장을 만든다.

```java
 public interface PizzaIngredientFactory {
    public Dough createDough();

    public Sauce createSauce();

    public Cheese createCheese();

    public Veggies[] createVeggies();

    public Pepperoni createPepperoni();

    public Clams createClams();
} 
```

```java
public class NYPizzaingredientFactory implements PizzaIngredientFactory {

    @Override
    public Dough createDough() {
        return new ThinCrustdough();
    }

    @Override
    public Sauce createSauce() {
        return new MarinaraSauce();
    }

    @Override
    public Cheese createCheese() {
        return new ReggianoCheese();
    }

    @Override
    public Veggies[] createVeggies() {
        Veggies veggies[] = {new Farlic(), new Onion(), new Mushroom(), new RedPepper()};
        return veggies;
    }

    @Override
    public Pepperoni createPepperoni() {
        return new SlicedPepperoni();
    }

    @Override
    public Clams createClams() {
        return new Freshclams();
    }
}


public class ChicagoPizzaingredientFactory implements PizzaIngredientFactory {

    @Override
    public Dough createDough() {
        return new ThickCrustDough();
    }

    @Override
    public Sauce createSauce() {
        return new PlumTomatoSauce();
    }

    @Override
    public Cheese createCheese() {
        return new MozzarellaCheese();
    }

    @Override
    public Veggies[] createVeggies() {
        Veggies veggies[] = {new BlackOlives(), new Spinach(), new EggPlant()};
        return veggies;
    }

    @Override
    public Pepperoni createPepperoni() {
        return new Slicedpepperoni();
    }

    @Override
    public Clams createClams() {
        return new FrozenClam();
    }
}
```

### 10. 피자마다 재료는 다르다.

```java
 public abstract class Pizza {
    String name;
    Dough dough;
    Sauce sauce;
    Veggies veggies[];
    Cheese cheese;
    Pepperoni pepperoni;
    Clams clams;

    public abstract void prepare(); //추상 메소드로 변경됨.

    public void bake() {
        System.out.println("Bake for 25 minutes at 350");
    }

    public void cut() {
        System.out.println("Cutting the pizza into diagonal slices");
    }

    public void box() {
        System.out.println("Place pizza in official PizzaStore box");
    }

    public String getname() {
        return this.name;
    }
} 
```

```java
 public class CheesePizza extends Pizza {

    PizzaIngredientFactory ingredientFactory;

    public CheesePizza(PizzaIngredientFactory ingredientFactory) {
        this.ingredientFactory = ingredientFactory;
    }

    @Override
    public void prepare() {
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
    }
}


public class ClamPizza extends Pizza {

    PizzaIngredientFactory ingredientFactory;

    public ClamPizza(PizzaIngredientFactory ingredientFactory) {
        this.ingredientFactory = ingredientFactory;
    }

    @Override
    public void prepare() {
        this.dough = ingredientFactory.createDough();
        this.sauce = ingredientFactory.createSauce();
        this.cheese = ingredientFactory.createCheese();
        this.clams = ingredientFactory.createClams();
    }
}
```

### 11. 피자마다, 지역마다 다른 피자를 만든다.

```java
 public class NYPizzaStore extends PizzaStore {

    @Override
    public Pizza createPizza(String type) {

        Pizza pizza = null;
        PizzaIngredientFactory ingredientFactory = new NYPizzaingredientFactory();

        if (type.equals("cheese")) {
            pizza = new CheesePizza(ingredientFactory);
            pizza.setName(ingredientFactory.NY_STYLE + " Cheese Pizza");

        } else if (type.equals("peper")) {
            pizza = new PepperoniPizza(ingredientFactory);
            pizza.setName(ingredientFactory.NY_STYLE + " Pepperoni Pizza");

        } else if (type.equals("clam")) {
            pizza = new ClamPizza(ingredientFactory);
            pizza.setName(ingredientFactory.NY_STYLE + " Clam Pizza");

        } else if (type.equals("veggie")) {
            pizza = new VeggiePizza(ingredientFactory);
            pizza.setName(ingredientFactory.NY_STYLE + " Veggie Pizza");
        }

        return pizza;
    }
} 
```

### ⛳ 프로세스 정리

![image4](https://user-images.githubusercontent.com/55419159/139077755-c920f73b-e347-41d4-b1a8-9f0bc5e028fa.jpg)

이제 전체적인 흐름은.

1. 뉴욕 피자가게를 만든다.

```java
PizzaStore nyPizzaStore=new NYPizzaStore();
```

2. 주문을 한다.

```java
nyPizzaStore.orderPizza("cheese");
```

3. orderPizza 메소드에서는 우선 createPizza() 메소드를 호출한다

```java
Pizza pizza=createPizza("cheese");
```

4. createPizza() 메소드가 호출되면 원재료 공장이 돌아가기 시작한다.

```java
Pizza pizza=new CheesePizza(nyIngredientFactory);
```

5. 피자를 준비하는 prepare()메소드가 호출되면 팩토리에 원재료 주문이 들어간다.

```java
void prepare(){
        dough=nyIngredientFactory.createDough();
        sauce=nyIngredientFactory.createSauce();
        cheese=nyIngredientFactory.createCheese();
        }
```

6. 준비단계가 끝나고 orderPizza() 메소드에서는 피자를 굽고, 자르고, 포장한다.

---

## 💎 요약

### 추상 팩토리 패턴

> 제품군을 생성하기 위한 **인터페이스**를 생성하고, 그 **인터페이스를 구성**하여 사용할수 있게끔 하는것.

### 추상 메소드 패턴

> 하나의 추상클래스에서 **추상 메소드**를 만들고, 서브클래스들이 **그 추상메소드를 구현**하여 인스턴스를 만들게끔 하는것.