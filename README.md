# NAGP Kubernetes DevOps FinOps Assignment

## Repository URL

```text
https://github.com/AmanChhing/nagp-kubernetes-assignment
```
## Docker Hub Image

```text
docker pull amanching7/nagp-products-api:1.0.0

```

## Docker Hub URL

Replace this after pushing the API image.

```text
https://hub.docker.com/r/amanching7/nagp-products-api
```

## Service API URL

For Docker Desktop Kubernetes with Ingress NGINX:

```text
http://localhost/api/products
```

## Screen recording video

Screen recording video showing all the objects deployed in Kubernetes cluster:

```text
[https://nagarro-my.sharepoint.com/:v:/p/aman_kumar12/IQCs5XaO6x1MSLdzPcznpPvvAXnkjQ16zf7BTdTLYenCLrg
](https://nagarro-my.sharepoint.com/:v:/p/aman_kumar12/IQB_il87XDNTQqoHUmuIfelhAVXw2l3ZB3N9QNcSwmdhJ4s?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=md9Z5p)

```


## Tech Stack

Node.js, Express, PostgreSQL, Docker, Kubernetes, Ingress NGINX, Metrics Server.

## Project Structure

```text
api
  Dockerfile
  package.json
  server.js
k8s
  00-namespace.yaml
  01-api-configmap.yaml
  02-db-secret.yaml
  03-db-init-configmap.yaml
  04-db-statefulset.yaml
  05-api-deployment.yaml
  06-api-service.yaml
  07-api-ingress.yaml
  08-api-hpa.yaml
  kustomization.yaml
docs
  assignment-documentation.md
scripts
  build-push.ps1
  check-tools.ps1
  cleanup.ps1
  deploy.ps1
  load-test.ps1
  verify.ps1
```


## Build and Push API Image

Replace `<your-dockerhub-user>` with your Docker Hub username.

```powershell
.\scripts\build-push.ps1 -DockerHubUser <your-dockerhub-user> -Tag 1.0.0
```

## Deploy to Kubernetes

```powershell
.\scripts\deploy.ps1 -DockerHubUser <your-dockerhub-user> -Tag 1.0.0
```

## Verify the Deployment

```powershell
.\scripts\verify.ps1
```

Open the API in browser:

```text
http://localhost/api/products
```

Expected response shape:

```json
{
  "items": [
    {
      "id": 1,
      "name": "Laptop Stand",
      "category": "Accessories",
      "price": "1299.00",
      "stock": 22
    }
  ]
}
```

## Show All Objects

```powershell
kubectl get all,ingress,hpa,pvc,configmap,secret -n nagp-assignment
```

## Cleanup

```powershell
.\scripts\cleanup.ps1
```

Docker Desktop Kubernetes can also be stopped or deleted from Docker Desktop after the recording.
