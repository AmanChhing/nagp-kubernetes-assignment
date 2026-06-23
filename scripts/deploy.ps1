param(
  [Parameter(Mandatory = $true)]
  [string]$DockerHubUser,
  [string]$Tag = "1.0.0"
)

$ErrorActionPreference = "Stop"
$ImageName = "docker.io/$DockerHubUser/nagp-products-api"
$Kustomization = "./k8s/kustomization.yaml"
$Content = Get-Content $Kustomization -Raw
$Content = $Content -replace 'newName: .*/nagp-products-api', "newName: $ImageName"
$Content = $Content -replace 'newTag: "[^"]+"', "newTag: `"$Tag`""
Set-Content $Kustomization $Content -NoNewline
kubectl apply -k ./k8s
kubectl rollout status statefulset/postgres -n nagp-assignment --timeout=180s
kubectl rollout status deployment/products-api -n nagp-assignment --timeout=180s
kubectl get all,ingress,hpa,pvc -n nagp-assignment
