---
title: "[모니터링] Fluentd 를 Prometheus 로 모니터링 하기"
date: '2021-12-17'
category: 'monitoring'
description: ''
emoji: '🔡'
---

## ⛳ 들어가기 전에..
- fluentd는 td-agent 를 사용 

## 📌 Prometheus

Prometheus 플러그인은 총 6개를 제공

![image](https://user-images.githubusercontent.com/55419159/146501113-4abb8f72-23bd-4614-a4f0-57c0a45009a7.png)

### ⚾ 샘플

input plugin 은 promethues 사용해서
server_ip:24231/metrics 를 리스닝 상태로 두고

output plugin은 prometheus_output_monitor 사용해서
10 초마다 promethues 에서 pull 해가도록 한다.

```
<source>
  @type prometheus
  bind 0.0.0.0
  port 24231
  metrics_path /metrics
</source>

<source>
  @type prometheus_output_monitor
  interval 10
  <labels>
    hostname ${hostname}
  </labels>
</source>
```

![image](https://user-images.githubusercontent.com/55419159/146501339-561049d2-7f77-4dd0-8c37-8d1dc77be981.png)
