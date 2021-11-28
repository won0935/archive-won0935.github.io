---
title: 옵저버 패턴 
categories:
  - 디자인패턴 
tags:
  - 디자인패턴
  - 옵저버
---

## 🔭 옵저버 패턴이란

> 옵저버 패턴(observer pattern)은 객체의 상태 변화를 관찰하는 **관찰자**들,
> 즉 옵저버들의 목록을 객체에 등록하여 **상태 변화가 있을 때마다** 메서드 등을 통해 객체가 직접 목록의 각 **옵저버에게 통지하도록** 하는 디자인 패턴이다.

### 클래스 다이어그램

![image](https://user-images.githubusercontent.com/55419159/141607954-d5fd0a63-b644-4e8d-8004-5af5dc53da83.png)

옵저버 패턴은 주제와 옵저버가 **느슨하게** 결합되어 있는 객체 디자인을 제공한다. 주제가 옵저버에 대해서 아는 것은 옵저버가 특정 인터페이스(Observer 인터페이스)를 구현 한다는 것 뿐이다.

- 옵저버는 언제든지 새로 추가할 수 있음. (주제는 Observer인터페이스 구현하는 객체 목록에만 의존하기때문)
- 새로운 형식의 옵저버를 추가하려해도 주제를 전혀 변경할 필요가 없음. (새로운 클래스에서 Observer 인터페이스만 구현해주면됨)
- 주제나 옵저버가 바뀌더라도 서로에게 전혀 영향을 주지않음. 그래서 주제와 옵저버는 서로 독립적으로 재 사용할수 있음.

느슨하게 결합하는 디자인을 사용하면 변경 사항이 생겨도 무난히 처리할 수 있는 유연한 객체지향 시스템을 구축할수 있다. (객체 사이의 상호 의존성을 최소화 할 수 있기 때문)

### 디자인 원칙

> 서로 상호작용을 하는 객체 사이에서는 가능하면 **느슨하게 결합**하는 디자인을 사용해야 한다.

---

## 활용예제

### ☀️ 기상데이터 관찰

날씨 데이터를 가지고 있는 회사와 데이터를 연동하여 여러종류의 각각의 디스플레이에 날씨데이터를 출력해줘야 하는 업무가 생겼다고 가정했을때. 아래의 기능이 필요하다.

```java
getTemperature():온도

        getHumidity():습도

        getPressure():기압

        measurementsChanged():새로운 기상 측정 데이터가 나올때마다 자동으로 호출되는 부분.
```

### 1. 옵저버 패턴 구현해보기

![image](https://user-images.githubusercontent.com/55419159/141608207-0b9249cf-e475-4169-97c1-7c7d3e7a92a0.png)

#### `Subject` 인터페이스 구현

```java
public interface Subject {
    void registerobserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}
```

#### `Observer` 인테페이스 구현

```java
public interface Observer {
    void update(float temp, float humidity, float pressure);
}

public interface DisplayElement {
    void display();
}
```

#### `Subject`를 구현하는 `WeatherData` 생성

```java
public class WeatherData implements Subject {

    private List<Observer> observers = new ArrayList<>();
    private float temperature;
    private float humidity;
    private float pressure;

    public void measurementsChanged() {
        this.notifyObservers();
    }

    public void setMeasurementsChanged(float t, float h, float p) {    //값이 세팅된다고 가정.
        this.temperature = t;
        this.humidity = h;
        this.pressure = p;
        this.measurementsChanged();
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(this.temperature, this.humidity, this.pressure);
        }
    }

    @Override
    public void registerobserver(Observer observer) {
        this.observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        if (observers.contains(observer)) observers.remove(observer);
    }
}
```

#### `Observer`를 구현하는 `CurrentConditions` 생성

```java
public class CurrentConditions implements Observer, DisplayElement {

    private float temperature;
    private float humidity;
    private Subject weatherData;

    public CurrentConditions(Subject weatherData) {
        this.weatherData = weatherData;
        this.weatherData.registerobserver(this);    //옵저버 등록
    }

    @Override
    public void display() {
        System.out.println("Current conditions : " + temperature + " , " + humidity);
    }

    @Override
    public void update(float temp, float humidity, float pressure) {
        this.temperature = temp;
        this.humidity = humidity;
        this.display();
    }
}
```

#### 테스트

```java
public class WeatherStation {
    public static void main(String[] args) {

        WeatherData weatherData = new WeatherData();

        CurrentConditions currentConditions = new CurrentConditions(weatherData);
        StatisticsDisplay statisticsDisplay = new StatisticsDisplay(weatherData);
        ForecastDisplay forecastDisplay = new ForecastDisplay(weatherData);

        weatherData.setMeasurementsChanged(85, 62, 36.7f);
    }
}
```

### 2. 자바 내장 옵저버 패턴 사용

`java.util.Observer` 인터페이스와 `java.util.Observable` 클래스를 사용할수 있다.

![image](https://user-images.githubusercontent.com/55419159/141608538-b814feab-5924-497c-bfb4-885ff8473279.png)

#### `java.util.Observable`를 구현한 `WeatherData` 생성

- 이전에 구현 했던것과 마찬가지로 `java.util.Observer` 인터페이스를 구현하고 `java.util.Observable` 객체의
`addObserver()` 메소드를 호출하면 옵저버 목록에 추가되고, `deleteObserver()`를 호출하면 옵저버 목록에서 제거된다.

- **연락을 돌리는 방법**은 `java.util.Observable`를 상속받는 주제 클래스에서 `setChanged()` 메소드를 호출해서 객체의 상태가 바뀌었다는 것을 알린 후 `notifyObservers()` 또는 `notifyObserver(Object arg)` 메소드를 호출하면 된다. (인자값을 넣어주는 메소드는 푸시방식으로 쓰임.)

```java
public class WeatherData extends Observable {
    private float temperature;
    private float humidity;
    private float pressure;

    public void measurementsChanged() {
        this.setChanged();    //상태가 바뀌었다는 플래그값을 바꿔줌.
        this.notifyObservers(); //풀 방식을 사용해서 알림
    }

    public void setMeasurementsChanged(float t, float h, float p) {    //값이 세팅된다고 가정.
        this.temperature = t;
        this.humidity = h;
        this.pressure = p;
        this.measurementsChanged();
    }

    public float getTemperature() {
        return temperature;
    }
    public float getHumidity() {
        return humidity;
    }
    public float getPressure() {
        return pressure;
    }
}
```

#### `java.util.Observer`를 구현한 `CurrentConditions` 생성

- 옵저버 객체가 **연락을 받는 방법**은 `update(Observable o, Object arg)` 메소드를 구현한다.
- `Observable o` 에는 연락을 보내는 주제 객체가 인자로 전달되고, `Object arg` 에는 `notifyObservers(Object arg)` 메소드에서 인자로 전달된 데이터 객체가 넘어온다. (데이터 객체가 지정되지 않은경우 `null`)

```java
public class CurrentConditions implements Observer, DisplayElement {
    private Observable observable;
    private float temperature;
    private float humidity;

    public CurrentConditions(Observable observable) {
        this.observable = observable;
        this.observable.addObserver(this);
    }

    @Override
    public void display() {
        System.out.println("Current conditions : " + temperature + " , " + humidity);
    }

    @Override
    public void update(Observable o, Object arg) {
        if (o instanceof WeatherData) {
            WeatherData weatherData = (WeatherData) o;
            this.temperature = weatherData.getTemperature();
            this.humidity = weatherData.getHumidity();
            this.display();
        }
    }
}
```

#### `java.util.Observable` 의 단점

1. `Observable` 은 클래스이기 때문에 **서브클래스**를 만들어야 한다. 이미 다른 수퍼클래스를 확장하고 있는 클래스에 `Observable`의 기능을 추가할수가 없어서 **재사용성에 제약**이 생긴다.
2. `Observable` 인터페이스라는 것이 없기 때문에 자바에 내장된 Observer API 하고 잘 맞는 클래스를 직접 구현하는 것이 불가능하다.

--- 

## 결론

`java.util.Observable`을 확장한 클래스를 쓸 수 있는 상황이면
`Observable API`를 쓰는 것도 괜찮지만 상황에 따라 직접 구현해야 할수도 있다.

어떤방법을 쓰든 옵저버 패턴만 제대로 알고 있다면 그 패턴을 활용하는 API는 어떤 것이든 잘 활용할 수 있다.