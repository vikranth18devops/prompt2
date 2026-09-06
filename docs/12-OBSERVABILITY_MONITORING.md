# Step 12 - Enterprise Observability & Monitoring Stack

This final step guides freshers through launching and operating the enterprise monitoring stack comprising **Grafana**, **Prometheus**, **Loki**, **Promtail**, and **ELK Stack (Elasticsearch, Logstash, Kibana)**.

---

## 📊 Monitoring Architecture & Service Matrix

```
[ Next.js Application / Azure Services ]
                 |
                 +---> Metric Telemetry ---> [ Prometheus (9090) ] ---> [ Grafana (3001) ]
                 |
                 +---> System & Container Logs ---> [ Loki (3100) ] ---+
                 |
                 +---> Application Logs ---> [ Logstash (5000) ] ---> [ Elasticsearch (9200) ] ---> [ Kibana (5601) ]
```

---

## 📊 Access Credentials & Web Dashboards

| Service | Access URL | Default User | Default Password | What it Monitors |
| :--- | :--- | :--- | :--- | :--- |
| **Grafana** | `http://localhost:3001` | `admin` | `adminpassword123` | CPU, RAM, HTTP request rates, active connections |
| **Prometheus** | `http://localhost:9090` | None | None | Raw metrics database & alert manager |
| **Kibana (ELK)** | `http://localhost:5601` | None | None | Centralized application log analysis & visualization |
| **Loki** | `http://localhost:3100` | None | None | Log aggregation data provider for Grafana |

---

## 🚀 Execution Commands

### Step 1: Launch the Monitoring Stack
```bash
npm run monitoring:up
```

### Step 2: Check Container Health
```bash
docker ps --filter "name=monitoring"
```

### Step 3: Access Grafana Dashboard
1. Open [`http://localhost:3001`](http://localhost:3001) in your web browser.
2. Log in using `admin` / `adminpassword123`.
3. View pre-configured dashboards: **AI Studio Telemetry**, **Node Exporter Host Health**, and **Loki Logs visualizer**.

### Step 4: Stop the Monitoring Stack
```bash
npm run monitoring:down
```

---

## 🎉 Congratulations! You Have Completed the Full End-to-End Deployment Process!

You have successfully learned and configured:
1. **Local Setup & System Architecture** (Steps 01 - 03)
2. **Local Multi-Container Dockerization** (Step 04)
3. **Azure Infrastructure as Code with Terraform** (Steps 05 - 08)
4. **Container Registry & Kubernetes GitOps** (Steps 09 - 11)
5. **Production Monitoring & Observability** (Step 12)
