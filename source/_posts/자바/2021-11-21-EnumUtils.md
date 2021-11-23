---
title: EnumUtils
categories:
  - 자바
tags:
  - 자바
  - Util
  - Enum
---

# EnumUtils

- `apache.commons`의 `EnumUtils`를 상속받음
- `StringUtils`의 `defaultIfEmpty()` 메소드와 비슷하게 만들었음
- wildcard로 동적으로 파라미터를 정함
- `<T extends 제한타입>` => 제너릭타입의 상한 제한. 제한타입과 그 자손(타입)들만 가능

```java
public class EnumUtils extends org.apache.commons.lang.enums.EnumUtils {
	
		public static <E extends Enum> E defaultIfEmpty(E value, E defalutValue) {
				return vlaue == null ? defaultValue : value;
		}

}
```