# Requirement Understanding

The assignment needs a Kubernetes based two-tier application with one service API tier and one database tier. The API tier must expose an endpoint outside the cluster through Ingress and fetch records from the database tier. The API tier should run four pods, support rolling updates, use ConfigMap for externalized configuration, use Secret for the database password, define CPU and memory requests and limits, demonstrate self-healing, and demonstrate HPA. The database tier should run as one pod, stay accessible only inside the cluster, keep data after pod recreation, and recover automatically if its pod is deleted.

# Assumptions

The solution uses Node.js for the service API and PostgreSQL for the database. Docker Hub is used for the API image. Docker Desktop Kubernetes on Windows is used for local execution and recording. Ingress NGINX is used as the Ingress controller. Metrics Server is installed for HPA metrics. Domain mapping is not required because the API can be accessed through localhost on Docker Desktop.

# Solution Overview

The service API is a Node.js Express application. It uses the pg connection pool to connect to PostgreSQL. Database host, port, name, user, pool size, and application port are supplied through a Kubernetes ConfigMap. The database password is supplied through a Kubernetes Secret. The `/api/products` endpoint returns records from the `products` table.

The database is deployed as a PostgreSQL StatefulSet with one replica and a persistent volume claim. The initialization script creates the `products` table and inserts eight records only when the database data directory is created for the first time. The PostgreSQL Service is a ClusterIP service, so it remains internal to the cluster.

The API is deployed as a Kubernetes Deployment with four replicas and RollingUpdate strategy. It is exposed inside the cluster through a ClusterIP Service and outside the cluster through an Ingress resource. Liveness and readiness probes are configured. HPA is configured with a minimum of four replicas and a maximum of eight replicas based on CPU utilization.

# Justification for the Resources Utilized

The API requests start with 100m CPU and 128Mi memory because the service is lightweight and only reads a small table. The API limits are set to 300m CPU and 256Mi memory to avoid unlimited resource usage. The database requests start with 100m CPU and 256Mi memory because PostgreSQL needs more stable memory than the API tier. The database limits are set to 500m CPU and 512Mi memory for a small assignment workload.

The API uses four replicas to satisfy the assignment requirement and provide availability during pod deletion and rolling updates. The database uses one replica because the requirement asks for one database pod and persistence rather than database clustering. The database uses a persistent volume claim so records survive database pod deletion and recreation.

# FinOps Considerations

Right-sized requests and limits prevent unnecessary node allocation and reduce resource waste. HPA allows the API tier to stay at four replicas during normal load and scale only when observed CPU metrics cross the target. ClusterIP is used for internal services to avoid unnecessary load balancer cost. The database uses 1Gi storage for the assignment instead of over-provisioning disk. The cluster can be deleted after recording to avoid any further local or cloud cost.

# Resource Optimization Using Observed Metrics

Run `kubectl top pods -n nagp-assignment` after the application is under normal traffic and again after the load test. If API CPU remains far below the request under normal load, reduce the CPU request gradually from 100m to 75m or 50m and redeploy. If memory is consistently below 128Mi, the memory request can be reduced after confirming there are no restarts. If HPA scales too aggressively, increase averageUtilization from 50 to 60. If API latency increases before scaling happens, reduce averageUtilization from 50 to 40 or increase the CPU request.
