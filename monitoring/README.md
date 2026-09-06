# Enterprise Observability & Monitoring Stack

Complete observability suite featuring **Grafana**, **Prometheus**, **Loki**, **Promtail**, and **ELK Stack (Elasticsearch, Logstash, Kibana)** for the AI Image Studio application.

---

## 📊 Monitoring Components & Access Ports

| Tool | Port | Purpose | Default Credentials |
| :--- | :--- | :--- | :--- |
| **Grafana** | `http://localhost:3001` | Visual Dashboards & Alerting | User: `admin` / Password: `adminpassword123` |
| **Prometheus** | `http://localhost:9090` | Time-Series Metrics Collector & Alert Rules | N/A |
| **Kibana (ELK)** | `http://localhost:5601` | Elasticsearch Log Visualization & Analytics | N/A |
| **Loki** | `http://localhost:3100` | Log Aggregation Engine | N/A |
| **Logstash** | `tcp:50000` / `udp:5000` | Pipeline Log Processor | N/A |
| **Elasticsearch** | `http://localhost:9200` | Log Indexing Database Engine | N/A |
| **cAdvisor** | `http://localhost:8080` | Container Resource Metrics | N/A |
| **Node Exporter**| `http://localhost:9100` | Host Machine Resource Metrics | N/A |

---

## 📁 Monitoring Directory Structure (`monitoring/`)

```
monitoring/
├── docker-compose.monitoring.yml     # Complete Observability Stack Compose File
├── prometheus/
│   ├── prometheus.yml                 # Prometheus Scrape Targets & Health Probes
│   └── alert.rules.yml                # Alert rules for CPU/Memory/Downtime
├── grafana/
│   ├── datasources.yml                # Pre-configured Prometheus, Loki & ES datasources
│   ├── dashboards.yml                 # Provisioning provider config
│   └── dashboards/
│       └── ai-studio-dashboard.json   # Pre-built AI Studio Grafana Dashboard
├── loki/
│   └── loki-config.yml                # Loki log engine configuration
├── promtail/
│   └── promtail-config.yml            # Docker container log scraping collector
└── elk/
    └── logstash/
        └── pipeline/
            └── logstash.conf          # Logstash JSON pipeline definition
```

---

## 🚀 How to Launch the Observability Stack

### 1. Start All Observability Services
```bash
docker-compose -f monitoring/docker-compose.monitoring.yml up -d
```

### 2. View Running Monitoring Containers
```bash
docker-compose -f monitoring/docker-compose.monitoring.yml ps
```

### 3. Open Grafana Dashboards
Open `http://localhost:3001` in your browser. Log in with:
- **Username**: `admin`
- **Password**: `adminpassword123`

Select the pre-provisioned **AI Image Studio Production Dashboard**!

### 4. Open Kibana (ELK) Interface
Open `http://localhost:5601` in your browser to inspect raw JSON application logs in Elasticsearch.

---

## 🛑 Stop Observability Stack
```bash
docker-compose -f monitoring/docker-compose.monitoring.yml down
```
