---
title: "[Lock] 동시성이슈에 대한 해결 방법"
date: '2023-01-03' 
category: 'spring' 
description: ''
emoji: '🔒'
---

# 요약

- **Redis** 가 **DB락**보다 성능이 좋음
- **pub-sub** 방식인 `Redisson` 라이브러리를 자주 사용하는 추세임
- 단, Redis 운영비용이 따로 발생되는 단점이 있음

## 동시성 이슈를 해결하는 방법

1. **소스코드**
    - `syncronized` 명령어
2. **데이터베이스**
    - Pessimistic Lock(비관적 락)
    - Optimisitic Lock(낙관적 락)
3. **레디스(Redis)**
    - `Lettuce`
    - `Redisson`

---

# **소스코드** 에서 동시성 이슈 해결

## `syncronized` 사용

#### 코드

```kotlin
 fun decrease(id: Long, quantity: Long) {
    synchronized(this) { //스레드를 하나만 사용
        val stock = stockRepository.findByIdOrNull(id) ?: throw EntityNotFoundException()
        stock.decrease(quantity)
        stockRepository.saveAndFlush(stock)
    }
}
```

#### 문제점

서버가 1대일 때는 되는듯 싶으나 **여러대의 서버**를 사용하게 되면 사용하지 않았을 때와 동일한 **문제**가 발생된다. 인스턴스 단위로 thread-safe 이 보장이 되고, 여러 서버가 된다면 여러개의
인스턴스가 있는 것과 동일하기 때문이다. 위 이유로 **실무에서는 사용되지 않는다**.

---

# **데이터베이스** 에서 동시성 이슈 해결

## Pessimistic Lock(비관적 락)

#### 코드

```kotlin
 @Lock(LockModeType.PESSIMISTIC_WRITE) //비관락 사용
@Query("select s from Stock s where s.id = :id")
fun findByIdWithPessimisticLock(id: Long): Stock
```

#### 설명

- **선점 잠금**이라고 불리기도 함
- 트랜잭션끼리의 **충돌이 발생한다고 가정**하고 우선 락을 거는 방법
- **DB에서 제공하는 락기능**을 사용

#### `LockModeType` 옵션

- `PESSIMISTIC_WRITE`
  - 일반적인 옵션. 데이터베이스에 쓰기 락
  - 다른 트랜잭션에서 **읽기도 쓰기도 못함** (배타적 잠금), 
  - `SELECT FOR ~ UPDATE` 로 쿼리가 나감
- `PESSIMISTIC_READ`
  - 반복 읽기만하고 수정하지 않는 용도로 락을 걸 때 사용
  - 다른 트랜잭션에서 **읽기는 가능함** (공유 잠금)

## Optimisitic Lock(낙관적 락)

#### 코드

```kotlin
@Lock(LockModeType.OPTIMISTIC) // 낙관락 사용
@Query("select s from Stock s where s.id = :id")
fun findByIdWithOptimisticLock(id: Long): Stock
```

```kotlin
@Entity
class Stock(
    val id: Long = 0L,
    /* 생략 */

    @Version //긍정락
    val version: Long = 0L,
) 
```

#### 설명

- 데이터 갱신 시 **충돌이 발생하지 않을 것이라고 가정**함
- 데이터 수정에 대해 충돌이 났을 경우 후에 업데이트 한 사람의 **변경 사항은 무시**됨
- 다른 트랜잭션이 해당 데이터를 변경하지 않을 경우 변경

### 주의사항
- 낙관락 위배 시 `OptimisticLockException` 발생
- **별도의 처리**가 필요함

---

# **레디스(Redis)** 에서 동시성 이슈 해결

## Lettuce

- `setnx` 명령어를 활용해 분산락 구현
- **스핀락** 방식 

#### 코드

```kotlin
@Component
class RedisLockRepository(
    private val redisTemplate: RedisTemplate<String, String>
) {

    fun lock(key: Long): Boolean {
        return redisTemplate
            .opsForValue()
            .setIfAbsent(generateKey(key), "lock", Duration.ofMillis(3_000))
            ?: throw RedisException("")
    }

    fun unlock(key: Long) {
        redisTemplate.delete(generateKey(key))
    }

    fun generateKey(key: Long): String {
        return key.toString()
    }
}
```
```kotlin
@Component
class LettuceLockStockFacade(
    private val redisLockRepository: RedisLockRepository,
    private val stockService: StockService
) {

    @Transactional
    fun decrease(id: Long, quantity: Long) {

        while (!redisLockRepository.lock(id)){
            Thread.sleep(100)  //락잡음
        }

        try {
            stockService.decrease(id, quantity)
        } finally {
            redisLockRepository.unlock(id) //락품
        }
    }
}
```

## Redisson

- `pub-sub` 기반으로 분산락 구현


#### 코드

```kotlin
implementation("org.redisson:redisson:3.19.0") //redisson 라이브러리 추가
```
```kotlin
@Component
class RedissonLockStockFacade(
    private val redissonClient: RedissonClient,
    private val stockService: StockService
) {

    fun decrease(id : Long, quantity: Long)
    {
        val lock = redissonClient.getLock(id.toString()) //락잡음

        try {
            val available = lock.tryLock(5, 1, TimeUnit.SECONDS)

            if(!available){
                println("락 획득 실패")
                return
            }

            stockService.decrease(id, quantity)
        } catch (e : InterruptedException){
            throw RuntimeException()
        } finally {
            lock.unlock() //락품
        }

    }
}
```

## 장단점

- `Lettuce`
  - 구현이 간단하다
  - `spring data redis` 를 이용하면 lettuce 가 기본이기 때문에 **별도의 라이브러리를 사용하지 않아도** 된다
  - **spin lock 방식**이기때문에 동시에 많은 스레드가 lock 획득 대기 상태라면 **redis 에 부하**가 갈 수 있다

- `Redisson`
  - 락 획득 **재시도**를 기본으로 제공한다
  - **pub-sub 방식**으로 구현이 되어있기 때문에 lettuce 와 비교했을 때 redis 에 부하가 덜 간다
  - **별도의 라이브러리**를 사용해야한다
  - lock 을 라이브러리 차원에서 제공해주기 떄문에 사용법을 공부해야 한다


## 실무에서는 ?
- 재시도가 필요하지 **않은** lock 은 `Lettuce` 활용
- 재시도가 **필요한** 경우에는 `Redisson` 를 활용
