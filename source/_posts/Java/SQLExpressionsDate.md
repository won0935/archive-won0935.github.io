---
title: QueryDSL 에서 mySQL date() 함수 사용
categories:
  - QueryDSL
tags:
  - QueryDSL
  - mySQL
  - SQLExpressions
---

- `SQLExpressions.date()` 을 사용하면 된다.

```java
import com.querydsl.sql.SQLExpressions;
SQLExpressions.date(QTable.table.date)
```

출처
https://stackoverflow.com/questions/24531957/mysql-date-function-in-querydsl
