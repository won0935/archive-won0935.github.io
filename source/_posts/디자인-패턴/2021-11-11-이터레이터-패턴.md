---
title: 이터레이터 패턴 
categories:
  - 디자인패턴 
tags:
  - 디자인패턴
  - 이터레이터
---

## 🎛 이터레이터 패턴이란

> 컬렉션 구현 방법을 **노출시키지 않으면서도**, 그 집합체 안에 들어있는 **모든 항목에 접근할 수 있는 방법**을 제공한다.

컬렉션 객체 안에 들어있는 모든 항목에 **접근하는 방식이 통일되어 있으면** 어떤 종류의 집합체에 대해서도 사용할 수 있는 다형적인 코드를 만들수 있다.

`이터레이터 패턴`을 사용하면 모든 항목에 일일이 접근하는 작업을 컬렉션 객체가 아닌 **반복자 객체**에서 맡게 된다. 
이렇게 하면 집합체의 인터페이스 및 구현이 간단해질 뿐 아니라, 집합체에서는 반복작업에서 손을 떼고 원래 자신이 할 일(객체 컬렉션 관리)에만 전념할 수 있다


---

## 🔎 이터레이터 패턴의 이해

![image](https://user-images.githubusercontent.com/55419159/141257200-343f3e03-e28d-4be6-bc54-9f613d0aaf71.png)


### 🚀 활용 예시

_두개의 서로 다른 식당이있고 각각의 식당에서 메뉴를 구현한다고 가정해보자_

`java.util.Iterator` 인터페이스를 사용해서 `Iterator`를 적용시켜보자.


#### 이터레이트 인터페이스

```java
public interface Menu {
    public Iterator<MenuItem> createIterator();
}
```

#### 인터페이스를 구현하는 객체 생성

```java
public class PancakeHouseMenu implements Menu {

    ArrayList<MenuItem> menuItems; //이 객체는 메뉴들이 ArrayList 이다

    public PancakeHouseMenu() {
        this.menuItems = new ArrayList();
        additem("K&B 팬케이크 세트", "스크램블드 에그와 토스트가 곁들여진 펜케이크", true, 2.99);
        additem("레귤러 팬케이크 세트", "달걀 후라이와 소시지가 곁들여진 펜케이크", false, 2.99);
        additem("블루베리 펜케이크", "신선한 블루베리와 블루베리 시럽으로 만든 펜케이크", true, 3.49);
        additem("와플", "와플, 취향에 따라 블루베리나 딸기를 얹을 수 있습니다.", true, 3.59);
    }

    public void additem(string name, String description, boolean vegetarian, double price) {
        MenuItem menuItem = new MenuItem(name, description, vegetarian, price);
        menuItem.add(menuItem);
    }

    public ArrayList<MenuItem> getMenuItems() {
        return menuItems;
    }

    @Override
    public Iterator<MenuItem> createIterator() {
        return menuItems.iterator(); //ArrayList 컬렉션은 반복자를 리턴하는 iterator() 라는 메소드가 있음.
    }
}


public class DinerMenu implements Menu {
    
    static final int MAX_ITEMS = 6;
    int numberOfItems = 0;
    MenuItem[] menuItems; //이 객체는 메뉴들이 배열 이다

    public DinerMenu() {
        this.menuItems = new MenuItem[MAX_ITEMS];
        additem("채식주의자용 BLT", "통밀 위에 (식물성)베이컨, 상추, 토마토를 얹은 메뉴", true, 2.99);
        additem("BLT", "통밀 위에 베이컨, 상추, 토마토를 얹은 메뉴", false, 2.99);
        additem("오늘의 스프", "감자 샐러드를 곁들인 오늘의 스프", false, 3.29);
        additem("핫도그", "사워크라우트, 갖은 양념, 양파, 치즈가 곁들여진 핫도그", false, 3.05);
    }

    public void additem(string name, String description, boolean vegetarian, double price) {
        MenuItem menuItem = new MenuItem(name, description, vegetarian, price);
        if (nemberOfItems >= MAX_ITEMS) {
            System.err.println("죄송합니다, 메뉴가 꽉 찼습니다. 더 이상 추가할 수 없습니다.");
        } else {
            menuItems[numberOfItems] = menuItem;
            numberOfItems = numberOfItems + 1;
        }
    }

    public MenuItem[] getMenuItems() {
        return menuItems;
    }

    @Override
    public Iterator<MenuItem> createIterator() {
        return new DinerMenujIterator(menuItems);
    }
}
```

#### `java.util.Iterator` 인터페이스를 사용해서 `Iterator` 객체를 구현
```java
public class DinerMenuIterator implements Iterator<MenuItem> {

    Menuitem[] list;
    int position = 0;
    public DinerMenuIterator(MenuItem[] list) {
        this.list = list;
    }

    @Override
    public MenuItem next() {
        MenuItem menuItem = list[position];
        position += 1;
        return menuItem;
    }

    @Override
    public boolean hasNext() {
        if (position >= list.length || list[position] == null) return false;
        else return true;
    }

    @Override
    public void remove() { // 반드시 기능을 제공하지 않아도됨 그렇다면 java.lang.UnsupportedOperationException을 던지도록 하면됨
        if (position <= 0) Throw new IllegalStateException("next()가 한번도 호출되지 않음.");
        if (list[position - 1] != null) {
            for (int i = position - 1; i < (list.length - 1); i++) {
                list[i] = list[i + 1];
            }
            list[list.length - 1] = null;
        }
    }
}

// PancakeHouseMenu 는 ArrayList안에 이미 Iterator 구현되어 있기 때문에 생략해도 된다.
```

#### 클라이언트 객체에서의 활용
```java
public class Waitress { 
    ArrayList<Menu> menus;

    public Waitress(ArrayList<Menu> menus) {
        this.menus = menus;
    }

    public void printMenu() {

        Iterator menuIterator = menus.iterator();
        while (menuIterator.hasNext()) {
            Menu menu = menuIterator.next();
            printMenu(menu.createIterator());
        }
    }

    private void printMenu(Iterator<MenuItem> iterator) { //클라이언트 객체에서의 반복작업이 매우 간단해졌다
        while (iterator.hasNext()) {
            MenuItem menuItem = iterator.next();
            System.out.println(menuItem.getName());
            System.out.println(menuItem.getPrice());
            System.out.println(menuItem.getDescription());
        }
    }
}
```

#### 테스트
```java
public class MenuTestDrive { 
    public static void main(String args[]) {
        ArrayList<Menu> menuList = new ArrayList();
        menuList.add(new PancakeHouseMenu());
        menuList.add(new DinerMenu());
        Waitress waitress = new Waitress(menuList);
        waitress.printMenu();
    }
}
```

> 이제 **집합체 내**에서 어떤 식으로 일이 처리되는 지에 대해서 **전혀 모르는 상태**에서도 그 안에 들어있는 모든 항목들에 대해서 반복작업을 수행할수 있게 되었다.

집합체에서 내부 컬랙션과 관련된 기능과 반복자용 메소드 관련기능을 전부 구현하도록 했다면 어떨까?

우선 클래스에서 원래 그 클래스의 역할(집합체 관리) 외에 다른 역할(반복자 메소드)을 처리하도록 하면, 두 가지 이유로 인해 그 클래스가 바뀔 수 있게 된다.

1. 컬렉션이 어떤 이유로 인해 바뀌게 되면 그 클래스의 **소스코드**를 바꿔야 한다. 
2. **반복자 관련 기능**이 바뀌었을 때도 클래스가 바뀌여야 한다.

---

## 🛡 디자인 원칙

> _클래스를 바꾸는 이유는 **한 가지** 뿐이어야 한다._

 **클래스를 고치는 것은 최대한 피해야 한다.**

 때문에 코드를 변경할 만한 이유가 두가지가 되면 그만큼 그 클래스를 나중에 고쳐야 할 가능성이 커지게 될 뿐 아니라, 디자인에 있어서 두 가지 부분이 동시에 영향이 미치게 된다.
 
이 원칙에 따르면 **한 역할은 한 클래스에서만** 맡게 해야 한다.
