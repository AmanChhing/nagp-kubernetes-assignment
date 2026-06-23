param(
  [Parameter(Mandatory = $true)]
  [string]$DockerHubUser,
  [string]$Tag = "1.0.0"
)

$ErrorActionPreference = "Stop"
$Image = "docker.io/$DockerHubUser/nagp-products-api:$Tag"

docker build -t $Image ./api
docker push $Image

Write-Host $Image
