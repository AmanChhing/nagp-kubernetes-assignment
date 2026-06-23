$ErrorActionPreference = "Stop"

kubectl get pods -n nagp-assignment -o wide
kubectl get deploy,sts,svc,ingress,hpa,pvc,configmap,secret -n nagp-assignment
Invoke-RestMethod http://localhost/api/products | ConvertTo-Json -Depth 5
